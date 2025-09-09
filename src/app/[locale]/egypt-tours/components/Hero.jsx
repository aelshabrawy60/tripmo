import React from 'react'
import Image from 'next/image'

function Hero() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 md:p-12 md:px-0 justify-between'>
        <div className='text-center md:text-left'>
            <h1 className='text-3xl font-bold md:text-4xl lg:5xl'>Book Egypt Tours & Vacation Packages</h1>
            <p className='mt-8 text-lg'>
                Ready to discover the ancient wonders of Egypt? Below you’ll find Egypt tours, featuring all-inclusive Nile cruises, private visits to the Pyramids of Giza, and certified Egyptologist guides. Find your dream adventure and book your trip of a lifetime today.
            </p>
        </div>
        <div className='flex gap-4 justify-center'>
            <div className='mt-4'>
                <img
                    src="/egypt-tours-hero.jpg"
                    alt="Egypt Tours Hero"
                    width={250}
                    height={150}
                    className="mt-6 rounded-lg"
                />
                <img
                    src="/egypt-tours-hero-2.jpg"
                    alt="Egypt Tours Hero 2"
                    width={250}
                    height={150}
                    className="mt-6 rounded-lg"
                />
            </div>
            <div>
                <img
                    src="/egypt-tours-hero-3.jpg"
                    alt="Egypt Tours Hero 3"
                    width={250}
                    className="h-[270px] object-cover mt-6 rounded-lg"
                />
            </div>
        </div>
    </div>
  )
}

export default Hero