import React from 'react'
import MainNavbar from './MainNavbar'
import MainTripCard from './MainTripCard'
import MainTrip from './MainTrip'
import MainFooter from './MainFooter'

function MainTripPage({config, tripData}) {
  return (
    <div>
        <MainNavbar pages={config.pages} theme={config.theme}/>
        <MainTrip tripData={tripData}/>
        <MainFooter theme={config.theme} contactInfo={config.contactInfo}/>
    </div>
  )
}

export default MainTripPage