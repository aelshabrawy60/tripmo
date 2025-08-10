"use client"
import MainLinkButton from '@/components/Affiliate/MainLinkButton'
import React from 'react'
import { useSharedContext } from '@/context/ShareAffiliateAuth'
import AffiliateTrips from '@/components/Affiliate/AffiliateTrips'

function pages() {
  const {user} = useSharedContext()
  return (
    <div>
      <MainLinkButton refCode={user?.ref_code} />
      <AffiliateTrips/>
    </div>
  )
}

export default pages