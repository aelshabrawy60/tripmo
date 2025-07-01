import React from 'react'
import MainTripCard from '../Templates/Main/MainTripCard'
import NoTripsFound from './NoTripsFound'

function TripsViewer({ trips, isLoading = false, language = 'ar' }) {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Loading skeleton */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Handle empty, null, undefined, or invalid trips data
  if (!trips || !Array.isArray(trips) || trips.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto py-6">
        <NoTripsFound language={language} />
      </div>
    )
  }

  // Determine text direction based on language
  const isRTL = language === 'ar' || language === 'arabic'
  const directionClass = isRTL ? 'rtl' : 'ltr'

  return (
    <div className={`w-full max-w-7xl mx-auto py-6 ${directionClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Responsive grid container with RTL support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {trips.map((trip, index) => {
          // Skip invalid trip data
          if (!trip || typeof trip !== 'object') {
            return null
          }
          
          return (
            <div
              key={trip?.id || trip?.tripId || `trip-${index}`}
              className="w-full"
            >
              <MainTripCard 
                tripData={trip} 
                language={language}
                isRTL={isRTL}
              />
            </div>
          )
        }).filter(Boolean)} {/* Filter out null entries */}
      </div>
      
      {/* Show message if all trips were filtered out due to invalid data */}
      {trips.every(trip => !trip || typeof trip !== 'object') && (
        <div className="text-center py-8">
          <p className={`text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'لا توجد رحلات صالحة للعرض' : 'No valid trips to display'}
          </p>
        </div>
      )}
    </div>
  )
}

export default TripsViewer