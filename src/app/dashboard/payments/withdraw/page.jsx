"use client"
import WithdrawMethodsManager from '@/components/Withdraw/WithdrawManager'
import { useSharedContext } from '@/context/ShareAut'
import React from 'react'

function page() {

  const { groupId, role } = useSharedContext()
    
  return (
    <div className='p-6 flex flex-col gap-5'>
        <WithdrawMethodsManager groupId={groupId}/>
    </div>
  )
}

export default page