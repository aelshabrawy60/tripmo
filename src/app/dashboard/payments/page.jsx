"use client"
import PaymentsList from '@/components/Payments/PaymentsList'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {

  const { groupId, role } = useSharedContext()
    
  return (
    <div>
        <PaymentsList groupId={groupId}/>
    </div>
  )
}

export default page