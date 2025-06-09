import React from 'react'
import MainNavbar from './MainNavbar'
import MainTripCard from './MainTripCard'
import MainTrip from './MainTrip'
import MainFooter from './MainFooter'

function MainTripPage({config, tripData}) {
  return (
    <div>
        <MainTrip tripData={tripData}/>
    </div>
  )
}

export default MainTripPage