import DetailedCancelationPolicy from '@/components/Trips/DetaildCancellationPolicy'
import FromTo from '@/components/Trips/FromTo'
import AccordionItem from '@/components/website/AccordionItem'
import PointMap from '@/components/website/PointMap'
import ProfileCard from '@/components/website/ProfileCard'
import { Bus, BusFront, Clock } from 'lucide-react'
import React, { useState } from 'react'

function MainTripDetails({name, about, groupId, depature_city, dest_city, locale, startLocation, policy, duration}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const MAX_LENGTH = 300 // Adjust this value as needed
  
  const shouldShowReadMore = about && about.length > MAX_LENGTH
  const displayText = shouldShowReadMore && !isExpanded 
    ? about.substring(0, MAX_LENGTH) + '...'
    : about

  return (
    <div>
        <div className='text-2xl md:text-3xl font-bold mb-2 mt-0'>{name}</div>
        <div className='mb-2'>
          <FromTo from={depature_city} to={dest_city} locale={locale}/>
        </div>

        {duration !== null ?
          <div className='flex gap-3 mt-8'>
            <Clock size={25}/>
            <div>
              <div className='font-medium'>{locale == "en"? "duration": "المدة"}</div>
              <div className='text-sm text-gray-600'>
              {
                duration >= 24 ?
                `${duration / 24} ${locale == "en" ? "day" : "يوم"}`
                :
                `${duration} ${locale == "en" ? "hour" : "ساعة"}`
              }
              </div>
            </div>
          </div>
        :
          null
        }

        {startLocation?.type == "pickup" && startLocation?.description ? 
          <div className='flex gap-3 mt-4'>
            <BusFront size={25}/>
            <div>
              <div className='font-medium mb-2'> {locale == "en"? "Pickup included" : "متاح استقبالك من مكان اقامتك"}</div>
              <div className='text-sm text-gray-600'>{startLocation.description}</div>
            </div>
          </div>
        :
        null}

        <div className='text-lg mt-10 mb-2'>
          <span dangerouslySetInnerHTML={{ __html: displayText.replace(/\n/g, "<br />") }} />
          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-blue-600 hover:text-blue-800 mt-2 mx-2 underline underline-offset-4 cursor-pointer focus:outline-none'
            >
              {isExpanded 
                ? (locale == "en" ? "Show less" : "عرض أقل")
                : (locale == "en" ? "Show more" : "عرض المزيد")
              }
            </button>
          )}
        </div>
        
        <div className='mb-6 mt-10'>
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

          <AccordionItem
            title={locale == "en"? "cancellation policy": "سياسة الإلغاء"}
          >
            <DetailedCancelationPolicy policy={policy} locale={locale}/>
          </AccordionItem>
        </div>
        <ProfileCard type={1} profileId={groupId}/>
    </div>
  )
}

export default MainTripDetails