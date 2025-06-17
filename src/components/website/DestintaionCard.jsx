import React from 'react'

function DestinationCard({data}) {
  return (
    <div className='relative w-full h-64 p-6 rounded-xl overflow-hidden group cursor-pointer transform transition-all duration-300'>
      {/* Background Image */}
      <img 
        src={data.image} 
        alt={data.name}
        className='absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
      />
      
      {/* Dark Overlay */}
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/80'></div>
      
      {/* Content */}
      <div className='relative z-10 h-full flex flex-col justify-end'>
        <div className='space-y-1'>
          <h3 className='text-2xl font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:text-white group-hover:drop-shadow-xl'>
            {data.name}
          </h3>
          <p className='text-gray-200 font-medium drop-shadow-md transition-all duration-300 group-hover:text-gray-100'>
            {data.country}
          </p>
        </div>
        
        {/* Optional: Add a subtle indicator */}
        <div className='mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='w-12 h-0.5 bg-white rounded'></div>
        </div>
      </div>
    </div>
  )
}

export default DestinationCard