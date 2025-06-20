import ProfileAbout from '@/components/website/ProfileAbout'
import ProfileCard from '@/components/website/ProfileCard'
import TripsViewer from '@/components/website/TripsViewer'
import React from 'react'

async function page({params}) {
  // Await params before destructuring
  const {id} = await params
  
  async function fetchProfileData() {
    // Use absolute URL or ensure proper base URL handling
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    const response = await fetch(`${baseUrl}/api/client/host?id=${id}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile data')
    }
    
    const data = await response.json()
    return data
  }
  
  const profileData = await fetchProfileData()
  console.log('Profile Data:', profileData)
  
  return (
    <div>
      <div className="flex gap-10 flex-wrap mt-16 justify-center lg:justify-start">
        <ProfileCard profileData={profileData.group} />
        <ProfileAbout profileData={profileData.group} />
      </div>
      <div className='mt-10'>
        <div className='text-3xl font-bold px-6 md:px-0'>الرحلات</div>
        <TripsViewer trips={profileData.trips} />
      </div>
    </div>
  )
}

export default page