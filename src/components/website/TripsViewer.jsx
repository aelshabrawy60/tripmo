import React from 'react'
import MainTripCard from '../Templates/Main/MainTripCard'
import NoTripsFound from './NoTripsFound'

function TripsViewer({ trips }) {
  // Handle empty or loading state
  if (!trips || trips.length === 0) {
    return (
      <NoTripsFound/>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      {/* Responsive grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {trips?.map((trip, index) => (
          <div
            key={trip.id || index}
            className="w-full transition-transform duration-200 hover:scale-105"
          >
            <MainTripCard tripData={trip} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TripsViewer