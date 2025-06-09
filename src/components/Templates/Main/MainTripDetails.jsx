import ProfileCard from '@/components/website/ProfileCard'
import React from 'react'

function MainTripDetails({name, about, groupId}) {
  return (
    <div>
        <div className='text-2xl font-bold mb-5 mt-0'>{name}</div>
        <div className='text-lg mb-10'>{about}</div>
        <ProfileCard type={1} profileId={groupId}/>
    </div>
  )
}

export default MainTripDetails