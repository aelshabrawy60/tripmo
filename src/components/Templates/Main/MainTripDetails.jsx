"use client"

import DetailedCancelationPolicy from '@/components/Trips/DetaildCancellationPolicy'
import FromTo from '@/components/Trips/FromTo'
import AccordionItem from '@/components/website/AccordionItem'
import PointMap from '@/components/website/PointMap'
import ProfileCard from '@/components/website/ProfileCard'
import { Bus, BusFront, Clock, Languages, Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { getLangFullName } from '@/utils/translation/helpers'

function MainTripDetails({name, about, groupId, depature_city, dest_city, locale, startLocation, policy, duration, translation, guideLangs}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  
  const MAX_LENGTH = 300 // Adjust this value as needed
  
  // Get translated content and check if any translation occurred
  const translatedAbout = getTranslatedAbout(about, translation, locale)
  const isAboutTranslated = translatedAbout !== about && translation?.description?.main_lang !== locale
  
  const translatedName = getTranslatedName(name, translation, locale)
  const isNameTranslated = translatedName !== name && translation?.name?.main_lang !== locale
  
  const pickupNote = getTranslatedPickUpNote(startLocation?.description, translation, locale)
  
  const meetingPointNote = getTranslatedMeetPointNotes(startLocation?.notes, translation, locale)

  // Check if any content is translated
  const hasTranslatedContent = isNameTranslated || isAboutTranslated

  // Determine what text to show based on translation state
  const displayName = showOriginal ? name : translatedName
  const displayAbout = showOriginal ? about : translatedAbout
  const displayPickupNote = showOriginal ? startLocation?.description : pickupNote
  const displayMeetingPointNote = showOriginal ? startLocation?.notes : meetingPointNote

  const shouldShowReadMore = displayAbout && displayAbout.length > MAX_LENGTH
  const displayText = shouldShowReadMore && !isExpanded 
    ? displayAbout.substring(0, MAX_LENGTH) + '...'
    : displayAbout

  // Single translation indicator component
  const TranslationIndicator = () => {
    if (!hasTranslatedContent) return null
    
    return (
      <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-blue-400" />
            <span className="text-sm text-blue-500 font-medium">
              {locale === "en" ? "Content has been translated" : "تم ترجمة المحتوى"}
            </span>
          </div>
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 underline underline-offset-2 cursor-pointer focus:outline-none px-2 py-1 rounded hover:bg-blue-100"
            title={showOriginal 
              ? (locale === "en" ? "Show translation" : "عرض الترجمة")
              : (locale === "en" ? "Show original" : "عرض النص الأصلي")
            }
          >
            {showOriginal ? <EyeOff size={12} /> : <Eye size={12} />}
            {showOriginal 
              ? (locale === "en" ? "Show translation" : "عرض الترجمة")
              : (locale === "en" ? "Show original" : "عرض الأصلي")
            }
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
        <TranslationIndicator />
        
        <div className='text-2xl md:text-3xl font-bold gap-2 mb-2 mt-0 flex items-center flex-wrap'>
          {displayName}
        </div>
        
        <div className='mb-2'>
          <FromTo from={depature_city} to={dest_city} locale={locale}/>
        </div>

        <div className='mt-8'>
          {duration !== null && duration != 0?
            <div className='flex gap-3'>
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
                <div className='font-medium mb-2 flex items-center flex-wrap'>
                  {locale == "en"? "Pickup included" : "متاح استقبالك من مكان اقامتك"}
                </div>
                <div className='text-sm text-gray-600 flex gap-2 items-start flex-wrap'>
                  {displayPickupNote}
                </div>
              </div>
            </div>
          :
            null
          }

          {
            guideLangs && guideLangs.length > 0 ?
            <div className='flex gap-3 mt-4'>
              <Languages size={25}/>
              <div>
                <div className='font-medium mb-2 flex items-center flex-wrap'>
                  {locale == "en"? "Guide languages" : "لغات المرشدين"}
                </div>
                <div className='text-sm text-gray-600 flex gap-2 items-start flex-wrap'>
                  {guideLangs.map((lang, index) => (
                    <span key={index} className='bg-gray-100 text-blue-500 px-2 py-1 text-xs'>
                      {getLangFullName(lang, locale)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            :
            null
          }
        </div>

        <div className='text-lg mt-10 mb-2'>
          <span dangerouslySetInnerHTML={{ __html: displayText.replace(/\n/g, "<br />") }} />
          <div className="flex items-center flex-wrap gap-2 mt-2">
            {shouldShowReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='text-blue-500 hover:text-blue-600 text-sm underline underline-offset-4 cursor-pointer focus:outline-none'
              >
                {isExpanded 
                  ? (locale == "en" ? "Show less" : "عرض أقل")
                  : (locale == "en" ? "Show more" : "عرض المزيد")
                }
              </button>
            )}
          </div>
        </div>
        
        <div className='mb-6 mt-10'>
          {
            startLocation?.type == "meeting_point" ?
              <AccordionItem
                title={locale == "en"? "Meeting Point" : "نقطة التجمع"}
              >
                {
                  startLocation?.location?.latitude && startLocation?.location?.longitude ?
                    <PointMap meetingPoint={startLocation.location}/>
                    :
                    null
                }
                {
                  startLocation?.notes ? 
                    <div className='mt-4 flex items-start flex-wrap'>
                      {displayMeetingPointNote}
                    </div>
                  : null
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

function getTranslatedAbout(about, translation, locale) {
  try {
    if (translation.description.main_lang !== locale) {
      return translation.description.translation?.[locale] || about
    }
  } catch (e) {
  }
  return about
}

function getTranslatedPickUpNote(note, translation, locale) {
  try {
    if (translation.pickup_note.main_lang !== locale) {
      return translation.pickup_note.translation?.[locale] || note
    }
  } catch (e) {
  }
  return note
}

export function getTranslatedName(name, translation, locale) {
  try {
    if (translation.name.main_lang !== locale) {
      return translation.name.translation?.[locale] || name
    }
  } catch (e) {
  }
  return name
}

function getTranslatedMeetPointNotes(note, translation, locale) {
  try {
    if (translation.meeting_point_note.main_lang !== locale) {
      return translation.meeting_point_note.translation?.[locale] || note
    }
  } catch (e) {
  }
  return note
}