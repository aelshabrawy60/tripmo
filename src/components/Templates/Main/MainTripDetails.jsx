import React from 'react'

function MainTripDetails({name, about}) {
  return (
    <div>
        <div className='text-2xl font-bold my-4'>{name}</div>
        <div className='max-w-[500px]'>{about}</div>
    </div>
  )
}

export default MainTripDetails