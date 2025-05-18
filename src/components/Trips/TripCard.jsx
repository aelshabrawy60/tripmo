import Link from 'next/link';
import React from 'react';

function TripCard({ tripData }) {
  const { 
    name, 
    about, 
    images, 
    available_day, 
    max_clients,
    availability_type 
  } = tripData;

  // Get only the first image
  const firstImage = images && images.length > 0 ? images[0] : null;

  // Get a shortened version of the about text
  const shortAbout = about ? about.substring(0, 80) + (about.length > 80 ? '...' : '') : '';

  return (
    <div className="max-w-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white m-4 hover:-translate-y-1 flex flex-col" dir="rtl">
      {/* Image container */}
      <div className="relative h-52 overflow-hidden">
        {firstImage && (
          <img 
            src={firstImage} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        
        {availability_type && (
          <div className="absolute top-3 right-3 bg-slate-800/85 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            {availability_type === 'fixed' ? 'موعد ثابت' : 'مواعيد متعددة'}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-3">{name}</h2>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-5">{shortAbout}</p>
        
        {/* Footer */}
        <div className="mt-auto flex text-center">
          <Link href={`/dashboard/trips/${tripData.id}`} className="bg-tripmo-500 justify-center w-full hover:bg-tripmo-400 text-white py-2 px-4 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300 text-sm group">
            عرض التفاصيل
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TripCard;