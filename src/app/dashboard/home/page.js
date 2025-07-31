"use client"

import React, { useState, useEffect } from 'react'
import DateChooser from '@/components/Bookings/DateChooser'
import TripChooser from '@/components/Bookings/TripChooser'
import TripBookingsList from '@/components/Bookings/TripBookingsList'
import { useSharedContext } from '@/context/ShareAut'
import { Loader, Calendar, AlertCircle, Plus, MapPin, Users, Clock, Star, ArrowRight, Zap } from 'lucide-react'
import AddBooking from '@/components/Bookings/AddBooking'
import LoadingCirc from '@/components/Loading/LoadingCirc'
import Link from 'next/link';
import Image from 'next/image'


// Focused Empty State for First Trip
const FirstTripEmptyState = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className=" p-8">
        {/* Images Grid */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-3 gap-2 w-48">
            <div className="relative h-16 rounded-lg overflow-hidden">
              <Image 
                src='https://xtcmkhuruoghbsliqbcb.supabase.co/storage/v1/object/public/trips/46/a33b1aa2_1753800006774.jpeg'
                alt="Trip destination"
                fill
                className="object-cover"
                sizes='15vw'
              />
            </div>
            <div className="relative h-16 rounded-lg overflow-hidden">
              <Image 
                src='https://xtcmkhuruoghbsliqbcb.supabase.co/storage/v1/object/public/trips/39/f5992df6_1753580980981.jpeg'
                alt="Trip destination"
                fill
                className="object-cover"
                sizes='15vw'
              />
            </div>
            <div className="relative h-16 rounded-lg overflow-hidden">
              <Image 
                src='https://xtcmkhuruoghbsliqbcb.supabase.co/storage/v1/object/public/trips/37/f171659b_1753464377242.jpg'
                alt="Trip destination"
                fill
                className="object-cover"
                sizes='15vw'
              />
            </div>
            <div className="relative h-16 rounded-lg overflow-hidden">
              <Image 
                src='https://xtcmkhuruoghbsliqbcb.supabase.co/storage/v1/object/public/trips/29/6eed8b72_1752869471337.jpg'
                alt="Trip destination"
                fill
                className="object-cover"
                sizes='15vw'
              />
            </div>
            <div className="relative h-16 rounded-lg overflow-hidden">
              <Image 
                src='https://xtcmkhuruoghbsliqbcb.supabase.co/storage/v1/object/public/trips/11/1e3c09c0_1752656038467.jpeg'
                alt="Trip destination"
                fill
                className="object-cover"
                sizes='15vw'
              />
            </div>
            <div className="relative h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          أضف رحلتك الأولى لتبدأ استقبال الحجوزات
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          أنشئ رحلة وابدأ في استقبال الحجوزات من عملاؤك على الفور
        </p>

        {/* Primary CTA */}
        <Link 
          href="/dashboard/trips/create" 
          className="inline-flex items-center gap-3 bg-tripmo-500 hover:bg-tripmo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-6 text-lg"
        >
          <Plus className="w-6 h-6" />
          إنشاء رحلة جديدة
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Quick Benefits */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-tripmo-500" />
            <span>إعداد سريع</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-tripmo-500" />
            <span>5 دقائق فقط</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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
            <FirstTripEmptyState />
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