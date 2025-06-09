import React from 'react'

function ProfileAbout({profileData}) {
  return (
    <div className='max-w-[600px] px-6'>
        <div className='text-3xl font-bold mb-6 hidden lg:block'>عن {profileData.name} </div>
        <div className='text-lg'>
            {profileData.about}
        </div>
    </div>
  )
}

export default ProfileAbout