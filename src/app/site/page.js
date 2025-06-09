"use client"
import MainFooter from '@/components/Templates/Main/MainFooter'
import MainHero from '@/components/Templates/Main/MainHero'
import MainLayout from '@/components/Templates/Main/MainLayout'
import MainNavbar from '@/components/Templates/Main/MainNavbar'
import TripsMainFilter from '@/components/website/TripsMainFilter'
import React from 'react'


function page() {
  return (
    <>
        <MainHero 
            img="/shutterstock-2409522421.webp" 
            title="رحلتك القادمة تبدأ من هنا"
            subtitle="اكتشف أجمل الوجهات، قارن بين أفضل العروض، واحجز رحلتك بكل سهولة."
        />
        <div className='mt-[400px]'>

        </div>
    </>
  )
}

export default page