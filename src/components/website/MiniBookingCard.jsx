"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import Cookies from 'js-cookie';
import formatPrice from '@/utils/currency/PriceFormate';

function MiniBookingCard({ pricing, locale }) {
  const [isVisible, setIsVisible] = useState(true);

  const t = {
    from: locale === 'ar' ? 'من' : 'From',
    bookNow: locale === 'ar' ? 'احجز الآن' : 'Book Now',
    person: locale === 'ar' ? 'للشخص' : 'per person'
  }

  const Currency = Cookies.get('currency');

  const handleBookNowClick = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        const rect = bookingSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if the booking section is visible on screen
        // Consider it visible if any part of it is within the viewport
        const isBookingSectionVisible = rect.top < windowHeight && rect.bottom > 0;
        
        setIsVisible(!isBookingSectionVisible);
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 py-3.5 shadow-lg z-50 md:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Price Section */}
        <div className="flex-1">
          <div className="text-xs text-gray-600 mb-1">{t.from}</div>
          <div className="font-bold text-blue-600 text-lg flex gap-2 items-center">
            {formatPrice(pricing?.PersonPrice, Currency)}
            <span className="text-sm text-gray-500 font-normal ml-1">
              {t.person}
            </span>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookNowClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center gap-2 min-w-[120px] justify-center"
        >
          {t.bookNow}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default MiniBookingCard