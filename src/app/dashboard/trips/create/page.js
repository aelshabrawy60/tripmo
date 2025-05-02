"use client"
import TripCreationForm from '@/components/Trips/TripCreationForm'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {
  const { groupId, role } = useSharedContext()
    
  return (
    <div className='p-4'>
        <TripCreationForm groupId={groupId}/>
    </div>
  )
}

export default page