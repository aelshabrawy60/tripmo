"use client"
import React, { useEffect, useRef, useState } from "react"
import MainTripCard from "../Templates/Main/MainTripCard"
import { ChevronRight, ChevronLeft } from "lucide-react"

function TripsStrip({ tripsData }) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef(null)

  // Check if screen is mobile
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768) // md breakpoint
  }

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      const isRTL = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'
      
      if (isRTL) {
        // For RTL, scrollLeft is negative or starts from max value
        const maxScrollLeft = scrollWidth - clientWidth
        setShowLeftArrow(Math.abs(scrollLeft) < maxScrollLeft - 1)
        setShowRightArrow(Math.abs(scrollLeft) > 0)
      } else {
        // For LTR (default behavior)
        setShowLeftArrow(scrollLeft > 0)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
      }
    }
  }

  // Handle smooth scrolling
  const scroll = (direction) => {
    if (scrollContainerRef.current && !isScrolling) {
      setIsScrolling(true)
      const scrollAmount = 320 // Width of one card plus gap
      const currentScroll = scrollContainerRef.current.scrollLeft
      const isRTL = document.documentElement.dir === 'rtl' || document.body.dir === 'rtl'
      
      let targetScroll
      if (isRTL) {
        // For RTL, reverse the scroll direction logic
        targetScroll = direction === 'left' 
          ? currentScroll + scrollAmount 
          : currentScroll - scrollAmount
      } else {
        // For LTR (default behavior)
        targetScroll = direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount
      }

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })

      // Reset scrolling state after animation
      setTimeout(() => setIsScrolling(false), 300)
    }
  }

  // Set up scroll listener, resize listener, and initial checks
  useEffect(() => {
    const container = scrollContainerRef.current
    
    // Initial checks
    checkMobile()
    
    if (container) {
      checkScrollPosition()
      container.addEventListener('scroll', checkScrollPosition)
      
      // Check on resize
      const resizeObserver = new ResizeObserver(() => {
        checkMobile()
        checkScrollPosition()
      })
      resizeObserver.observe(container)

      // Listen for window resize
      window.addEventListener('resize', checkMobile)

      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
        resizeObserver.disconnect()
        window.removeEventListener('resize', checkMobile)
      }
    }
  }, [tripsData])

  // Handle empty state
  if (!tripsData || tripsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="text-gray-600 text-lg font-medium mb-2">No trips available</div>
        <div className="text-gray-400 text-sm text-center max-w-sm">
          Discover amazing destinations and start planning your next adventure!
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full py-6" dir="rtl">
      {/* Left Arrow - Hidden on mobile */}
      {showLeftArrow && !isMobile && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Right Arrow - Hidden on mobile */}
      {showRightArrow && !isMobile && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-2 md:gap-6 overflow-x-auto scrollbar-hide px-2 md:px-4 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {tripsData.map((trip, index) => (
          <div
            key={trip.id || index}
            className="flex-shrink-0 w-68"
          >
            <MainTripCard tripData={trip} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TripsStrip