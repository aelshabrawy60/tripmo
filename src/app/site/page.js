import MainHero from '@/components/Templates/Main/MainHero'
import React from 'react'
import { TrendingDestinations, popularTrips } from '@/utils/trips_engine/trips_engine'
import TopDestinations from '@/components/website/TopDestinations'
import TripsStripSection from '@/components/website/TripsStripSection'
import PaymentWays from '@/components/website/PaymentWays'

export const revalidate = 21600 // Revalidate every 6 hours


async function page() {

  const topDestinations = await TrendingDestinations()
  const topTrips =  (await popularTrips())


  return (
    <>
        <MainHero 
            img="/0x0.webp" 
            title="رحلتك القادمة تبدأ من هنا"
            subtitle="اكتشف أجمل الوجهات، قارن بين أفضل العروض، واحجز رحلتك بكل سهولة."
        />
        <div className='mt-[100px]'>
            <TripsStripSection tripsData={topTrips.top} title={'رحلات رائجة'}/>
            <div className='mt-[50px]'>
              <TopDestinations destinations={topDestinations}/>
            </div>

            {
              topTrips.categories?.map((categorie) => {
                return (
                  <TripsStripSection 
                    key={categorie.city} 
                    tripsData={categorie.trips} 
                    title={`رحلات الي ${categorie.city}`} 
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