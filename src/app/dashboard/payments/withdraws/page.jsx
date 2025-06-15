"use client"
import WithdrawRecordsList from '@/components/Withdraw/WithdrawRecordsList'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {

    const { groupId, role } = useSharedContext()
  
  return (
    <div className='p-4'>
        <WithdrawRecordsList groupId={groupId}/>
    </div>
  )
}

export default page