import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

function TripChooser({ tripsData = [], onSelect = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(tripsData[0] || null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (trip) => {
    setSelectedTrip(trip);
    setIsOpen(false);
    onSelect(trip);
  };

  return (
    <div 
      className="relative flex-1 min-w-[200px]" 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        className="flex items-center justify-between w-full p-2.5 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate">
          {selectedTrip ? selectedTrip.name : 'اختر رحلة'}
        </span>
        <span className="pointer-events-none">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60 focus:outline-none"
          role="listbox"
          tabIndex={-1}
        >
          {tripsData.length > 0 ? (
            tripsData.map((trip) => (
              <li
                key={trip.id}
                className={`relative py-2 pl-3 pr-9 cursor-pointer select-none hover:bg-blue-100 ${
                  selectedTrip && selectedTrip.id === trip.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-900'
                }`}
                onClick={() => handleSelect(trip)}
                role="option"
                aria-selected={selectedTrip && selectedTrip.id === trip.id}
              >
                <div className="flex items-center pr-2">
                  <span className="block truncate font-medium">
                    {trip.name}
                  </span>
                </div>

                {selectedTrip && selectedTrip.id === trip.id && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="relative py-2 pl-3 pr-9 text-gray-500">
              لا يوجد رحلات متاحة
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default TripChooser;