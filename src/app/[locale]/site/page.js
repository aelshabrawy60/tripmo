import MainHero from '@/components/Templates/Main/MainHero'
import React from 'react'
import { TrendingDestinations, popularTrips } from '@/utils/trips_engine/trips_engine'
import TopDestinations from '@/components/website/TopDestinations'
import TripsStripSection from '@/components/website/TripsStripSection'
import PaymentWays from '@/components/website/PaymentWays'
import locales from '../../../../messages/locales'
export const revalidate = 21600 // Revalidate every 6 hours


async function page({params}) {


  const { locale } = params;
  const topDestinations = await TrendingDestinations(locale)
  const topTrips =  (await popularTrips())



  return (
    <>
        <MainHero 
            img="/0x0.webp" 
            title={locale == "en"? locales.Home.title.en : locales.Home.title.ar}
            subtitle={locale == "en"? locales.Home.subtitle.en : locales.Home.subtitle.ar}
            locale={locale}
        />
        <div className='mt-[100px]'>
            <TripsStripSection tripsData={topTrips.top} title={locale == "en"? locales.Home.topTripsTitle.en : locales.Home.topTripsTitle.ar} locale={locale}/>
            <div className='mt-5'>
              <TopDestinations destinations={topDestinations} title={locale == "en"? locales.Home.topDestTitle.en : locales.Home.topDestTitle.ar}/>
            </div>

            {
              topTrips.categories?.map((categorie) => {
                return (
                  <TripsStripSection 
                    key={categorie.city} 
                    tripsData={categorie.trips} 
                    title={`رحلات الي ${categorie.city}`} 
                    locale={locale}
                  />
                )
              })
            }

            <div className='mt-20'>
              <PaymentWays/>
            </div>
        </div>
    </>
  )
}

export default page