import React, { useState, useRef, useEffect } from 'react';
import { Users } from 'lucide-react';

function PersonsNumChooser({ onChange, initialValue = 1 }) {
  const [count, setCount] = useState(initialValue);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tempCount, setTempCount] = useState(initialValue);
  const [popupPosition, setPopupPosition] = useState({ top: true, right: false });
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const handleDecrement = () => {
    if (tempCount > 1) {
      setTempCount(tempCount - 1);
    }
  };
  
  const handleIncrement = () => {
    setTempCount(tempCount + 1);
  };

  const handleSave = () => {
    setCount(tempCount);
    onChange(tempCount);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setTempCount(count); // Reset to original value
    setIsPopupOpen(false);
  };

  // Handle popup positioning
  useEffect(() => {
    if (isPopupOpen && buttonRef.current && popupRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      
      // Check vertical position
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const showBelow = spaceBelow >= popupRect.height;
      
      // Check horizontal position
      const viewportWidth = window.innerWidth;
      const spaceRight = viewportWidth - buttonRect.left;
      const alignRight = spaceRight < popupRect.width;
      
      setPopupPosition({ top: showBelow, right: alignRight });
    }
  }, [isPopupOpen]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        handleCancel();
      }
    }

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen, count]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setTempCount(count);
          setIsPopupOpen(true);
        }}
        className="flex w-full items-center space-x-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Users className="text-gray-600" size={20} />
        <span className="font-medium">{count}</span>
      </button>

      {isPopupOpen && (
        <div 
          ref={popupRef}
          className={`absolute ${popupPosition.top ? 'top-full mt-2' : 'bottom-full mb-2'} 
                     ${popupPosition.right ? 'right-0' : 'left-0'} 
                     bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-10 w-64`}
        >
          <div className="flex flex-col space-y-4">
            <div className="text-sm font-medium text-gray-700">عدد الأفراد</div>
            
            <div className="flex items-center justify-between border border-gray-200 rounded-lg p-2 bg-gray-50">
              <button 
                type="button"
                onClick={handleDecrement}
                disabled={tempCount <= 1}
                aria-label="Decrease number of persons"
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors
                ${tempCount <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                -
              </button>
              
              <div className="mx-3 font-medium text-center min-w-[24px]">
                {tempCount}
              </div>
              
              <button 
                type="button"
                onClick={handleIncrement}
                aria-label="Increase number of persons"
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                حفظ
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                اغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonsNumChooser;