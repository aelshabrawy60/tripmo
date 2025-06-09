"use client"
import React, { useState } from 'react'
import GalleryViewer from './GalleryViewer'
import MainTripDetails from './MainTripDetails'
import MainBookingCard from './MainBookingCard'
import MainRatingsSection from './MainRatingsSection'
import ProfileCard from '@/components/website/ProfileCard'

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