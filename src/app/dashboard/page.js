"use client"

import GuideLangsSelector from '@/components/Trips/GuideLangsSelector'
import TripStartTimesSelector from '@/components/Trips/TripStartTimesSelector'
import React from 'react'

function page() {
  return (
    <div className='max-w-md'>
      <TripStartTimesSelector onAdd={()=> null}/>
    </div>
  )
}

export default page