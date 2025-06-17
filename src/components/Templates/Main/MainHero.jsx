"use client"
import TripsMainFilter from '@/components/website/TripsMainFilter'
import React from 'react'

function MainHero({img, title, subtitle = null}) {
  return (
    <div className='w-full h-screen relative bg-black max-h-[520px] md:max-h-[320px] rounded-2xl lg:rounded-3xl mb-16 sm:mb-20 md:mb-10'>
        <img src={img} className='w-full h-full object-cover opacity-40 rounded-2xl lg:rounded-3xl'></img>
        
        {/* Hero Content - Adjusted positioning on mobile */}
        <div className='absolute min-w-[300px] top-1/3 sm:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <div className='text-4xl mb-5 md:text-5xl text-center text-white font-bold'>{title}</div>
            <div className='text-md md:text-xl text-center text-gray-300'>{subtitle}</div>
        </div>
        
        {/* Filter - Responsive bottom positioning */}
        <div className='absolute -bottom-16 sm:-bottom-20 md:-bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-6xl'>
          <TripsMainFilter/>
        </div>
    </div>
  )
}

export default MainHero