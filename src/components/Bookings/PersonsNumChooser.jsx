
import React, { useState, useRef, useEffect } from 'react';
import { Users } from 'lucide-react';

function PersonsNumChooser({ onChange, initialValue = 1, locale }) {
  const [count, setCount] = useState(initialValue);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tempCount, setTempCount] = useState(initialValue);
  const [popupPosition, setPopupPosition] = useState({ 
    vertical: 'bottom', 
    horizontal: 'left',
    transform: { x: 0, y: 0 }
  });
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  // Translation helper
  const t = {
    title: locale === 'ar' ? 'عدد الأفراد' : 'Number of persons',
    save: locale === 'ar' ? 'حفظ' : 'Save',
    cancel: locale === 'ar' ? 'اغلاق' : 'Cancel'
  };

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
    setTempCount(count);
    setIsPopupOpen(false);
  };

  const calculateOptimalPosition = () => {
    if (!buttonRef.current || !popupRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const margin = 8; // Minimum margin from viewport edges
    const popupWidth = 256; // w-64 = 16rem = 256px
    const popupHeight = popupRect.height || 160; // Estimated height

    let vertical = 'bottom';
    let horizontal = 'left';
    let transformX = 0;
    let transformY = 0;

    // Determine vertical position
    const spaceBelow = viewport.height - buttonRect.bottom - margin;
    const spaceAbove = buttonRect.top - margin;

    if (spaceBelow >= popupHeight) {
      vertical = 'bottom';
      transformY = margin;
    } else if (spaceAbove >= popupHeight) {
      vertical = 'top';
      transformY = -margin;
    } else {
      // Not enough space above or below, choose the side with more space
      vertical = spaceBelow > spaceAbove ? 'bottom' : 'top';
      transformY = vertical === 'bottom' ? margin : -margin;
    }

    // Determine horizontal position
    const spaceRight = viewport.width - buttonRect.left - margin;
    const spaceLeft = buttonRect.right - margin;

    if (spaceRight >= popupWidth) {
      horizontal = 'left';
      transformX = 0;
    } else if (spaceLeft >= popupWidth) {
      horizontal = 'right';
      transformX = 0;
    } else {
      // Not enough space on either side, center it as best as possible
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const idealLeft = buttonCenter - popupWidth / 2;
      
      if (idealLeft < margin) {
        horizontal = 'left';
        transformX = margin - buttonRect.left;
      } else if (idealLeft + popupWidth > viewport.width - margin) {
        horizontal = 'right';
        transformX = (viewport.width - margin) - buttonRect.right;
      } else {
        horizontal = 'left';
        transformX = idealLeft - buttonRect.left;
      }
    }

    setPopupPosition({
      vertical,
      horizontal,
      transform: { x: transformX, y: transformY }
    });
  };

  useEffect(() => {
    if (isPopupOpen) {
      // Small delay to ensure popup is rendered before calculating position
      const timer = setTimeout(calculateOptimalPosition, 0);
      
      const handleResize = () => calculateOptimalPosition();
      const handleScroll = () => calculateOptimalPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isPopupOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
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

  const getPositionClasses = () => {
    const { vertical, horizontal } = popupPosition;
    
    let classes = 'absolute ';
    
    // Vertical positioning
    if (vertical === 'bottom') {
      classes += 'top-full ';
    } else {
      classes += 'bottom-full ';
    }
    
    // Horizontal positioning
    if (horizontal === 'left') {
      classes += 'left-0 ';
    } else {
      classes += 'right-0 ';
    }
    
    return classes;
  };

  const getTransformStyle = () => {
    const { transform } = popupPosition;
    return {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
    };
  };

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
          className={`${getPositionClasses()} bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50 w-64`}
          style={getTransformStyle()}
        >
          <div className="flex flex-col space-y-4">
            <div className="text-sm font-medium text-gray-700">{t.title}</div>

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

              <div className="mx-3 font-medium text-center min-w-[24px]">{tempCount}</div>

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
                {t.save}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default PersonsNumChooser;
