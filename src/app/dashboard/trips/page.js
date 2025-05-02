"use client"

import TripsList from '@/components/Trips/TripsList'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {
  const { groupId, role } = useSharedContext()
  
  return (
    <div className='py-6'>
      <TripsList groupId={groupId}/>
    </div>
  )
}

export default page