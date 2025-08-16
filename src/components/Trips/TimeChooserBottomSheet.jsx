import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

function TimeChooserBottomSheet({ 
  tripData = {}, 
  onChange, 
  initialTime = null, 
  locale = "ar",
  isOpen,
  onClose
}) {
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [tempSelectedTime, setTempSelectedTime] = useState(initialTime);

  // Translation helper
  const t = {
    title: locale === 'ar' ? 'اختر الوقت' : 'Choose Time',
    save: locale === 'ar' ? 'حفظ' : 'Save',
    cancel: locale === 'ar' ? 'إغلاق' : 'Cancel',
    selectTime: locale === 'ar' ? "اختر وقتًا" : "Select a time",
    availableTimes: locale === 'ar' ? 'الأوقات المتاحة' : 'Available Times'
  };

  // Reset temp time when opened
  useEffect(() => {
    if (isOpen) {
      setTempSelectedTime(selectedTime);
    }
  }, [isOpen, selectedTime]);

  // Initialize time when tripData changes
  useEffect(() => {
    if (tripData?.start_times && tripData.start_times.length > 0) {
      const initialTime = tripData.start_times[0];
      setSelectedTime(initialTime);
      setTempSelectedTime(initialTime);
      if (!initialTime) {
        onChange(initialTime);
      }
    } else {
      setSelectedTime(null);
      setTempSelectedTime(null);
      onChange(null);
    }
  }, [tripData]);

  // Update internal time when initialTime changes
  useEffect(() => {
    if (initialTime) {
      setSelectedTime(initialTime);
    }
  }, [initialTime]);

  // Enhanced time formatting with locale support but English numbers
  const formatTime = (time) => {
    if (!time) return t.selectTime;
    
    const timeString = time;
    const date = new Date(`1970-01-01T${timeString}Z`);
    
    // Get the formatted time in the specified locale
    const formattedTime = date.toLocaleTimeString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });

    // Convert Arabic-Indic digits to Western Arabic numerals (English numbers)
    const englishNumbers = formattedTime.replace(/[٠-٩]/g, function(match) {
      return String.fromCharCode(match.charCodeAt(0) - '٠'.charCodeAt(0) + '0'.charCodeAt(0));
    });

    return englishNumbers;
  };

  const handleTimeSelect = (time) => {
    setTempSelectedTime(time);
  };

  const handleSave = () => {
    setSelectedTime(tempSelectedTime);
    onChange(tempSelectedTime);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedTime(selectedTime);
    onClose();
  };

  if (!isOpen) return null;

  // If no times available
  if (!tripData?.start_times || tripData.start_times.length === 0) {
    return (
      <div className="fixed inset-0 z-[100]">
        <div 
          className="absolute inset-0 bg-black/50 bg-opacity-40"
          onClick={handleCancel}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{t.title}</h3>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* No times content */}
          <div className="px-6 py-8 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-medium text-gray-700 mb-2">
              {locale === 'ar' ? 'لا توجد أوقات متاحة' : 'No times available'}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-4 py-3 text-base font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If only one time available
  if (tripData.start_times.length === 1) {
    return (
      <div className="fixed inset-0 z-[100]">
        <div 
          className="absolute inset-0 bg-black/50 bg-opacity-40"
          onClick={handleCancel}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{t.title}</h3>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Single time content */}
          <div className="px-6 py-8 text-center">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-xl font-bold text-blue-900">
                {formatTime(tripData.start_times[0])}
              </div>
              <div className="text-sm text-blue-700 mt-2">
                {locale === 'ar' ? 'الوقت الوحيد المتاح' : 'Only available time'}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-4 py-3 text-base font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multiple times available
  return (
    <div className="fixed inset-0 z-[100]">
      <div 
        className="absolute inset-0 bg-black/50 bg-opacity-40"
        onClick={handleCancel}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Handle bar */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{t.title}</h3>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="text-sm font-medium text-gray-700 mb-4">{t.availableTimes}</div>
          
          <div className="space-y-2">
            {tripData.start_times.map((time, index) => {
              const isSelected = time === tempSelectedTime;
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                    locale === 'ar' ? 'text-right' : 'text-left'
                  } ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={locale === 'ar' ? 'order-2' : 'order-1'}>
                      <div className={`text-lg font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                        {formatTime(time)}
                      </div>
                    </div>
                    {isSelected && (
                      <div className={`flex-shrink-0 ${locale === 'ar' ? 'order-1' : 'order-2'}`}>
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-3 text-base font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!tempSelectedTime}
              className={`flex-1 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                tempSelectedTime
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeChooserBottomSheet;