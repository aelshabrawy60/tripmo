import React, { useState, useEffect } from 'react'

function TripDurationSetter({onEdit, initialValue}) {
  const [durationType, setDurationType] = useState('hours') // 'hours' or 'days'
  const [inputValue, setInputValue] = useState('')

  // Initialize values from initialValue (in hours)
  useEffect(() => {
    if (initialValue && initialValue > 0) {
      if (initialValue >= 24 && initialValue % 24 === 0) {
        // If it's a whole number of days, display as days
        setDurationType('days')
        setInputValue((initialValue / 24).toString())
      } else {
        // Otherwise display as hours
        setDurationType('hours')
        setInputValue(initialValue.toString())
      }
    }
  }, [initialValue])

  // Convert input to hours and call onEdit whenever values change
  useEffect(() => {
    if (inputValue && !isNaN(inputValue) && parseFloat(inputValue) > 0) {
      const hours = durationType === 'hours' 
        ? parseFloat(inputValue) 
        : parseFloat(inputValue) * 24
      
      onEdit(hours)
    } else {
      onEdit(0)
    }
  }, [inputValue])

  const handleDurationTypeChange = (type) => {
    setDurationType(type)
    setInputValue('') // Reset input when switching types
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    // Allow only positive numbers with decimals
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setInputValue(value)
    }
  }

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        مدة الرحلة
      </h3>
      
      {/* Duration Type Selection */}
      <div className="space-y-3 mb-4">
        <label className="flex items-center cursor-pointer">
            <input
            type="radio"
            name="durationType"
            value="hours"
            checked={durationType === 'hours'}
            onChange={() => handleDurationTypeChange('hours')}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 mr-3">يوم او اقل</span>
        </label>
        
        <label className="flex items-center cursor-pointer">
            <input
            type="radio"
            name="durationType"
            value="days"
            checked={durationType === 'days'}
            onChange={() => handleDurationTypeChange('days')}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 mr-3">اكثر من يوم</span>
        </label>
      </div>

      {/* Input Field */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={durationType === 'hours' ? 'أدخل عدد الساعات' : 'أدخل عدد الأيام'}
            min="0"
            step="0.5"
            className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            dir="rtl"
          />
          <span className="ml-3 text-gray-600 font-medium">
            {durationType === 'hours' ? 'ساعة' : 'يوم'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TripDurationSetter