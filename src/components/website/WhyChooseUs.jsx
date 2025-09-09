import { Compass, ShieldCheck, Zap } from 'lucide-react'
import React from 'react'

function WhyChooseUs() {
  return (
    <div className='px-2 md:px-0'>
        <div className='flex flex-wrap items-center gap-x-4 gap-y-12 justify-center md:justify-between'>
            <div className='max-w-xs text-center flex flex-col items-center'>
                <Compass size={35} className='mb-4 text-tripmo-500'/>
                <h3 className='font-semibold text-xl mb-2'>Discover & Compare Tours</h3>
                <p>Browse a wide range of experiences, Find, compare, and book the trip that fits you.</p>
            </div>
            <div className='max-w-xs text-center flex flex-col items-center'>
                <ShieldCheck size={35} className='mb-4 text-tripmo-500'/>
                <h3 className='font-semibold text-xl mb-2'>Pay Only small deposit to Book</h3>
                <div>Book today by paying as little as 10% upfront and pay the rest when you arrive.</div>
            </div>
            <div className='max-w-xs text-center flex flex-col items-center'>
                <Zap size={35} className='mb-4 text-tripmo-500'/>
                <h3 className='font-semibold text-xl mb-2'>Hassle-Free Booking</h3>
                <p>Our easy-to-use platform allows you to book your dream Egypt tour in just a few clicks.</p>
            </div>
        </div>
    </div>
  )
}

export default WhyChooseUs