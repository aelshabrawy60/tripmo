"use client"
import AddPaymentGate from '@/components/Payments/AddPaymentGate'
import PaymentGates from '@/components/Payments/PaymentGates'
import EditNotificationNumber from '@/components/profile/EditNotificationNumber'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {
  const { groupId, role } = useSharedContext()
    
  return (
    <div className='p-4'>
        <EditNotificationNumber profileId={groupId}/>
    </div>
  )
}

export default page