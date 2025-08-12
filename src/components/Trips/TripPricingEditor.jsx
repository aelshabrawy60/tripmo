import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Info,
  CreditCard
} from 'lucide-react';
import { PiMoney } from 'react-icons/pi';

function TripPricingEditor({ onChange, initialValue = null, fixedDate = false }) {
  const MIN_ADVANCE_PERCENTAGE = 20; // Define the minimum advance percentage

  const [personPrice, setPersonPrice] = useState(initialValue?.PersonPrice?.toString() || '300');
  const [childPrice, setChildPrice] = useState(initialValue?.ChildPrice?.toString() || parseNumberValue(personPrice) / 2);
  const [infantPrice, setInfantPrice] = useState(initialValue?.InfantPrice?.toString() || '0');
  const [notAllowedChildren, setNotAllowedChildren] = useState(initialValue?.ChildPrice === -1);
  const [notAllowedInfants, setNotAllowedInfants] = useState(initialValue?.InfantPrice === -1);

  const [customDayPricing, setCustomDayPricing] = useState(false);
  const [customPersonPricing, setCustomPersonPricing] = useState(false);
  
  // Initialize advancePaymentPercentage state, ensuring it's at least MIN_ADVANCE_PERCENTAGE
  const [advancePaymentPercentage, setAdvancePaymentPercentage] = useState(() => {
    const initialAdvance = initialValue?.AdvancePaymentPercentage;
    if (initialAdvance !== undefined) {
      return Math.max(initialAdvance, MIN_ADVANCE_PERCENTAGE);
    }
    return MIN_ADVANCE_PERCENTAGE; // Default to MIN_ADVANCE_PERCENTAGE if no initial value
  });

  const [showSummary, setShowSummary] = useState(true);
  const [showPreview, setShowPreview] = useState(false); // This state is declared but not used in the provided code.
  
  // Days of week in Arabic - indexed 0-6 (Sunday is 0)
  const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  
  // Initialize day pricing
  const [dayPricing, setDayPricing] = useState([]);
  
  // Initialize person pricing
  const [personPricing, setPersonPricing] = useState([]);
  
  const initialized = React.useRef(false);

  useEffect(() => {
    if (initialValue && !initialized.current) {
      initialized.current = true;

      setPersonPrice(initialValue.PersonPrice?.toString() || '300');
      
      const initChild = initialValue?.ChildPrice ?? parseNumberValue(personPrice) / 2;
      const initInfant = initialValue?.InfantPrice ?? 0;

      setChildPrice(initChild === -1 ? '' : initChild.toString());
      setInfantPrice(initInfant === -1 ? '' : initInfant.toString());
      setNotAllowedChildren(initChild === -1);
      setNotAllowedInfants(initInfant === -1);



      if (initialValue.PricePerWeeklyDays?.length > 0) {
        setCustomDayPricing(true);
        const dayPricingData = initialValue.PricePerWeeklyDays.map(item => ({
          day: item.weekly_day.toString(),
          percentage: item.price.toString(),
        }));
        setDayPricing(dayPricingData);
      } else {
        setCustomDayPricing(false); // Ensure this is reset if initialValue doesn't have it
        setDayPricing([]);
      }

      if (initialValue.PricePerPersons?.length > 0) {
        setCustomPersonPricing(true);
        const personPricingData = initialValue.PricePerPersons.map(item => ({
          count: item.personsCount.toString(),
          percentage: item.price.toString(),
        }));
        setPersonPricing(personPricingData);
      } else {
        setCustomPersonPricing(false); // Ensure this is reset
        setPersonPricing([]);
      }
      
      // Ensure advancePaymentPercentage from initialValue is also at least MIN_ADVANCE_PERCENTAGE
      const initialAdvanceVal = initialValue.AdvancePaymentPercentage;
      setAdvancePaymentPercentage(
        initialAdvanceVal !== undefined
          ? Math.max(initialAdvanceVal, MIN_ADVANCE_PERCENTAGE)
          : MIN_ADVANCE_PERCENTAGE
      );
    } else if (!initialValue && !initialized.current) {
        // If initialValue is null/undefined from the start and we haven't initialized
        initialized.current = true; // Mark as "initialized" (to prevent re-running this if initialValue remains null)
        setPersonPrice('300');
        setChildPrice(parseNumberValue(personPrice) / 2);
        setInfantPrice('0');


        setCustomDayPricing(false);
        setDayPricing([]);
        setCustomPersonPricing(false);
        setPersonPricing([]);
        setAdvancePaymentPercentage(MIN_ADVANCE_PERCENTAGE); // Ensure default is MIN_ADVANCE_PERCENTAGE
    }
    
  }, [initialValue, MIN_ADVANCE_PERCENTAGE]); // Added MIN_ADVANCE_PERCENTAGE to dependencies, though it's a constant.

  
  // Update output JSON whenever values change
  useEffect(() => {
    updateOutput();
  }, [personPrice, customDayPricing, dayPricing, customPersonPricing, personPricing, advancePaymentPercentage, notAllowedChildren, notAllowedInfants, childPrice, infantPrice]);
  
  // Function to add a new day pricing rule
  const addDayPricing = () => {
    setDayPricing([...dayPricing, { day: "0", percentage: "120" }]); // Start with Sunday (0)
  };
  
  // Function to add a new person pricing rule
  const addPersonPricing = () => {
    setPersonPricing([...personPricing, { count: "2", percentage: "90" }]);
  };
  
  // Function to remove a day pricing rule
  const removeDayPricing = (index) => {
    const newDayPricing = [...dayPricing];
    newDayPricing.splice(index, 1);
    setDayPricing(newDayPricing);
  };
  
  // Function to remove a person pricing rule
  const removePersonPricing = (index) => {
    const newPersonPricing = [...personPricing];
    newPersonPricing.splice(index, 1);
    setPersonPricing(newPersonPricing);
  };
  
  // Function to update day pricing
  const updateDayPricing = (index, field, value) => {
    const newDayPricing = [...dayPricing];
    newDayPricing[index][field] = value;
    setDayPricing(newDayPricing);
  };
  
  // Function to update person pricing
  const updatePersonPricing = (index, field, value) => {
    const newPersonPricing = [...personPricing];
    newPersonPricing[index][field] = value;
    setPersonPricing(newPersonPricing);
  };

  // Function to update output JSON
  const updateOutput = () => {
    const output = {
      PersonPrice: parseNumberValue(personPrice) || 0,
      AdvancePaymentPercentage: advancePaymentPercentage, // This will now be >= MIN_ADVANCE_PERCENTAGE
      PricePerWeeklyDays: [],
      PricePerPersons: []
    };
    
    // Add day pricing if enabled
    if (customDayPricing && dayPricing.length > 0) {
      const pricePerWeeklyDays = dayPricing.map(item => ({
        weekly_day: parseInt(item.day),
        price: parseNumberValue(item.percentage) || 0
      }));
      output.PricePerWeeklyDays = pricePerWeeklyDays;
    }
    
    // Add person pricing if enabled
    if (customPersonPricing && personPricing.length > 0) {
      const personPricingArray = personPricing.map(item => ({
        personsCount: parseInt(item.count),
        price: parseNumberValue(item.percentage) || 0
      }));
      output.PricePerPersons = personPricingArray;
    }


    
    output.ChildPrice = notAllowedChildren ? -1 : parseNumberValue(childPrice);
    output.InfantPrice = notAllowedInfants ? -1 : parseNumberValue(infantPrice);
    
    // Call onChange callback
    if (onChange) {
      onChange(output);
    }
  };

  // Calculate price for summary based on percentage and base price
  const calculatePrice = (percentage) => {
    const basePrice = parseNumberValue(personPrice) || 0;
    if (percentage === '' || basePrice === 0) return '';
    const parsedPercentage = parseNumberValue(percentage);
    if (parsedPercentage === null) return '';
    return Math.round(basePrice * parsedPercentage / 100);
  };

  const handleAdvancePaymentChange = (e) => {
    let newValue = parseInt(e.target.value);
    // The range input's min attribute should enforce this, but as a fallback:
    if (newValue < MIN_ADVANCE_PERCENTAGE) {
      newValue = MIN_ADVANCE_PERCENTAGE;
    }
    setAdvancePaymentPercentage(newValue);
  };

  return (
    <div className="max-w-xl">      
      {/* Default person price */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <PiMoney size={16} className="ml-1 text-blue-600" />
          <label className="text-gray-700 text-xs mb-1 font-medium">
            السعر للفرد (12 عام او اكبر)
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="border border-gray-200 rounded py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full text-right"
            value={personPrice}
            onChange={(e) => setPersonPrice(e.target.value)}
          />
          <div className='text-sm'>
            ج.م
          </div>
        </div>
      </div>


      {/* Child Price */}
      {!notAllowedChildren && 
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <PiMoney size={16} className="ml-1 text-green-600" />
            <label className="text-gray-700 text-xs mb-1 font-medium">
              السعر للطفل (من 3 ل 11 عام)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="border border-gray-200 rounded py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full text-right"
              value={childPrice}
              onChange={(e) => setChildPrice(e.target.value)}
            />
            <div className='text-sm'>ج.م</div>
          </div>
        </div>
      }
      

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="notAllowedChildren"
          checked={notAllowedChildren}
          onChange={(e) => {
            const checked = e.target.checked;
            setNotAllowedChildren(checked);
            if (checked) {
              setChildPrice('-1');
            } else {
              setChildPrice('150');
            }
          }}
        />
        <label htmlFor="notAllowedChildren" className="text-xs">
          غير مسموح بالأطفال
        </label>
      </div>


      {!notAllowedInfants &&
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <PiMoney size={16} className="ml-1 text-yellow-600" />
            <label className="text-gray-700 text-xs mb-1 font-medium">
              السعر للرضيع (2 عام او اقل)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="border border-gray-200 rounded py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full text-right"
              value={infantPrice}
              onChange={(e) => setInfantPrice(e.target.value)}
            />
            <div className='text-sm'>ج.م</div>
          </div>
        </div>
      }
      

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="notAllowedInfants"
          checked={notAllowedInfants}
          onChange={(e) => {
            const checked = e.target.checked;
            setNotAllowedInfants(checked);
            if (checked) {
              setInfantPrice('-1');
            } else {
              setInfantPrice('0');
            }
          }}
        />
        <label htmlFor="notAllowedInfants" className="text-xs">
          غير مسموح بالرضع
        </label>
      </div>


      
      {/* Advance Payment Percentage Slider */}
      <div className="my-6">
        <div className="flex items-center mb-1">
          <CreditCard size={16} className="ml-1 text-blue-600" />
          <label className="text-gray-700 text-xs font-medium">
            نسبة الدفع المسبق
          </label>
          <span className="mr-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
            {advancePaymentPercentage}%
          </span>
          <div className="mr-2 text-xs text-gray-500">
            {personPrice && advancePaymentPercentage ? Math.round((parseNumberValue(personPrice) || 0) * advancePaymentPercentage / 100) : ''}
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="range"
            min={MIN_ADVANCE_PERCENTAGE.toString()} // Set min to 20
            max="100"
            step="5"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            value={advancePaymentPercentage}
            onChange={handleAdvancePaymentChange} // Use handler to be absolutely sure
          />

        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{MIN_ADVANCE_PERCENTAGE}%</span> {/* Update label to 20% */}
          <span>60%</span> {/* Consider if this middle label needs adjustment, e.g., to 60% */}
          <span>100%</span>
        </div>
      </div>
      
      {/* Custom pricing options as compact toggles */}
      <div className="flex flex-wrap justify-between gap-2 mb-3">
        {/* Custom day pricing toggle */}
        {!fixedDate && (
          <div className="flex items-center bg-white rounded-md border border-gray-200 p-2 flex-1">
            <input
              type="checkbox"
              id="dayPricingToggle"
              className="form-checkbox h-3 w-3 text-blue-600"
              checked={customDayPricing}
              onChange={(e) => setCustomDayPricing(e.target.checked)}
            />
            <label htmlFor="dayPricingToggle" className="mr-1 text-gray-700 text-xs flex items-center cursor-pointer">
              <Calendar size={14} className="ml-1 text-blue-600" />
              <span>أسعار الأيام</span>
            </label>
          </div>
        )}
        
        {/* Custom person pricing toggle */}
        <div className="flex items-center bg-white rounded-md border border-gray-200 p-2 flex-1">
          <input
            type="checkbox"
            id="personPricingToggle"
            className="form-checkbox h-3 w-3 text-blue-600"
            checked={customPersonPricing}
            onChange={(e) => setCustomPersonPricing(e.target.checked)}
          />
          <label htmlFor="personPricingToggle" className="mr-1 text-gray-700 text-xs flex items-center cursor-pointer">
            <Users size={14} className="ml-1 text-blue-600" />
            <span>أسعار الأشخاص</span>
          </label>
        </div>
      </div>
      
      {/* Day pricing section - with compact design */}
      {customDayPricing && (
        <div className="mb-4 p-3 bg-white rounded border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium flex items-center">
              <Calendar size={14} className="ml-1 text-blue-600" />
              <span>أسعار الأيام</span>
            </h4>
            <button
              type='button'
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1"
              onClick={addDayPricing}
              title="إضافة يوم"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {dayPricing.map((item, index) => (
            <div key={`day-${index}`} className="flex items-center mb-2 bg-gray-50 p-2 rounded">
              <select
                className="border rounded py-1 px-1 text-gray-700 text-xs ml-1 w-20"
                value={item.day}
                onChange={(e) => updateDayPricing(index, "day", e.target.value)}
                aria-label="اختر اليوم"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <option key={day} value={day}>
                    {daysOfWeek[day]}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center flex-1">
                <input
                  type="number"
                  className="border rounded w-14 py-1 px-1 text-gray-700 text-xs text-center"
                  value={item.percentage}
                  onChange={(e) => updateDayPricing(index, "percentage", e.target.value)}
                  aria-label="النسبة المئوية"
                />
                <span className="mx-1 text-xs">%</span>
                <span className="text-xs text-gray-500">
                  {item.percentage ? `(${calculatePrice(item.percentage)})` : ''}
                </span>
              </div>
              
              <button
                type='button'
                className="text-red-500 hover:text-red-700 ml-1"
                onClick={() => removeDayPricing(index)}
                title="حذف"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {dayPricing.length === 0 && (
            <div className="text-center text-xs text-gray-500 py-2">
              لا يوجد أسعار مخصصة للأيام
            </div>
          )}
        </div>
      )}
      
      {/* Person pricing section - with compact design */}
      {customPersonPricing && (
        <div className="mb-4 p-3 bg-white rounded border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-medium flex items-center">
              <Users size={14} className="ml-1 text-blue-600" />
              <span>أسعار الأشخاص</span>
            </h4>
            <button
              type='button'
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1"
              onClick={addPersonPricing}
              title="إضافة عدد أشخاص"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {personPricing.map((item, index) => (
            <div key={`person-${index}`} className="flex items-center mb-2 bg-gray-50 p-2 rounded">
              <div className="flex items-center mr-1">
                <input
                  type="number"
                  className="border rounded w-12 py-1 px-1 text-gray-700 text-xs text-center"
                  value={item.count}
                  onChange={(e) => updatePersonPricing(index, "count", e.target.value)}
                  aria-label="عدد الأشخاص"
                />
                <Users size={12} className="mr-1 text-gray-500" />
              </div>
              
              <div className="flex items-center flex-1">
                <input
                  type="number"
                  className="border rounded w-14 py-1 px-1 text-gray-700 text-xs text-center"
                  value={item.percentage}
                  onChange={(e) => updatePersonPricing(index, "percentage", e.target.value)}
                  aria-label="النسبة المئوية"
                />
                <span className="mx-1 text-xs">%</span>
                <span className="text-xs text-gray-500">
                  {item.percentage ? `(${calculatePrice(item.percentage)})` : ''}
                </span>
              </div>
              
              <button
                type='button'
                className="text-red-500 hover:text-red-700 ml-1"
                onClick={() => removePersonPricing(index)}
                title="حذف"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {personPricing.length === 0 && (
            <div className="text-center text-xs text-gray-500 py-2">
              لا يوجد أسعار مخصصة للأشخاص
            </div>
          )}
        </div>
      )}
      
      {/* Price Summary Section - collapsible */}
      <div className="mb-3">
        <button 
          type='button'
          className="flex items-center justify-between w-full p-2 bg-white rounded border border-gray-200 text-sm" 
          onClick={() => setShowSummary(!showSummary)}
        >
          <div className="flex items-center">
            <Info size={16} className="ml-1 text-blue-600" />
            <span className="text-xs font-medium">ملخص الأسعار</span>
          </div>
          {showSummary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showSummary && (
          <div className="mt-2 p-3 bg-white rounded border border-gray-200">
            <div className="mb-2 text-right flex items-center">
              <PiMoney size={14} className="ml-1 text-gray-500" />
              <span className="text-xs font-medium">السعر الأساسي: </span>
              <span className="text-xs mr-1">{personPrice || ''}</span>
            </div>
            
            <div className="mb-2 text-right flex items-center">
              <CreditCard size={14} className="ml-1 text-gray-500" />
              <span className="text-xs font-medium">نسبة الدفع المسبق: </span>
              <span className="text-xs mr-1">{advancePaymentPercentage}%</span>
              {advancePaymentPercentage > 0 && personPrice && (
                <span className="text-xs text-gray-500 mr-2">
                  ({Math.round((parseNumberValue(personPrice) || 0) * advancePaymentPercentage / 100)} للشخص)
                </span>
              )}
            </div>
            
            {customDayPricing && dayPricing.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center mb-1">
                  <Calendar size={14} className="ml-1 text-gray-500" />
                  <span className="text-xs font-medium">أسعار الأيام:</span>
                </div>
                <ul className="list-inside text-right pr-4">
                  {dayPricing.map((item, index) => (
                    <li key={`day-summary-${index}`} className="text-xs text-gray-600 mb-1">
                      {daysOfWeek[parseInt(item.day)]}: {calculatePrice(item.percentage) || ''} ({item.percentage || ''}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {customPersonPricing && personPricing.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center mb-1">
                  <Users size={14} className="ml-1 text-gray-500" />
                  <span className="text-xs font-medium">أسعار الأشخاص:</span>
                </div>
                <ul className="list-inside text-right pr-4">
                  {personPricing.map((item, index) => (
                    <li key={`person-summary-${index}`} className="text-xs text-gray-600 mb-1">
                      {item.count || ''} أشخاص: {calculatePrice(item.percentage) || ''} للشخص ({item.percentage || ''}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>      
    </div>
  );
}

export default TripPricingEditor;


// Function to safely parse number values
const parseNumberValue = (value) => {
  // If value is empty string, return null
  if (value === '') return null;
  // Otherwise parse as integer
  const parsed = parseInt(value);
  return isNaN(parsed) ? null : parsed;
};
  