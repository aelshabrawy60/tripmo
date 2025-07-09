import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ArabicDateSelector = ({ onChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isOpen, setIsOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const periods = [
    { value: 'today', label: 'اليوم', icon: '📅' },
    { value: 'this_month', label: 'هذا الشهر', icon: '📊' },
    { value: 'this_year', label: 'هذا العام', icon: '🗓️' },
    { value: 'custom', label: 'فترة مخصصة', icon: '⚙️' }
  ];

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    setIsOpen(false);
    if (value !== 'custom') {
      onChange?.(value); // Notify parent of change
    } else if (customStartDate && customEndDate) {
      onChange?.({ start: customStartDate, end: customEndDate });
    }
  };

  const handleCustomDateChange = (type, value) => {
    let updatedStart = customStartDate;
    let updatedEnd = customEndDate;

    if (type === 'start') {
      setCustomStartDate(value);
      updatedStart = value;
    } else {
      setCustomEndDate(value);
      updatedEnd = value;
    }

    if (updatedStart && updatedEnd) {
      onChange?.({ start: updatedStart, end: updatedEnd }); // Notify parent of custom range
    }
  };

  const getCurrentPeriodLabel = () => {
    const period = periods.find(p => p.value === selectedPeriod);
    return period ? period.label : 'اختر الفترة';
  };

  const getCurrentPeriodIcon = () => {
    const period = periods.find(p => p.value === selectedPeriod);
    return period ? period.icon : '📅';
  };

  return (
    <div className="w-64 p-3 rounded-lg" dir="rtl">
      {/* Main Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2.5 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{getCurrentPeriodIcon()}</span>
            <span className="font-medium text-gray-800 text-sm">{getCurrentPeriodLabel()}</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={`w-full flex items-center gap-2 p-2.5 hover:bg-blue-50 transition-colors duration-150 text-sm ${
                  selectedPeriod === period.value 
                    ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500' 
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span className="text-sm">{period.icon}</span>
                <span className="font-medium">{period.label}</span>
                {selectedPeriod === period.value && (
                  <div className="mr-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Date Range Inputs */}
      {selectedPeriod === 'custom' && (
        <div className="mt-2 p-2.5 bg-gray-50 rounded-md border border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">من</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">إلى</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-full p-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArabicDateSelector;
