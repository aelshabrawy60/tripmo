import React from 'react'

function MainHero({img, title, subtitle = null}) {
  return (
    <div className='w-full h-screen relative bg-black max-h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden'>
        <img src={img} className='w-full  h-full object-cover opacity-40'></img>
        <div className='absolute min-w-[300px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <div className='text-3xl mb-5 md:text-6xl text-center text-white font-bold'>{title}</div>
            <div className='text-xl md:text-2xl text-center text-gray-300'>{subtitle}</div>
        </div>
    </div>
  )
}

export default MainHero