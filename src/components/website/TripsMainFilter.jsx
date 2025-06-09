import React, { useRef, useState } from 'react'
import { Search, MapPin, ArrowRightLeft } from 'lucide-react';
import CityChooser from '../Trips/CityChooser';


function TripsMainFilter() {
  const [selectedDepartureCity, setSelectedDepartureCity] = useState(null);
  const [selectedDestinationCity, setSelectedDestinationCity] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const depCityChooserRef = useRef(null)
  const destCityChooserRef = useRef(null)

  const handleDepClick = () => {
    depCityChooserRef.current?.focus()
  }

  const handleDestClick = () => {
    destCityChooserRef.current?.focus()
  }

  function handleDepartureCityChange(city) {
    setSelectedDepartureCity(city);
  }

  function handleDestinationCityChange(city) {
    setSelectedDestinationCity(city);
  }

  const isSearchDisabled = false;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Filter Form - Responsive Layout */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200">        
        {/* Desktop Layout (lg and up) */}
        <div className="hidden md:flex items-center">
          {/* Departure City */}
          <div className="flex-1 transition-colors duration-200 px-6 py-5" onClick={handleDepClick}>
            <label className="block text-md font-medium text-gray-700 mb-2">
              مكان الانطلاق
            </label>
            <CityChooser 
              onChange={handleDepartureCityChange}
              placeholder="من أين؟"
              type={1}
              ref={depCityChooserRef}
            />
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-12 bg-gray-200"></div>

          {/* Destination City */}
          <div className="flex-1 transition-colors duration-200 px-6 py-5" onClick={handleDestClick}>
            <label className="block text-md font-medium text-gray-700 mb-2">
              الوجهة
            </label>
            <CityChooser 
              onChange={handleDestinationCityChange}
              placeholder="إلى أين؟"
              type={1}
              ref={destCityChooserRef}
            />
          </div>

          {/* Search Button */}
            <div className="flex-shrink-0 self-stretch m-3 flex items-center">
            <a
                href={`site/trips?${selectedDepartureCity != null ?  `depature_city=${selectedDepartureCity?.id || null}`: ''}${selectedDestinationCity != null ?  `&dest_city=${selectedDestinationCity?.id || null}`: ''}`}
                disabled={isSearchDisabled || isSearching}
                className={`
                inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-3xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[120px] w-full h-full
                ${isSearchDisabled 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : isSearching
                    ? 'bg-blue-500 text-white cursor-wait'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                }
                `}
            >
                {isSearching ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                <Search className="w-5 h-5" />
                )}
            </a>
            </div>

        </div>

        {/* Mobile & Tablet Layout (below lg) */}
        <div className="md:hidden">
          {/* Form Content */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Departure City */}
            <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مكان الانطلاق
              </label>
              <CityChooser 
                onChange={handleDepartureCityChange}
                placeholder="من أين؟"
                type={1}
              />
            </div>

            {/* Destination City */}
            <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوجهة
              </label>
              
              <CityChooser 
                onChange={handleDestinationCityChange}
                placeholder="إلى أين؟"
                type={1}
              />
            </div>
          </div>

          {/* Search Button - Full width on mobile */}
          <div className="p-4 sm:p-6 pt-0">
            <a
              href={`site/trips?${selectedDepartureCity != null ?  `depature_city=${selectedDepartureCity?.id || null}`: ''}${selectedDestinationCity != null ?  `&dest_city=${selectedDestinationCity?.id || null}`: ''}`}
              disabled={isSearchDisabled || isSearching}
              className={`
                w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isSearchDisabled 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : isSearching
                  ? 'bg-blue-500 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:transform active:scale-95'
                }
              `}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>جاري البحث...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>البحث عن الرحلات</span>
                </>
              )}
            </a>
          </div>
        </div>
      </div>

      {/* Additional spacing for mobile */}
      <div className="h-4 md:h-0"></div>
    </div>
  )
}

export default TripsMainFilter