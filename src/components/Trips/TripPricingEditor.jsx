import React, { useState, useEffect } from 'react';

function TripPricingEditor({ onChange, initialValue = null }) {
  const [personPrice, setPersonPrice] = useState(initialValue?.PersonPrice || 300);
  const [customDayPricing, setCustomDayPricing] = useState(false);
  const [customPersonPricing, setCustomPersonPricing] = useState(false);
  
  // Days of week in Arabic
  const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  
  // Initialize day pricing
  const [dayPricing, setDayPricing] = useState([]);
  
  // Initialize person pricing
  const [personPricing, setPersonPricing] = useState([]);
  
  useEffect(() => {
    // Initialize from initialValue if provided
    if (initialValue) {
      setPersonPrice(initialValue.PersonPrice || 300);
      
      // Check if we have day pricing
      if (initialValue.PricePerWeeklyDays && initialValue.PricePerWeeklyDays.length > 0) {
        setCustomDayPricing(true);
        
        // Extract day pricing from array format
        const dayPricingData = [];
        for (let i = 0; i < initialValue.PricePerWeeklyDays.length; i += 2) {
          if (initialValue.PricePerWeeklyDays[i] !== "PricePerPersons") {
            dayPricingData.push({
              day: initialValue.PricePerWeeklyDays[i],
              percentage: parseInt(initialValue.PricePerWeeklyDays[i+1])
            });
          }
        }
        setDayPricing(dayPricingData);
      }
      
      // Check if we have person pricing
      const personPricingIndex = initialValue.PricePerWeeklyDays?.indexOf("PricePerPersons");
      if (personPricingIndex !== undefined && personPricingIndex !== -1 && 
          initialValue.PricePerWeeklyDays[personPricingIndex + 1] &&
          initialValue.PricePerWeeklyDays[personPricingIndex + 1].length > 0) {
        setCustomPersonPricing(true);
        
        // Extract person pricing from array format
        const personArr = initialValue.PricePerWeeklyDays[personPricingIndex + 1];
        const personPricingData = [];
        for (let i = 0; i < personArr.length; i += 2) {
          personPricingData.push({
            count: personArr[i],
            percentage: parseInt(personArr[i+1])
          });
        }
        setPersonPricing(personPricingData);
      }
    }
  }, [initialValue]);
  
  // Update output JSON whenever values change
  useEffect(() => {
    updateOutput();
  }, [personPrice, customDayPricing, dayPricing, customPersonPricing, personPricing]);
  
  // Function to add a new day pricing rule
  const addDayPricing = () => {
    setDayPricing([...dayPricing, { day: "1", percentage: 120 }]);
  };
  
  // Function to add a new person pricing rule
  const addPersonPricing = () => {
    setPersonPricing([...personPricing, { count: "2", percentage: 90 }]);
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
      PersonPrice: personPrice
    };
    
    // Build PricePerWeeklyDays array
    const pricePerWeeklyDays = [];
    
    // Add day pricing if enabled
    if (customDayPricing && dayPricing.length > 0) {
      dayPricing.forEach(item => {
        pricePerWeeklyDays.push(item.day);
        pricePerWeeklyDays.push(`${item.percentage}%`);
      });
    }
    
    // Add person pricing if enabled
    if (customPersonPricing && personPricing.length > 0) {
      pricePerWeeklyDays.push("PricePerPersons");
      
      const personPricingArray = [];
      personPricing.forEach(item => {
        personPricingArray.push(item.count);
        personPricingArray.push(`${item.percentage}%`);
      });
      
      pricePerWeeklyDays.push(personPricingArray);
    }
    
    // Only add PricePerWeeklyDays if we have values
    if (pricePerWeeklyDays.length > 0) {
      output.PricePerWeeklyDays = pricePerWeeklyDays;
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(output);
    }
  };

  return (
    <div dir="rtl" className="bg-gray-50 p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-right">محرر أسعار الرحلة</h2>
      
      {/* Default person price */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2 text-right">
          السعر الأساسي للشخص
        </label>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-right"
          value={personPrice}
          onChange={(e) => setPersonPrice(parseInt(e.target.value) || 0)}
        />
      </div>
      
      {/* Custom day pricing toggle */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={customDayPricing}
            onChange={(e) => setCustomDayPricing(e.target.checked)}
          />
          <label className="mr-2 text-gray-700 text-sm font-bold">
            تخصيص أسعار الأيام
          </label>
        </div>
      </div>
      
      {/* Day pricing section */}
      {customDayPricing && (
        <div className="mb-6 p-4 bg-white rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-right">أسعار الأيام</h3>
          
          {dayPricing.map((item, index) => (
            <div key={`day-${index}`} className="flex flex-wrap items-center mb-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                onClick={() => removeDayPricing(index)}
              >
                ✕
              </button>
              
              <div className="flex items-center ml-2">
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 text-right"
                  value={item.percentage}
                  onChange={(e) => updateDayPricing(index, "percentage", parseInt(e.target.value) || 0)}
                />
                <span className="mx-1">%</span>
                <span className="text-sm text-gray-600 mr-1">({Math.round(personPrice * item.percentage / 100)} ريال)</span>
              </div>
              
              <select
                className="shadow border rounded py-1 px-2 text-gray-700 ml-2"
                value={item.day}
                onChange={(e) => updateDayPricing(index, "day", e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <option key={day} value={day}>
                    {daysOfWeek[day - 1]}
                  </option>
                ))}
              </select>
              
              <span className="ml-2">اليوم:</span>
            </div>
          ))}
          
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={addDayPricing}
          >
            إضافة سعر يوم جديد
          </button>
        </div>
      )}
      
      {/* Custom person pricing toggle */}
      <div className="mb-6">
        <div className="flex items-center">
          
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={customPersonPricing}
            onChange={(e) => setCustomPersonPricing(e.target.checked)}
          />
          <label className="mr-2 text-gray-700 text-sm font-bold">
            تخصيص أسعار حسب عدد الأشخاص
          </label>
        </div>
      </div>
      
      {/* Person pricing section */}
      {customPersonPricing && (
        <div className="mb-6 p-4 bg-white rounded border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-right">أسعار حسب عدد الأشخاص</h3>
          
          {personPricing.map((item, index) => (
            <div key={`person-${index}`} className="flex flex-wrap items-center mb-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                onClick={() => removePersonPricing(index)}
              >
                ✕
              </button>
              
              <div className="flex items-center ml-2">
                <input
                  type="number"
                  className="shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 text-right"
                  value={item.percentage}
                  onChange={(e) => updatePersonPricing(index, "percentage", parseInt(e.target.value) || 0)}
                />
                <span className="mx-1">%</span>
                <span className="text-sm text-gray-600 mr-1">({Math.round(personPrice * item.percentage / 100)} ريال)</span>
              </div>
              
              <input
                type="number"
                className="shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 ml-2 text-right"
                value={item.count}
                onChange={(e) => updatePersonPricing(index, "count", e.target.value)}
                min="2"
              />
              
              <span className="ml-2">عدد الأشخاص:</span>
            </div>
          ))}
          
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            onClick={addPersonPricing}
          >
            إضافة سعر جديد حسب عدد الأشخاص
          </button>
        </div>
      )}
      
      {/* Price Summary Section */}
      <div className="mb-6 p-4 bg-white rounded border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-right">ملخص الأسعار</h3>
        
        <div className="mb-2 text-right">
          <span className="font-bold">السعر الأساسي للشخص: </span>
          <span>{personPrice} ريال</span>
        </div>
        
        {customDayPricing && dayPricing.length > 0 && (
          <div className="mb-2">
            <h4 className="font-semibold text-right mb-2">أسعار الأيام الخاصة:</h4>
            <ul className="list-disc list-inside text-right">
              {dayPricing.map((item, index) => (
                <li key={`day-summary-${index}`}>
                  {daysOfWeek[parseInt(item.day) - 1]}: {Math.round(personPrice * item.percentage / 100)} ريال ({item.percentage}%)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {customPersonPricing && personPricing.length > 0 && (
          <div className="mb-2">
            <h4 className="font-semibold text-right mb-2">أسعار حسب عدد الأشخاص:</h4>
            <ul className="list-disc list-inside text-right">
              {personPricing.map((item, index) => (
                <li key={`person-summary-${index}`}>
                  عدد {item.count} أشخاص: {Math.round(personPrice * item.percentage / 100)} ريال للشخص ({item.percentage}%)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Preview section */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2 text-right">معاينة البيانات</h3>
        <pre dir="ltr" className="bg-white p-3 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify({
            PersonPrice: personPrice,
            ...(customDayPricing || customPersonPricing) && {
              PricePerWeeklyDays: [
                ...(customDayPricing ? dayPricing.flatMap(item => [item.day, `${item.percentage}%`]) : []),
                ...(customPersonPricing ? [
                  "PricePerPersons",
                  personPricing.flatMap(item => [item.count, `${item.percentage}%`])
                ] : [])
              ]
            }
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default TripPricingEditor;