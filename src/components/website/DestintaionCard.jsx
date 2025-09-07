import React from 'react';
import Image from 'next/image';

function DestinationCard({ data }) {
  return (
    <a href={`/trips?dest_city=${data.id}`} className="relative w-full h-64 p-6 rounded-lg overflow-hidden group cursor-pointer transform transition-all duration-300">
      {/* Background Image */}
      <Image
        src={data.image}
        alt={data.name}
        fill
        sizes="(max-width: 768px) 100vw, 500px"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        priority // Optional: if this is above the fold
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/80"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:text-white group-hover:drop-shadow-xl">
            {data.name}
          </h3>
          <p className="text-gray-200 font-medium drop-shadow-md transition-all duration-300 group-hover:text-gray-100">
            {data.country}
          </p>
        </div>


      </div>
    </a>
  );
}

export default DestinationCard;
