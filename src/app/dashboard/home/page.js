"use client"

import React, { useState, useEffect, useRef } from 'react'
import DateChooser from '@/components/Bookings/DateChooser'
import TripChooser from '@/components/Bookings/TripChooser'
import TripBookingsList from '@/components/Bookings/TripBookingsList'
import { useSharedContext } from '@/context/ShareAut'
import { Loader } from 'lucide-react'
import AddBooking from '@/components/Bookings/AddBooking'

function BookingPage() {
  const { groupId, role } = useSharedContext()

  const [tripsData, setTripsData] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshBookings, setRefreshBookings] = useState(0)

  useEffect(() => {
    async function fetchTrips() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/dashboard/trips?groupId=${groupId}`)
        
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`)
        }
        
        const data = await response.json()
        setTripsData(data)
        setSelectedTrip(data[0] || null) // Set the first trip as selected by default
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching trips:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [])
  
  const handleTripSelect = (trip) => {
    setSelectedTrip(trip)
  }

  // Function to refresh the bookings list
  const handleBookingSuccess = () => {
    // Increment the refreshBookings counter to trigger a re-render of TripBookingsList
    setRefreshBookings(prev => prev + 1)
  }

  return (
    <div className="mx-auto p-4 md:p-6">      
      {isLoading && (
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="mr-3 text-lg text-gray-700">جاري التحميل...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading trips: {error}</p>
          <p>Please check your connection and try again.</p>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="space-y-4">
          <div className="bg-white items-center p-6 gap-4 flex flex-wrap rounded-md shadow-sm border border-gray-200">
            <TripChooser 
              tripsData={tripsData} 
              onSelect={handleTripSelect} 
            />

            {selectedTrip && (
              <DateChooser tripData={selectedTrip} onDateChange={setSelectedDate}/>
            )}

            <AddBooking 
              groupId={groupId} 
              initialData={{"tripData": selectedTrip, "date": selectedDate}} 
              onSuccess={handleBookingSuccess}
            />

          </div>

          {selectedTrip && (
          <div>
            <TripBookingsList 
              tripData={selectedTrip} 
              date={selectedDate} 
              groupId={groupId}
              refreshTrigger={refreshBookings}
            />
          </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BookingPage