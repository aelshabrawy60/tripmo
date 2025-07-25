import FromTo from '@/components/Trips/FromTo'
import AccordionItem from '@/components/website/AccordionItem'
import PointMap from '@/components/website/PointMap'
import ProfileCard from '@/components/website/ProfileCard'
import { Bus, BusFront } from 'lucide-react'
import React from 'react'

function MainTripDetails({name, about, groupId, depature_city, dest_city, locale, startLocation}) {
  return (
    <div>
        <div className='text-2xl md:text-3xl font-bold mb-2 mt-0'>{name}</div>
        <div className='mb-2'>
          <FromTo from={depature_city} to={dest_city} locale={locale}/>
        </div>
        {startLocation?.type == "pickup" && startLocation?.description ? 
          <div className='flex gap-3 mt-10'>
            <BusFront size={25}/>
            <div>
              <div className='font-medium mb-2'> {locale == "en"? "Pickup included" : "متاح استقبالك من مكان اقامتك"}</div>
              <div className='text-sm text-gray-600'>{startLocation.description}</div>
            </div>
          </div>
        :
        null}
        <div className='text-lg mt-10 mb-10' dangerouslySetInnerHTML={{ __html: about.replace(/\n/g, "<br />") }} />
        <div className='mb-6'>
          {
            startLocation?.type == "meeting_point" && startLocation?.location?.latitude && startLocation?.location?.longitude ?
              <AccordionItem
                title={locale == "en"? "Meeting Point" : "نقطة التجمع"}

              >
                <PointMap meetingPoint={startLocation.location}/>
                {
                  startLocation?.notes ? <div className='mt-4'>{startLocation.notes}</div> : null
                }
              </AccordionItem>
            :
            null
          }
        </div>
        <ProfileCard type={1} profileId={groupId}/>
    </div>
  )
}

export default MainTripDetails