"use client"
import BalanceDisplay from '@/components/Balance/Balance'
import PaymentsList from '@/components/Payments/PaymentsList'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {

  const { groupId, role } = useSharedContext()
    
  return (
    <div>
        <BalanceDisplay groupId={groupId}/>
        <PaymentsList groupId={groupId}/>
    </div>
  )
}

export default page