import Link from 'next/link';
import React from 'react';

function MainTripCard({ tripData, themeColor = "#4F46E5" }) {
  const { 
    name, 
    about, 
    images, 
    availability_type,
    pricing,
    rate, // ex 4.3
    id // For trip ID linking
  } = tripData;

  // Get only the first image
  const firstImage = images && images.length > 0 ? images[0] : null;

  // Get a shortened version of the about text (making it shorter for a more compact card)
  const shortAbout = about ? about.substring(0, 70) + (about.length > 70 ? '...' : '') : '';

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
    <Link href={`/trips/${id}`} className="block">
      <div className="max-w-lg rounded-md overflow-hidden transition-all duration-300 m-2 flex flex-col h-full">
        {/* Image container with rounded bottom corners */}
        <div className="relative h-60 overflow-hidden rounded-b-lg">
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
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold text-gray-800 mb-2">{name}</h2>
            {rate && renderStars(rate)}
          </div>
          
          {shortAbout && (
            <p className="text-gray-600 text-xs mt-1">{shortAbout}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default MainTripCard;