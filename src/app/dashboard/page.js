"use client"

import GuideLangsSelector from '@/components/Trips/GuideLangsSelector'
import TripStartTimesSelector from '@/components/Trips/TripStartTimesSelector'
import Paypal from '@/components/website/Paypal'
import React from 'react'

function page() {
  return (
    <div className='max-w-md'>
      <Paypal/>
    </div>
  )
}

export default page