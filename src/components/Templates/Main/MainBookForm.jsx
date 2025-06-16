"use client"
import React, { useEffect, useState } from 'react';
import { Phone, User, Calendar, Users, ArrowRight, X } from 'lucide-react';

function BookingFormWithModal({ tripId, date, numberOfSeats, onSuccess }) {
  // Form state
  const offset = -new Date().getTimezoneOffset() / 60

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    numberOfSeats: numberOfSeats,
    // Fix: Check if date is a Date object before calling toISOString
    date: date instanceof Date ? date.toISOString().split('T')[0] : date,
    tripId: tripId,
    offset: offset

  });
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Update formData when props change
  useEffect(() => {
    const offset = -new Date().getTimezoneOffset() / 60

    setFormData(prevData => ({
      ...prevData,
      numberOfSeats: numberOfSeats,
      date: date instanceof Date ? date.toISOString().split('T')[0] : date,
      tripId: tripId,
      offset: offset
    }));
  }, [date, numberOfSeats, tripId]);

  // Form validation
  const [validation, setValidation] = useState({
    name: true,
    phone: true
  });
  
  const validateForm = () => {
    const newValidation = {
      name: formData.name.trim().length >= 3,
      phone: /^[\d+]{8,15}$/.test(formData.phone.trim())
    };
    
    setValidation(newValidation);
    return Object.values(newValidation).every(Boolean);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open and close modal functions
  const openModal = () => {
    setIsModalOpen(true);
    // Reset form data when opening modal
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add a booking
  const addBooking = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('يرجى تعبئة جميع الحقول بشكل صحيح');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Make API request using fetch instead of axios
      const response = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (response.ok) {
        setSuccess('تم الحجز بنجاح');
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        throw new Error(`Error adding booking: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error adding booking:", err);
      setError(err.message || 'فشل في إضافة الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  //
  // Format date for display
  const formatDateForDisplay = () => {
    if (!formData.date) return '';
    
    try {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
        return formData.date;
      }
      
      // Otherwise, try to parse and format
      const dateObj = new Date(formData.date);
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return formData.date || '';
    }
  };

  return (
    <>
      {/* Booking Button */}
      <button
        onClick={openModal}
        className="bg-blue-600 w-full hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
      >
        حجز الآن
        <ArrowRight size={18} />
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 z-40 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn">
            {/* Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            {/* Form Header */}
            <div className="border-b border-gray-200 p-4 text-right">
              <h3 className="text-lg font-medium text-gray-900">احجز رحلتك</h3>
            </div>
            
            {/* Form Content */}
            <div className="p-6">      
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-right">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-right">
                  {success}
                </div>
              )}
              
              <div className="space-y-4" dir="rtl">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="الاسم"
                    className={`w-full pr-10 py-3 border ${validation.name ? 'border-gray-300' : 'border-red-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right`}
                  />
                  <User className="absolute right-3 top-3 text-gray-400" size={20} />
                  {!validation.name && <p className="text-red-500 text-sm mt-1">يرجى إدخال اسم صحيح (3 أحرف على الأقل)</p>}
                </div>
                
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="رقم الهاتف"
                    className={`w-full pr-10 py-3 border ${validation.phone ? 'border-gray-300' : 'border-red-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right`}
                  />
                  <Phone className="absolute right-3 top-3 text-gray-400" size={20} />
                  {!validation.phone && <p className="text-red-500 text-sm mt-1">يرجى إدخال رقم هاتف صحيح</p>}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-gray-700 text-sm">التاريخ:</div>
                    <div className="font-medium">{formatDateForDisplay()}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-gray-700 text-sm">عدد المقاعد:</div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-center font-medium">{formData.numberOfSeats}</span>
                    </div>
                  </div>
                </div>
                
                
                <button
                  onClick={addBooking}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      تأكيد الحجز
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingFormWithModal;