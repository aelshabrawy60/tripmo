"use client"
import PaymentsList from '@/components/Payments/PaymentsList'
import AdminProfileCard from '@/components/profile/AdminProfileCard'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {

  const { groupId, role } = useSharedContext()
    
  return (
    <div className='flex justify-center w-full md:pt-20 pt-5 px-4'>
        <AdminProfileCard profileId={groupId}/>
    </div>
  )
}

export default page