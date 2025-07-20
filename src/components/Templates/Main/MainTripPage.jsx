import React from 'react'
import MainTrip from './MainTrip'

function MainTripPage({config, tripData, locale}) {
  return (
    <div>
        <MainTrip tripData={tripData} locale={locale}/>
    </div>
  )
}

export default MainTripPage