import React from 'react'

function ProfileAbout({profileData}) {
  return (
    <div className='max-w-[600px] px-6'>
        <div className='text-3xl font-bold mb-6 hidden lg:block'>عن {profileData.name} </div>
        <div className='text-lg' dangerouslySetInnerHTML={{ __html: profileData.about.replace(/\n/g, "<br />") }} />
    </div>
  )
}

export default ProfileAbout