import React from 'react'
import MainLayout from './MainLayout'
import MainNavbar from './MainNavbar'
import MainHero from './MainHero'
import MainFooter from './MainFooter'
import MainTripsSections from './MainTripsSections'
import MainAboutUs from './MainAboutUs'

async function MainHome({config, tripsData}) {

  return (
    <div>
        <MainLayout>
            <MainNavbar pages={config.pages} theme={config.theme}/>
            <MainHero img={config.hero.img} title={config.hero.title} subtitle={config.hero.subtitle}/>
            <MainTripsSections tripsData={tripsData}/>
            <MainAboutUs about={config.about?.about} img={config.about?.img}/>
            <MainFooter theme={config.theme} contactInfo={config.contactInfo}/>
        </MainLayout>
    </div>
  )
}

export default MainHome