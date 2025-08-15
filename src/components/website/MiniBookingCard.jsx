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
    person: locale === 'ar' ? 'للشخص' : 'per person',
    save: locale === 'ar' ? 'وفر' : 'SAVE'
  }

  const Currency = Cookies.get('currency');

  // Calculate sale prices
  const calculatePrices = () => {
    if (!pricing?.PersonPrice) return { finalPrice: 0, originalPrice: 0, hasSale: false };
    
    const finalPrice = pricing.PersonPrice;
    const saleUp = pricing?.sale_up;

    if (saleUp && saleUp > 0) {
      const originalPrice = finalPrice + (finalPrice * saleUp);
      return { finalPrice, originalPrice, hasSale: true };
    }

    return { finalPrice, originalPrice: finalPrice, hasSale: false };
  };

  const { finalPrice, originalPrice, hasSale } = calculatePrices();

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
        const isBookingSectionVisible = rect.top < windowHeight && rect.bottom > 0;
        setIsVisible(!isBookingSectionVisible);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
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
          {hasSale ? (
            <div className="flex flex-col gap-0.5">
              <div className="text-sm text-gray-500 line-through decoration-1 decoration-red-500">
                {formatPrice(originalPrice, Currency)}
              </div>
              <div className="font-bold text-blue-600 text-lg flex items-center gap-2">
                {formatPrice(finalPrice, Currency)}
                <span className="text-sm text-gray-500 font-normal ml-1">
                  {t.person}
                </span>
              </div>
            </div>
          ) : (
            <div className="font-bold text-blue-600 text-lg flex gap-2 items-center">
              {formatPrice(finalPrice, Currency)}
              <span className="text-sm text-gray-500 font-normal ml-1">
                {t.person}
              </span>
            </div>
          )}
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
