"use client"

import React, { useState, useEffect } from 'react'
import DateChooser from '@/components/Bookings/DateChooser'
import TripChooser from '@/components/Bookings/TripChooser'
import TripBookingsList from '@/components/Bookings/TripBookingsList'
import { useSharedContext } from '@/context/ShareAut'
import { Loader, Calendar, AlertCircle } from 'lucide-react'
import AddBooking from '@/components/Bookings/AddBooking'
import AddBookingClient from '@/components/Bookings/AddBookClient'
import Loading from '@/components/Loading'
import LoadingCirc from '@/components/Loading/LoadingCirc'
import ActivateCoupon from '@/components/coupon/ActivateCoupon'

function BookingPage() {
  const { groupId, role } = useSharedContext()

  const [tripsData, setTripsData] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
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
        
        // Only set selected trip if there are trips available
        if (data && data.length > 0) {
          setSelectedTrip(data[0])
        } else {
          setSelectedTrip(null)
        }
        
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching trips:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [groupId])
  
  
  const handleTripSelect = (trip) => {
    setSelectedDate(null)
    setSelectedTrip(trip)
  }

  // Function to refresh the bookings list
  const handleBookingSuccess = () => {
    // Increment the refreshBookings counter to trigger a re-render of TripBookingsList
    setRefreshBookings(prev => prev + 1)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  // Determine if there are any available trips
  const hasTrips = tripsData && tripsData.length > 0;

  // Get the initial date for booking forms
  const getInitialDate = () => {
    if (!selectedTrip) return selectedDate;
    return selectedTrip.availability_type === "fixed" 
      ? selectedTrip.available_day 
      : selectedDate;
  };

  return (
    <div className="mx-auto p-4 md:p-6">      
      {isLoading && (
        <LoadingCirc/>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading trips: {error}</p>
          <p>Please check your connection and try again.</p>
        </div>
      )}
      
      {!isLoading && !error && (
        <div className="space-y-4">
          {!hasTrips ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-6 rounded-md flex flex-col items-center space-y-3">
              <AlertCircle className="w-10 h-10 text-yellow-500" />
              <h3 className="text-xl font-medium">لا توجد رحلات متاحة</h3>
              <p className="text-center">
                لم يتم إضافة أي رحلات بعد. يرجى إضافة رحلات جديدة أولاً.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white items-center p-6 gap-4 flex flex-wrap rounded-md shadow-sm border border-gray-200">
                <TripChooser 
                  tripsData={tripsData} 
                  onSelect={handleTripSelect} 
                />

                {selectedTrip && (
                  <DateChooser tripData={selectedTrip} onDateChange={handleDateChange}/>
                )}

                {selectedTrip && (
                  <>
                    <AddBooking 
                      groupId={groupId} 
                      initialData={{"tripData": selectedTrip, "date": getInitialDate()}} 
                      onSuccess={handleBookingSuccess}
                    />
                  </>
                )}
              </div>

              {selectedTrip && selectedDate && (
                <div>
                  <TripBookingsList 
                    tripData={selectedTrip} 
                    date={selectedDate} 
                    groupId={groupId}
                    refreshTrigger={refreshBookings}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default BookingPage