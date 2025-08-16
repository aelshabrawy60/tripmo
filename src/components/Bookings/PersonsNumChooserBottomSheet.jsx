import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function PersonsNumChooserBottomSheet({ 
  onChange, 
  initialValue = { adults: 1, children: 0, infants: 0 },
  locale = "ar", 
  tripPersonsGroups = { ChildPrice: null, InfantPrice: null },
  isOpen,
  onClose
}) {
  const [counts, setCounts] = useState(initialValue);
  const [tempCounts, setTempCounts] = useState(initialValue);

  // Translation helper
  const t = {
    title: locale === 'ar' ? 'عدد الأفراد' : 'Number of persons',
    adults: locale === 'ar' ? 'البالغين' : 'Adults',
    children: locale === 'ar' ? 'الأطفال' : 'Children',
    infants: locale === 'ar' ? 'الرضع' : 'Infants',
    save: locale === 'ar' ? 'حفظ' : 'Save',
    cancel: locale === 'ar' ? 'اغلاق' : 'Cancel',
    adultsAgeRange: locale === 'ar' ? 'اكبر من 12 عام' : 'age 12+',
    childrenAgeRange: locale === 'ar' ? '(3-12) عام' : 'age 3-12',
    infantsAgeRange: locale === 'ar' ? '2 عام او اقل' : 'age 0-2',
  };

  const isChildrenAllowed = tripPersonsGroups.ChildPrice !== null && tripPersonsGroups.ChildPrice !== -1;
  const isInfantsAllowed = tripPersonsGroups.InfantPrice !== null && tripPersonsGroups.InfantPrice !== -1;


  // Reset temp counts when opened
  useEffect(() => {
    if (isOpen) {
      setTempCounts(counts);
    }
  }, [isOpen, counts]);

  // Update internal counts when initialValue changes
  useEffect(() => {
    setCounts(initialValue);
  }, [initialValue]);

  const handleDecrement = (type) => {
    const minValue = type === 'adults' ? 1 : 0;
    if (tempCounts[type] > minValue) {
      setTempCounts(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
    }
  };

  const handleIncrement = (type) => {
    setTempCounts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const handleSave = async () => {
    setCounts(tempCounts);
    onChange(tempCounts);
    onClose();
  };

  const handleCancel = () => {
    setTempCounts(counts);
    onClose();
  };

  const renderAgeGroupSelector = (type, label, value, info, minValue = 0) => (
    <div key={type} className="flex items-center justify-between py-4">
      <div className="text-base font-medium text-gray-700">
        {label} 
        <div className='text-sm text-gray-600 mt-1'>{info}</div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => handleDecrement(type)}
          disabled={value <= minValue}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-colors border
          ${value <= minValue 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
        >
          -
        </button>

        <div className="mx-4 font-semibold text-lg text-center min-w-[32px]">{value}</div>

        <button
          type="button"
          onClick={() => handleIncrement(type)}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="w-10 h-10 rounded-full bg-white text-gray-700 flex items-center justify-center font-bold text-xl hover:bg-gray-50 transition-colors border border-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      
        <div 
          className="absolute inset-0 bg-black/50 bg-opacity-40"
          onClick={handleCancel}
        />
      
      
      {/* Mobile Bottom Sheet */}
      
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
          <div className="px-6 py-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {/* Adults selector - always shown */}
            {renderAgeGroupSelector('adults', t.adults, tempCounts.adults, t.adultsAgeRange, 1)}
            
            {/* Children selector - shown if allowed */}
            {isChildrenAllowed && renderAgeGroupSelector('children', t.children, tempCounts.children, t.childrenAgeRange, 0)}

            {/* Infants selector - shown if allowed */}
            {isInfantsAllowed && renderAgeGroupSelector('infants', t.infants, tempCounts.infants, t.infantsAgeRange, 0)}
          </div>

          {/* Footer with buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className={`flex space-x-3`}>
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
                className={` flex-1 px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      
    </div>
  );
}

export default PersonsNumChooserBottomSheet;