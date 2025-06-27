"use client"
import ActivateCoupon from '@/components/coupon/ActivateCoupon'
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
        <div className='mt-4'>
          <ActivateCoupon/>
        </div>
    </div>
  )
}

export default page