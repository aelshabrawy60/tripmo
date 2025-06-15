"use client"
import BalanceDisplay from '@/components/Balance/Balance'
import PaymentsList from '@/components/Payments/PaymentsList'
import WithdrawMethodsManager from '@/components/Withdraw/WithdrawManager'
import WithdrawRecordsList from '@/components/Withdraw/WithdrawRecordsList'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {

  const { groupId, role } = useSharedContext()
    
  return (
    <div className='p-6 flex flex-col gap-5'>
        <WithdrawMethodsManager groupId={groupId}/>
        <WithdrawRecordsList groupId={groupId}/>
    </div>
  )
}

export default page