import FromTo from '@/components/Trips/FromTo'
import ProfileCard from '@/components/website/ProfileCard'
import React from 'react'

function MainTripDetails({name, about, groupId, depature_city, dest_city, locale}) {
  return (
    <div>
        <div className='text-2xl font-bold mb-2 mt-0'>{name}</div>
        <div className='mb-2'>
          <FromTo from={depature_city} to={dest_city} locale={locale}/>
        </div>
        <div className='text-lg mb-10' dangerouslySetInnerHTML={{ __html: about.replace(/\n/g, "<br />") }} />
        <ProfileCard type={1} profileId={groupId}/>
    </div>
  )
}

export default MainTripDetails