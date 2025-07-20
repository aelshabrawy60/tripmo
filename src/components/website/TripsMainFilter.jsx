'use client'
import React, { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import CityChooser from '../Trips/CityChooser';
import locales from '../../../messages/locales';


function TripsMainFilter({ locale }) {
  const [selectedDepartureCity, setSelectedDepartureCity] = useState(null);
  const [selectedDestinationCity, setSelectedDestinationCity] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const depCityChooserRef = useRef(null);
  const destCityChooserRef = useRef(null);

  const handleDepClick = () => depCityChooserRef.current?.focus();
  const handleDestClick = () => destCityChooserRef.current?.focus();

  const handleDepartureCityChange = (city) => setSelectedDepartureCity(city);
  const handleDestinationCityChange = (city) => setSelectedDestinationCity(city);

  const isSearchDisabled = false;

  const t = (section, key) => locales[section][key][locale] || locales[section][key].en;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200">

        {/* Desktop */}
        <div className="hidden md:flex items-center">
          <div className="flex-1 px-6 py-5" onClick={handleDepClick}>
            <label className="block text-md font-medium text-gray-700 mb-2">
              {t("Home", "departureLabel") || "مكان الانطلاق"}
            </label>
            <CityChooser 
              onChange={handleDepartureCityChange}
              placeholder={locale === 'ar' ? "من أين؟" : "From?"}
              type={1}
              locale={locale}
              ref={depCityChooserRef}
            />
          </div>

          <div className="w-px h-12 bg-gray-200"></div>

          <div className="flex-1 px-6 py-5" onClick={handleDestClick}>
            <label className="block text-md font-medium text-gray-700 mb-2">
              {t("Home", "destinationLabel") || "الوجهة"}
            </label>
            <CityChooser 
              onChange={handleDestinationCityChange}
              placeholder={locale === 'ar' ? "إلى أين؟" : "To?"}
              type={1}
              ref={destCityChooserRef}
              locale={locale}
            />
          </div>

          <div className="flex-shrink-0 self-stretch m-3 flex items-center">
            <a
              href={`/trips?${selectedDepartureCity ? `depature_city=${selectedDepartureCity?.id}` : ''}${selectedDestinationCity ? `&dest_city=${selectedDestinationCity?.id}` : ''}`}
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

        {/* Mobile */}
        <div className="md:hidden">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Home", "departureLabel") || "مكان الانطلاق"}
              </label>
              <CityChooser 
                onChange={handleDepartureCityChange}
                placeholder={locale === 'ar' ? "من أين؟" : "From?"}
                type={1}
                locale={locale}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Home", "destinationLabel") || "الوجهة"}
              </label>
              <CityChooser 
                onChange={handleDestinationCityChange}
                placeholder={locale === 'ar' ? "إلى أين؟" : "To?"}
                type={1}
                locale={locale}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 pt-0">
            <a
              href={`/trips?${selectedDepartureCity ? `depature_city=${selectedDepartureCity?.id}` : ''}${selectedDestinationCity ? `&dest_city=${selectedDestinationCity?.id}` : ''}`}
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
                  <span>{locale === 'ar' ? "جاري البحث..." : "Searching..."}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>{locale === 'ar' ? "البحث عن الرحلات" : "Search Trips"}</span>
                </>
              )}
            </a>
          </div>
        </div>
      </div>
      <div className="h-4 md:h-0"></div>
    </div>
  );
}

export default TripsMainFilter;
