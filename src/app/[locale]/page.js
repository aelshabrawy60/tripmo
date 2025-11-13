import MainHero from '@/components/Templates/Main/MainHero'
import React from 'react'
import { unstable_cache } from 'next/cache'
import { TrendingDestinations, popularTrips } from '@/utils/trips_engine/trips_engine'
import TopDestinations from '@/components/website/TopDestinations'
import TripsStripSection from '@/components/website/TripsStripSection'
import PaymentWays from '@/components/website/PaymentWays'
import locales from '../../../messages/locales'
import WhyChooseUs from '@/components/website/WhyChooseUs'

export const revalidate = 21600 // Revalidate every 6 hours //

// Cache the data fetching functions
const getCachedDestinations = unstable_cache(
  async (locale) => await TrendingDestinations(locale),
  ['trending-destinations'],
  {
    revalidate: 21600, // 6 hours
    tags: ['destinations']
  }
)

const getCachedTrips = unstable_cache(
  async (locale) => await popularTrips(locale),
  ['popular-trips'],
  {
    revalidate: 21600, // 6 hours
    tags: ['trips']
  }
)

async function page({params}) {
  const { locale } = params;
  
  // These will be cached on the server
  const topDestinations = await getCachedDestinations(locale)
  const topTrips = await getCachedTrips(locale)

  return (
    <>
        <MainHero 
            img="/hero5.jpg" 
            title={locale == "en"? locales.Home.title.en : locales.Home.title.ar}
            subtitle={locale == "en"? locales.Home.subtitle.en : locales.Home.subtitle.ar}
            locale={locale}
        />
        <div className='mt-[100px]'>
            <TripsStripSection tripsData={topTrips.top} title={locale == "en"? locales.Home.topTripsTitle.en : locales.Home.topTripsTitle.ar} locale={locale}/>
            <div>
              <TopDestinations destinations={topDestinations} title={locale == "en"? locales.Home.topDestTitle.en : locales.Home.topDestTitle.ar}/>
            </div>

            <div className='mt-20'>
              {
                topTrips.categories?.map((categorie) => {
                  return (
                    <TripsStripSection 
                      key={categorie.city} 
                      tripsData={categorie.trips} 
                      title={`${locale == "en" ? "Trips to" : "رحلات الي"} ${categorie.city}`} 
                      locale={locale}
                    />
                  )
                })
              }
            </div>

            <div className='mt-20 mb-20'>
              <WhyChooseUs/>
            </div>
        </div>
    </>
  )
}

export default page