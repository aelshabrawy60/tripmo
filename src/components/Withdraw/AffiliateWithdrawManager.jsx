import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CreditCard, Building2, Hash, AlertCircle, CheckCircle, X } from 'lucide-react';
import LoadingCirc from '../Loading/LoadingCirc';
import AffiliateWithdrawConfirmation from './AffiliateWithdrawConfirmation';

export const banks = {
  BOA: "Bank of Alexandria",
  CIB: "Commercial International Bank (CIB)",
  ADIB: "Abu Dhabi Islamic Bank",
  AUB: "Ahli United Bank",
  ABK: "Al Ahli Bank of Kuwait",
  ABRK: "Arab Bank",
  AAIB: "Arab African International Bank",
  ARAB: "Arab Bank",
  ABC: "Arab Banking Corporation",
  ARIB: "Arab International Bank",
  AIB: "Alexandria International Bank",
  BBE: "Banque du Caire",
  AUDI: "Bank Audi",
  BDC: "Banque du Caire",
  MISR: "Banque Misr",
  BLOM: "Blom Bank Egypt",
  CBE: "Central Bank of Egypt",
  CITI: "Citibank",
  CAE: "Credit Agricole Egypt",
  POST: "Egypt Post",
  EALB: "Egyptian Arab Land Bank",
  EGB: "Egyptian Gulf Bank",
  ENBD: "Emirates NBD",
  EDBE: "Export Development Bank of Egypt",
  FAIB: "First Abu Dhabi Bank",
  FAB: "First Abu Dhabi Bank",
  HDB: "Housing and Development Bank",
  HSBC: "HSBC Bank Egypt",
  IDB: "Industrial Development Bank",
  MASH: "Mashreq Bank",
  MIDB: "Misr Iran Development Bank",
  NSB: "National Savings Bank",
  NBE: "National Bank of Egypt",
  NBG: "National Bank of Greece",
  NBK: "National Bank of Kuwait",
  QNB: "Qatar National Bank (QNB Al Ahli)",
  SAIB: "Societe Arabe Internationale de Banque",
  SCB: "Standard Chartered Bank",
  PDAC: "Principal Bank for Development and Agricultural Credit",
  UB: "United Bank of Egypt",
  UNB: "Union National Bank"
};


// Alert Component
const Alert = ({ type, message, onClose }) => (
  <div className={`fixed top-4 left-4 z-50 max-w-md p-4 rounded-lg shadow-lg border ${
    type === 'error' 
      ? 'bg-red-50 border-red-200 text-red-800' 
      : 'bg-green-50 border-green-200 text-green-800'
  }`}>
    <div className="flex items-start">
      {type === 'error' ? (
        <AlertCircle className="w-5 h-5 mt-0.5 ml-3 flex-shrink-0" />
      ) : (
        <CheckCircle className="w-5 h-5 mt-0.5 ml-3 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button onClick={onClose} className="mr-3 flex-shrink-0">
        <X className="w-4 h-4 hover:opacity-70" />
      </button>
    </div>
  </div>
);

// Header Component
const Header = ({onAddClick }) => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
            طرق السحب
        </h1>
        <p className="text-gray-600">إدارة طرق سحب المدفوعات الخاصة بك</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={onAddClick}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة طريقة
        </button>
      </div>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="col-span-full flex justify-center items-center py-12">
    <LoadingCirc/>
  </div>
);

// Empty State Component
const EmptyState = ({ onAddClick }) => (
  <div className="col-span-full text-center py-12">
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12">
      <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">لا توجد طرق</h3>
      <p className="text-gray-500 mb-6">أضف طريقة السحب الأولى للبدء</p>
      <button
        onClick={onAddClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        إضافة طريقة
      </button>
    </div>
  </div>
);

const getMethodLabel = (method) => {
    switch (method) {
      case 'bank':
        return 'تحويل بنكي';
      case 'instant wallet':
        return 'محفظة';
      case 'card':
        return 'بطاقة';
      default:
        return method;
    }
};

// Method Icon Component
const MethodIcon = ({ methode }) => {
  const getIcon = () => {
    switch (methode.toLowerCase()) {
      case 'bank transfer':
      case 'bank':
      case 'تحويل بنكي':
      case 'بنك':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'credit card':
      case 'debit card':
      case 'بطاقة ائتمان':
      case 'بطاقة خصم':
        return <CreditCard className="w-5 h-5 text-green-500" />;
      default:
        return <Hash className="w-5 h-5 text-gray-500" />;
    }
  };

  return getIcon();
};


const MethodCard = ({ method, onEdit, onDelete }) => {
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <MethodIcon methode={method.methode} />
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{getMethodLabel(method.methode)}</h3>
              <p className="text-gray-500 text-sm">المعرف: {method.id}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(method)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="تعديل الطريقة"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(method.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="حذف الطريقة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium">{banks[method.bank] || method.bank}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-mono">{method.number}</span>
          </div>
        </div>

        <div className='mt-4'>
          <button 
            onClick={() => setShowWithdrawPopup(true)}
            className='w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition-colors'
          >
            استلام الأموال
          </button>
        </div>
      </div>

      {/* Popup Overlay */}
      {showWithdrawPopup && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <AffiliateWithdrawConfirmation
              withdrawMethod={method}
              onClose={() => setShowWithdrawPopup(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

// Methods Grid Component
const MethodsGrid = ({ methods, loading, onEdit, onDelete, onAddClick }) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {loading && methods.length === 0 ? (
      <LoadingSpinner />
    ) : methods.length === 0 ? (
      <EmptyState onAddClick={onAddClick} />
    ) : (
      methods.map((method) => (
        <MethodCard
          key={method.id}
          method={method}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))
    )}
  </div>
);

// Form Input Component
const FormInput = ({ label, value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

// Modal Component
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  formData, 
  onFormDataChange, 
  onSubmit, 
  loading,
  submitText 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                نوع الطريقة
            </label>
            <select
                value={formData.methode}
                onChange={(e) => {
                  const newMethode = e.target.value;
                  onFormDataChange({ 
                    ...formData, 
                    methode: newMethode,
                    // Reset bank fields when method changes
                    bank: '',
                    bankInput: '',
                    showBankOptions: false
                  });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
            >
                <option value="">اختر نوع الطريقة</option>
                <option value="bank">تحويل بنكي</option>
                <option value="instant wallet">محفظة</option>
                <option value="card">بطاقة</option>
            </select>
          </div>

          
          {formData.methode !== 'instant wallet' && (
            <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                البنك/المؤسسة
                </label>
                <input
                type="text"
                value={formData.bankInput || ''}
                onChange={(e) => {
                    const input = e.target.value;
                    onFormDataChange({
                    ...formData,
                    bankInput: input,
                    bank: '', // Clear bank key when typing
                    showBankOptions: true
                    });
                }}
                onFocus={() =>
                    onFormDataChange({ ...formData, showBankOptions: true })
                }
                onBlur={() => {
                  // Delay hiding options to allow clicking
                  setTimeout(() => {
                    onFormDataChange({ ...formData, showBankOptions: false });
                  }, 200);
                }}
                placeholder="ابحث عن البنك"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                />
                {formData.showBankOptions && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-lg">
                    {Object.entries(banks)
                    .filter(([_, label]) =>
                        (formData.bankInput || '').trim() === ''
                        ? true
                        : label
                            .toLowerCase()
                            .includes(formData.bankInput.toLowerCase())
                    )
                    .map(([key, label]) => (
                        <li
                        key={key}
                        onMouseDown={() => {
                            onFormDataChange({
                            ...formData,
                            bank: key,
                            bankInput: label,
                            showBankOptions: false
                            });
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                        {label}
                        </li>
                    ))}
                    {Object.entries(banks).filter(([_, label]) =>
                    (formData.bankInput || '').trim() === ''
                        ? true
                        : label
                            .toLowerCase()
                            .includes(formData.bankInput.toLowerCase())
                    ).length === 0 && (
                    <li className="px-4 py-2 text-gray-500">لا يوجد نتائج</li>
                    )}
                </ul>
                )}
            </div>
            )}

          
          <FormInput
            label="رقم الحساب"
            value={formData.number}
            onChange={(e) => onFormDataChange({...formData, number: e.target.value})}
            placeholder="رقم الحساب أو البطاقة"
            required
          />
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              {loading ? 'جاري الحفظ...' : submitText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Hook for API operations
const useWithdrawMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMethods = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/affiliate/withdraw/methods`);
      const result = await response.json();
      
      if (result.success) {
        setMethods(result.data);
      } else {
        setError(result.error || 'فشل في جلب الطرق');
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة');
    } finally {
      setLoading(false);
    }
  };

  const submitMethod = async (formData, editingMethod) => {
    if (!formData.methode || !formData.number || (formData.methode !== "instant wallet" && !formData.bank)) {
      setError('جميع الحقول مطلوبة');
      return false;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = '/api/affiliate/withdraw/methods';
      const method = editingMethod ? 'PUT' : 'POST';
      
      // Clean form data - remove UI-only fields
      const cleanFormData = {
        methode: formData.methode,
        bank: formData.bank,
        number: formData.number
      };
      
      const body = editingMethod 
        ? { id: editingMethod.id, ...cleanFormData }
        : { ...cleanFormData };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      
      if (result.success) {
        setSuccess(editingMethod ? 'تم تحديث الطريقة بنجاح!' : 'تم إضافة الطريقة بنجاح!');
        return true;
      } else {
        setError(result.error || 'فشلت العملية');
        return false;
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMethod = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الطريقة؟')) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/affiliate/withdraw/methods?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setSuccess('تم حذف الطريقة بنجاح!');
        return true;
      } else {
        setError(result.error || 'فشل الحذف');
        return false;
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    methods,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchMethods,
    submitMethod,
    deleteMethod
  };
};

// Main Component
const AffiliateWithdrawMethodsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    methode: '',
    bank: '',
    number: '',
    bankInput: '',
    showBankOptions: false
  });

  const {
    methods,
    loading,
    error,
    success,
    setError,
    setSuccess,
    fetchMethods,
    submitMethod,
    deleteMethod
  } = useWithdrawMethods();

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSubmit = async () => {
    const success = await submitMethod(formData, editingMethod);
    if (success) {
      setIsModalOpen(false);
      resetForm();
      fetchMethods();
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteMethod(id);
    if (success) {
      fetchMethods();
    }
  };

  const openModal = (method = null) => {
    setEditingMethod(method);
    if (method) {
      // When editing, set the bank input to display the bank name
      const bankName = banks[method.bank] || method.bank;
      setFormData({
        methode: method.methode,
        bank: method.bank,
        number: method.number,
        bankInput: bankName,
        showBankOptions: false
      });
    } else {
      setFormData({
        methode: '',
        bank: '',
        number: '',
        bankInput: '',
        showBankOptions: false
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setFormData({ 
      methode: '', 
      bank: '', 
      number: '',
      bankInput: '',
      showBankOptions: false
    });
    setEditingMethod(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError('');
  };

  return (
    <div>
      <div className="mx-auto">
        <Header 
          onAddClick={() => openModal()}
        />

        <MethodsGrid
          methods={methods}
          loading={loading}
          onEdit={openModal}
          onDelete={handleDelete}
          onAddClick={() => openModal()}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingMethod ? 'تعديل الطريقة' : 'إضافة طريقة جديدة'}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          submitText={editingMethod ? 'تحديث' : 'إضافة طريقة'}
        />

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}
        
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}
      </div>
    </div>
  );
};

export default AffiliateWithdrawMethodsManager;