import React, { useState, useEffect } from 'react';
import { Check, X, Plus, CreditCard, Trash2 } from 'lucide-react';

import { gates } from './gates';

function EditPaymentGateModal({ gate, isOpen, onClose, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [selectedGate, setSelectedGate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    groupId: '',
    type: '',
    key_1: '',
    key_2: '',
    key_3: '',
    status: null,
    mode: 'test',
    deposit_methodes: [],
    gateId: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newMethod, setNewMethod] = useState({ name: '', id: '', note: '' });

  // Effect to sync external isOpen prop with internal state
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  // Effect to populate form data when gate prop changes
  useEffect(() => {
    if (gate) {
      setFormData({
        name: gate.name || '',
        groupId: gate.groupId || '',
        type: gate.type || '',
        key_1: gate.key_1 || '',
        key_2: gate.key_2 || '',
        key_3: gate.key_3 || '',
        status: gate.status,
        mode: gate.mode || 'test',
        deposit_methodes: Array.isArray(gate.deposit_methodes) 
          ? gate.deposit_methodes 
          : (typeof gate.deposit_methodes === 'string' 
            ? JSON.parse(gate.deposit_methodes) 
            : []),
        gateId: gate.id
      });

      console.log("gateType", gate.type)
      // Find the matching gate from gates array
      const matchingGate = gates.find(g => g.name === gate.name);
      console.log("matchingGate", matchingGate)
      setSelectedGate(matchingGate || null);
    }
  }, [gate]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSuccessMessage('');
    setErrorMessage('');
    if (onClose) onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMethodInputChange = (e) => {
    const { name, value } = e.target;
    setNewMethod(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPaymentMethod = () => {
    if (!newMethod.name || !newMethod.id) {
      setErrorMessage('يرجى إدخال اسم وسيلة الدفع ورقم الحساب');
      return;
    }

    setFormData(prev => ({
      ...prev,
      deposit_methodes: [...prev.deposit_methodes, { ...newMethod }]
    }));
    
    setNewMethod({ name: '', id: '', note: '' });
    setErrorMessage('');
  };

  const removePaymentMethod = (index) => {
    setFormData(prev => ({
      ...prev,
      deposit_methodes: prev.deposit_methodes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Convert deposit_methodes to string if needed for backend
    const submitData = {
      ...formData,
      deposit_methodes: JSON.stringify(formData.deposit_methodes)
    };

    try {
      const response = await fetch('/api/dashboard/payments/gates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('تم تحديث بوابة الدفع بنجاح');
        setTimeout(() => {
          closeModal();
          if (onUpdate) onUpdate();
        }, 1000);
      } else {
        setErrorMessage(result.message || 'حدث خطأ أثناء تحديث بوابة الدفع');
      }
    } catch (error) {
      setErrorMessage('حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if modal is not open
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 p-4 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">تعديل بوابة الدفع</h3>
          <button onClick={closeModal} className="text-white hover:text-blue-200">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-300 text-green-800 p-3 rounded flex items-center gap-2">
              <Check size={18} />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-red-100 border border-red-300 text-red-800 p-3 rounded flex items-center gap-2">
              <X size={18} />
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">   
            {selectedGate?.type === "auto" && (
              selectedGate.config.map((configItem, index) => {
                const configKey = Object.keys(configItem)[0];
                const formKey = Object.values(configItem)[0];

                return (
                  <div key={index}>
                    <label className="block text-gray-700 mb-1 font-medium">{configKey}</label>
                    <input
                      type="text"
                      name={formKey}
                      value={formData[formKey] || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })
            )}

            {selectedGate && selectedGate.type === "auto" && (
              <div>
                <label className="block text-gray-700 mb-1 font-medium">وضع التشغيل</label>
                <select 
                  name="mode" 
                  value={formData.mode} 
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="live">تشغيل فعلي</option>
                  <option value="test">اختبار</option>
                </select>
              </div>
            )}

            {/* Display deposit methods fields only for manual gate type */}
            {selectedGate && selectedGate.type === 'manual' && (
              <div className="space-y-4 mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-lg font-medium mb-3 text-gray-800">وسائل الدفع</h4>
                
                {/* List of added payment methods */}
                {formData.deposit_methodes.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {formData.deposit_methodes.map((method, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.id}</div>
                          {method.note && <div className="text-xs text-gray-500">{method.note}</div>}
                        </div>
                        <button 
                          type="button"
                          onClick={() => removePaymentMethod(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add new payment method form */}
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1 text-sm">اسم وسيلة الدفع</label>
                    <input
                      type="text"
                      name="name"
                      value={newMethod.name}
                      onChange={handleMethodInputChange}
                      placeholder="مثال: فودافون كاش"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1 text-sm">رقم الحساب</label>
                    <input
                      type="text"
                      name="id"
                      value={newMethod.id}
                      onChange={handleMethodInputChange}
                      placeholder="مثال: 01019689098"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1 text-sm">ملاحظات (اختياري)</label>
                    <input
                      type="text"
                      name="note"
                      value={newMethod.note}
                      onChange={handleMethodInputChange}
                      placeholder="مثال: متحولش كسور"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={addPaymentMethod}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 mt-2"
                  >
                    <Plus size={16} />
                    <span>إضافة وسيلة دفع</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'جاري التحديث...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPaymentGateModal;