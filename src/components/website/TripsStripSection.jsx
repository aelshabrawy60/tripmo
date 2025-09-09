import React from 'react'
import TripsStrip from './TripsStrip'

function TripsStripSection({tripsData, title, locale}) {
  return (
    <div>
        <h2 className='text-2xl font-bold mb-2 px-2 text-gray-800'>{title}</h2>
        <TripsStrip tripsData={tripsData} locale={locale}/>
    </div>
  )
}

export default TripsStripSection