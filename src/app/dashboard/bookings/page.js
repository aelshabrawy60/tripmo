"use client"
import BookingRecordsList from '@/components/Bookings/BookingRecordsList'
import React, { useEffect } from 'react'
import { useSharedContext } from '@/context/ShareAut'
import TripCreationForm from '@/components/Trips/TripCreationForm'

function page() {
  const { groupId, role } = useSharedContext()

  return (
    <div>
      <BookingRecordsList groupId={groupId}/>
    </div>
  )
}

export default page