import StarsRates from '@/components/website/StarsRates';
import Link from 'next/link';
import React from 'react';

function MainTripCard({ tripData, themeColor = "#4F46E5" }) {
  const { 
    name, 
    images, 
    availability_type,
    pricing,
    id ,// For trip ID linking
    slug,
    rates_sum,
    rates_count
  } = tripData;

  // Get only the first image
  const firstImage = images && images.length > 0 ? images[0] : null;

  const ratingAverage = rates_sum/ rates_count
  // Format price with commas
  const formattedPrice = pricing ? pricing.PersonPrice.toLocaleString() : '';

  // Generate stars for rating with theme color
  const renderStars = (rating) => {
    if (!rating) return null;
    
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<span key={i} style={{ color: themeColor }}>★</span>);
      } else if (i - 0.5 === roundedRating) {
        stars.push(<span key={i} style={{ color: themeColor }}>★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return (
      <div className="flex gap-2 items-center">
        <span className="text-sm font-bold text-gray-600">{rating}</span>
        <div className="flex mr-1">{stars}</div>
      </div>
    );
  };

  return (
    <Link href={`/site/trips/${slug}`} className="block">
      <div className="max-w-lg rounded-md overflow-hidden transition-all duration-300 m-2 flex flex-col h-full">
        {/* Image container with rounded bottom corners */}
        <div className="relative h-52 overflow-hidden rounded-b-lg">
          {firstImage ? (
            <img 
              src={firstImage} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-b-lg">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
          
          {availability_type && (
            <div className="absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              {availability_type === 'fixed' ? 'موعد ثابت' : 'مواعيد متعددة'}
            </div>
          )}
          
          {pricing && (
            <div className="absolute bottom-2 left-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
              {formattedPrice} للفرد
            </div>
          )}
        </div>
        
        {/* Content - more compact padding */}
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex flex-col justify-between items-start">
            <h2 className="text-md font-bold text-gray-800 mb-2">{name}</h2>
            {ratingAverage?  (
              <div className='flex gap-1 items-center text-gray-600'>
                <div>{ratingAverage}</div>
                <StarsRates rate={ratingAverage} size={4}/>
                <div>{`(${rates_count})`}</div>
              </div>
            ): null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MainTripCard;