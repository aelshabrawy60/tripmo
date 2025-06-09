import React from 'react'
import StarsRates from './StarsRates'

function RateShow({rate, count, type = 0}) {

  if(! count > 0){
    return (
      <div className='w-fit'>
        <div className='flex justify-center mb-2'>
          <span className='text-xs text-gray-500'>لا توجد تقييمات بعد</span>
        </div>
      </div>
    )
  }

  if(type == 1){
    return (
      <div className='flex items-center gap-1'>
        <span className='font-bold text-lg'>{rate} </span>
        <span className='text-xs text-gray-500'>({count})</span>
      </div>
    )
  }
  return (
    <div className='w-fit'>
        <div className='flex justify-center mb-2'>
            <div className='flex items-center gap-1'><span className='font-bold text-xl'>{rate} </span> <span className='text-xs text-gray-500'>({count})</span></div>
        </div>
        <StarsRates rate={rate} />
    </div>
  )
}

export default RateShow