"use client"
import React, { useEffect, useState } from 'react'
import GalleryViewer from './GalleryViewer'
import MainTripDetails from './MainTripDetails'
import MainBookingCard from './MainBookingCard'
import MainRatingsSection from './MainRatingsSection'
import ProfileCard from '@/components/website/ProfileCard'
import StarsRates from '@/components/website/StarsRates'
import InlineCancelationPolicy from '@/components/Trips/InlineCancelationPolicy'

function MainTrip({tripData}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-2">
      {/* Gallery Section */}
      
      
      <div className="w-full relative overflow-hidden">
        <GalleryViewer images={tripData.images}/>
      </div>
      
      {/* Content Section - Responsive Grid */}
      <div className="py-4 md:py-8 lg:py-6">
        <div className='flex gap-5 flex-wrap gap-y-0'>
          {tripData.rates_sum && tripData.rates_count?
          (
            <div className='flex mb-4 gap-1 items-center text-gray-600'>
              <div>{(tripData.rates_sum / tripData.rates_count).toFixed(1)}</div>
              <StarsRates rate={tripData.rates_sum / tripData.rates_count} size={5}/>
              <div>{`(${tripData.rates_count})`}</div>
            </div>
          ): 
          null
          }
          <div className='mb-2'>
              <InlineCancelationPolicy policy={tripData.cancellation_policy}/>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Trip Details - Takes full width on mobile, half on larger screens */}
          <div className="order-2 lg:order-1">
            
            <MainTripDetails 
              name={tripData.name}
              about={tripData.about}
              groupId={tripData.group_id}
            />
          </div>
          
          {/* Booking Card - Takes full width on mobile, half on larger screens */}
          <div className="order-2 lg:order-2">
            <div className="sticky flex flex-col items-end top-4">
              <MainBookingCard 
                tripData={tripData}
                isLoading={isLoading}
                onBookingRequest={() => setIsLoading(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <MainRatingsSection ratings={tripData.ratings} tripId={tripData.id}/>
    </div>
  )
}

export default MainTrip