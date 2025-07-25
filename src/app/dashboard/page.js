"use client"

import MapPointSelector from '@/components/Trips/MapPointSelector'
import MeetingPointSetup from '@/components/Trips/MeetingPointSetup'
import PickupSetup from '@/components/Trips/PickupSetup'
import TripPricingEditor from '@/components/Trips/TripPricingEditor'
import React from 'react'

function page() {
  return (
    <div>
      <PickupSetup onEdit={()=> null}/>
      <MeetingPointSetup onEdit={()=> null}/>
    </div>
  )
}

export default page