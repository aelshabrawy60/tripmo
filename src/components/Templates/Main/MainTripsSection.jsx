"use client"
import React, { useRef, useState, useEffect } from 'react'
import MainTripCard from './MainTripCard'
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MainTripsSection = ({ tripsData, title, theme }) => {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  
  // Check if content is scrollable
  useEffect(() => {
    const checkIfScrollable = () => {
      if (!sliderRef.current) return;
      
      const { scrollWidth, clientWidth } = sliderRef.current;
      const scrollable = scrollWidth > clientWidth;
      
      setIsScrollable(scrollable);
      setShowRightArrow(scrollable); // Only show right arrow if content is scrollable
    };
    
    // Check initially and on window resize
    checkIfScrollable();
    window.addEventListener('resize', checkIfScrollable);
    
    return () => {
      window.removeEventListener('resize', checkIfScrollable);
    };
  }, [tripsData]);
  
  // Function to handle scrolling left or right
  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    
    const scrollAmount = 300; // Scroll by this many pixels
    const currentScroll = sliderRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    sliderRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };
  
  // Update arrow visibility on scroll
  const handleScrollEvent = () => {
    if (!sliderRef.current || !isScrollable) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-3xl font-bold" style={{ color: theme || '#333' }}>{title || "الرحلات"}</h2>
      </div>
      
      <div className="relative">
        {/* Left scroll button */}
        {isScrollable && showLeftArrow && (
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
            onClick={() => handleScroll('left')}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {/* Scrollable container */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto scrollbar-hide snap-x scroll-px-4 pb-4 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScrollEvent}
        >
          {tripsData.map((trip, index) => (
            <div key={index} className="snap-start">
              <MainTripCard tripData={trip} themeColor={theme} />
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        {isScrollable && showRightArrow && (
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
            onClick={() => handleScroll('right')}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MainTripsSection