"use client"
import TripsMainFilter from '@/components/website/TripsMainFilter'
import Image from 'next/image'
import React, { useState } from 'react'

function MainHero({img, title, subtitle = null, locale}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className='w-full h-screen relative rounded-2xl lg:rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black max-h-[520px] lg:max-h-[400px] xl:max-h-[320px] mb-16 sm:mb-20 md:mb-10'>
        {/* Background overlay for smooth transition */}
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/40 rounded-2xl lg:rounded-3xl transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'} z-[1]`} />
        
        {/* Loading skeleton */}
        <div className={`absolute inset-0 rounded-2xl lg:rounded-3xl transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'} z-[2]`}>
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-2xl lg:rounded-3xl animate-pulse" />
        </div>

        {/* Main image container */}
        <div className='w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden'>
          <Image 
            src={img} 
            alt={title || 'Hero background'}
            fill
            className={`object-cover rounded-2xl lg:rounded-3xl transition-all duration-700 ease-out ${
              imageLoaded 
                ? 'opacity-40 scale-100 blur-0' 
                : 'opacity-0 scale-105 blur-sm'
            }`}
            priority
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>

        {/* Error fallback */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-gray-800 to-black rounded-2xl lg:rounded-3xl flex items-center justify-center">
            <div className="text-white/60 text-center">
              <div className="text-2xl mb-2">⚠</div>
              <div className="text-sm">Image failed to load</div>
            </div>
          </div>
        )}
        
        {/* Hero Content - Enhanced with smooth entrance */}
        <div className={`absolute min-w-[300px] top-1/5 sm:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-800 ease-out ${
          imageLoaded 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}>
          <div className='text-4xl mb-3 md:mb-5 md:text-5xl text-center text-white font-bold drop-shadow-2xl'>
            {title}
          </div>
          {subtitle && (
            <div className='text-md md:text-xl text-center text-gray-300 drop-shadow-lg mb-4'>
              {subtitle}
            </div>
          )}
        </div>
        
        {/* Filter - Enhanced entrance animation */}
        <div className={`absolute -bottom-16 sm:-bottom-20 md:-bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-6xl z-30 transition-all duration-800 delay-100 ease-out ${
          imageLoaded 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <TripsMainFilter locale={locale}/>
        </div>
        
        {/* Preload next likely images */}
        <div className="hidden">
          <Image 
            src={img} 
            alt="" 
            width={50} 
            height={50} 
            priority
            onLoad={() => setImageLoaded(true)}
          />
        </div>
    </div>
  )
}

export default MainHero