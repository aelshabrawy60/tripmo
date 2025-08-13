import React, { useEffect, useState } from 'react'
import { Clock, ChevronDown } from 'lucide-react'

function TimeChooser({tripData, onChange, locale = "ar"}) {
  const [currentTime, setCurrentTime] = useState(tripData?.start_times && tripData?.start_times.length > 0 ? tripData?.start_times[0] : null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    if(tripData?.start_times == null || tripData?.start_times.length == 0) {
        onChange(null)
    }else{
        onChange(tripData.start_times[0])
        setCurrentTime(tripData.start_times[0])
    }
  }, [tripData])

  // Enhanced time formatting with locale support but English numbers
  function formatTime(time){
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
  }

  if(tripData?.start_times == null || tripData?.start_times.length < 1) {
    return null
  }

  if(tripData?.start_times.length == 1){
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-tripmo-500"></div>
        <div className="p-2 text-center">
          <div className="text-md font-bold text-gray-900">
            {formatTime(tripData.start_times[0])}
          </div>
        </div>
      </div>
    );
  }

  // Custom dropdown for multiple times
  return (
    <div className={`relative ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full bg-white border border-gray-200 rounded-md py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-md ${
            locale === 'ar' ? 'pl-10 pr-4 text-right' : 'pl-4 pr-10 text-left'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={locale === 'ar' ? 'order-2' : 'order-1'}>
              <span className="block text-md text-gray-900">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
          <span className={`absolute inset-y-0 flex items-center pointer-events-none ${
            locale === 'ar' ? 'left-0 pl-4' : 'right-0 pr-4'
          }`}>
            <ChevronDown 
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
            <div className="max-h-60 overflow-auto">
              {tripData.start_times.map((time, index) => {
                const isSelected = time === currentTime;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCurrentTime(time);
                      onChange(time);
                      setIsOpen(false);
                    }}
                    className={`relative w-full px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-150 ${
                      locale === 'ar' ? 'text-right' : 'text-left'
                    } ${
                      isSelected 
                        ? locale === 'ar' 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-blue-50 border-r-4 border-blue-500'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={locale === 'ar' ? 'order-2' : 'order-1'}>
                        <span className={`block text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                          {formatTime(time)}
                        </span>
                      </div>
                      {isSelected && (
                        <div className={`flex-shrink-0 ${locale === 'ar' ? 'order-1' : 'order-2'}`}>
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default TimeChooser