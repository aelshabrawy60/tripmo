import React, { useState, useRef, useEffect } from 'react';
import { Users } from 'lucide-react';

function PersonsNumChooser({ 
  onChange, 
  initialValue = { adults: 1, children: 0, infants: 0 }, 
  locale, 
  tripPersonsGroups = { ChildPrice: null, InfantPrice: null } 
}) {
  const [counts, setCounts] = useState(initialValue);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [tempCounts, setTempCounts] = useState(initialValue);
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
    adults: locale === 'ar' ? 'البالغين' : 'Adults',
    children: locale === 'ar' ? 'الأطفال' : 'Children',
    infants: locale === 'ar' ? 'الرضع' : 'Infants',
    save: locale === 'ar' ? 'حفظ' : 'Save',
    cancel: locale === 'ar' ? 'اغلاق' : 'Cancel'
  };

  // Check which age groups are allowed
  const isChildrenAllowed = tripPersonsGroups.ChildPrice !== null && tripPersonsGroups.ChildPrice !== -1;
  const isInfantsAllowed = tripPersonsGroups.InfantPrice !== null && tripPersonsGroups.InfantPrice !== -1;

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

  const handleSave = () => {
    setCounts(tempCounts);
    onChange(tempCounts);
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setTempCounts(counts);
    setIsPopupOpen(false);
  };

  const getTotalCount = (countsObj = counts) => {
    return countsObj.adults + countsObj.children + countsObj.infants;
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
    const popupHeight = popupRect.height || 200; // Estimated height (increased for multiple selectors)

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
  }, [isPopupOpen, counts]);

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

  const renderAgeGroupSelector = (type, label, value, info,  minValue = 0, ) => (
    <div key={type} className="flex items-center justify-between py-2">
      <div className="text-sm font-medium text-gray-700">{label} <div className='text-[11px] text-gray-600 mt-1'>{info}</div></div>
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => handleDecrement(type)}
          disabled={value <= minValue}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors
          ${value <= minValue ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          -
        </button>

        <div className="mx-3 font-medium text-center min-w-[24px]">{value}</div>

        <button
          type="button"
          onClick={() => handleIncrement(type)}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setTempCounts(counts);
          setIsPopupOpen(true);
        }}
        className="flex w-full items-center space-x-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Users className="text-gray-600" size={20} />
        <span className="font-medium">{getTotalCount()}</span>
      </button>

      {isPopupOpen && (
        <div
          ref={popupRef}
          className={`${getPositionClasses()} bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50 w-68`}
          style={getTransformStyle()}
        >
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              {/* Adults selector - always shown */}
              {renderAgeGroupSelector('adults', t.adults, tempCounts.adults, 'اكبر من 12 عام' ,1)}
              
              {/* Children selector - shown if allowed */}
              {isChildrenAllowed && renderAgeGroupSelector('children', t.children, tempCounts.children, '(3-12) عام', 0)}

              {/* Infants selector - shown if allowed */}
              {isInfantsAllowed && renderAgeGroupSelector('infants', t.infants, tempCounts.infants, '2 عام او اقل', 0)}
            </div>

            <div className="flex space-x-2 pt-2 border-gray-200">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t.save}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
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