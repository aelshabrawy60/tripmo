import React from 'react'
import StarsRates from './StarsRates'

function RateShow({ rate, count, type = 0, size = 4 }) {
  if (!count > 0) {
    return (
      <div className='w-fit'>
        <div className='flex justify-center mb-2'>
          <span className='text-xs text-gray-500'>لا توجد تقييمات بعد</span>
        </div>
      </div>
    )
  }

  // Helper function to map `size` to text size classes
  const getTextSize = () => {
    if (size <= 3) return 'text-sm'
    if (size === 4) return 'text-lg'
    if (size === 5) return 'text-lg'
    if (size >= 6) return 'text-xl'
    return 'text-base'
  }

  if (type == 1) {
    return (
      <div className='flex items-center gap-1'>
        <svg
          className={`w-${size} h-${size} fill-current text-tripmo-500`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.122-6.535L1 7.545l6.556-.955L10 1l2.444 5.59L19 7.545l-4.244 4.01L15.878 18z" />
        </svg>
        <span className={`font-bold ${getTextSize()}`}>{rate}</span>
        <span className='text-xs text-gray-500'>({count})</span>
      </div>
    )
  }

  return (
    <div className='w-fit'>
      <div className='flex justify-center mb-2'>
        <div className='flex items-center gap-1'>
          <span className='font-bold text-xl'>{rate}</span>
          <span className='text-xs text-gray-500'>({count})</span>
        </div>
      </div>
      <StarsRates rate={rate} />
    </div>
  )
}

export default RateShow
