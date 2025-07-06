'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

function ConfirmWithdraw({ withdrawId, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    setMessage('');
    setMessageType('');
    setShowModal(false);

    try {
      const response = await fetch('/api/admin/withdraws/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ withdrawId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('تم التأكيد بنجاح');
        setMessageType('success');
        onConfirm()
      } else {
        setMessage(data.error || 'حدث خطأ أثناء التأكيد');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('فشل الاتصال بالخادم');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const MessageIcon = ({ type }) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Main Button */}
      <button
        onClick={openModal}
        disabled={loading}
        className="group relative w-full px-6 py-2 bg-gradient-to-r bg-blue-100 text-blue-600 font-semibold rounded-lg 
                   shadow-lg
                   text-xs
                   transform transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري التأكيد...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
            <span>تأكيد السحب</span>
          </div>
        )}
      </button>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-4 rounded-lg border-l-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
          messageType === 'success' 
            ? 'bg-green-50 border-green-500 text-green-800' 
            : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <MessageIcon type={messageType} />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">تأكيد العملية</h3>
                  <p className="text-sm text-gray-500 mt-1">يرجى التأكد من صحة البيانات</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700 text-center">
                  هل أنت متأكد من تأكيد عملية السحب؟
                </p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  لا يمكن التراجع عن هذا الإجراء
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg 
                          hover:bg-gray-200 transition-colors duration-200
                          focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg 
                          hover:from-blue-700 hover:to-blue-800 transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed
                          focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التأكيد...</span>
                  </div>
                ) : (
                  'تأكيد'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmWithdraw;