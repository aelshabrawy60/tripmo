import React from 'react'
import TripsStrip from './TripsStrip'

function TripsStripSection({tripsData, title, locale}) {
  return (
    <div>
        <div className='text-2xl font-bold mb-2 px-2 md:px-4 text-gray-800'>{title}</div>
        <TripsStrip tripsData={tripsData} locale={locale}/>
    </div>
  )
}

export default TripsStripSection