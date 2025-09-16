import { Clock } from 'lucide-react'
import React, { useEffect } from 'react'

function ItineraryStep({data, stepNumber}) {
  return (
    <div dir='ltr'>
        <div className='flex items-center gap-4'>
            <div className='w-3 h-3 bg-tripmo-500 p-4 rounded-full text-white font-bold flex justify-center items-center step-circle'>
                {stepNumber}
            </div>
            <div>
                <h3 className='text-xl font-bold'>{data?.title}</h3>
                
            </div>
        </div>
        <div className='ps-14 mt-2'>
            <p>{data?.description}</p>
            <div className='text-sm flex items-center text-gray-600 mt-2'>
                    <Clock size={14} className='me-1'/>
                    <span>{data?.duration}</span>
                <span>H</span>
            </div>
        </div>
    </div>
  )
}

export default ItineraryStep