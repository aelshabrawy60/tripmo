"use client";
import React, { useState, useRef, useEffect } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AddUser = ({ onPlayerAdded , groupId}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const modalRef = useRef(null);

  // Auto-focus the name field when modal opens
  useEffect(() => {
    if (isModalOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isModalOpen]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    // Reset form state
    setName('');
    setPhone(undefined);
    setError(null);
    setSuccessMessage(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (!name.trim()) {
      setError("الإسم مطلوب.");
      setIsSubmitting(false);
      nameInputRef.current?.focus();
      return;
    }
    
    if (!phone) {
      setError("رقم الهاتف مطلوب.");
      setIsSubmitting(false);
      phoneInputRef.current?.focus();
      return;
    }

    if (phone && !isValidPhoneNumber(phone)) {
      setError("رقم الهاتف غير صالح.");
      setIsSubmitting(false);
      phoneInputRef.current?.focus();
      return;
    }

    const phoneToSend = phone.startsWith('+') ? phone.substring(1) : phone;

    try {
      const response = await fetch('/api/dashboard/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneToSend, name, groupId: groupId }),
      });

      const data = await response.json();
      
      if(response.status === 409){
        setError("هذا الرقم مسجل بالفعل");
        setIsSubmitting(false);
        phoneInputRef.current?.focus();
        return;
      }
      
      if (!response.ok) {        
        setError(data.error || `فشل إضافة العميل. الحالة: ${response.status}`);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(`تمت إضافة العميل ${name} بنجاح!`);
      setName('');
      setPhone(undefined);
      onPlayerAdded(); // Refresh player list
      
      // Automatically close modal after successful submission
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (e) {
      setError(e.message || "حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="w-full max-w-md mx-auto px-6 py-3 bg-tripmo-500 text-white rounded-md hover:bg-tripmo-400 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        إضافة عميل جديد
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4" dir="rtl">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">إضافة عميل جديد</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="إغلاق"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border-r-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 text-right flex items-center animate-fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-100 border-r-4 border-green-500 text-green-700 px-4 py-3 rounded mb-4 text-right flex items-center animate-fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                  الإسم <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tripmo-500 transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسم اللاعب"
                  ref={nameInputRef}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <div className="phone-input-wrapper" dir="ltr">
                  <PhoneInput
                    international
                    defaultCountry="EG"
                    value={phone}
                    onChange={setPhone}
                    className="custom-phone-input"
                    inputRef={phoneInputRef}
                    numberInputProps={{
                      className: "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tripmo-500 transition-colors",
                      style: { textAlign: 'left' }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">مثال: +20 1xx xxx xxxx</p>
              </div>

              <div className="flex justify-between pt-2 space-x-4">
                
                <button
                  type="submit"
                  className={`w-full bg-tripmo-500 text-white py-2 px-4 rounded-md font-medium text-base transition-all duration-300 hover:bg-tripmo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري...
                    </span>
                  ) : (
                    'إضافة عميل'
                  )}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300 flex-1"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;