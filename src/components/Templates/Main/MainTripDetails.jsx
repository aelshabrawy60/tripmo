"use client"

import DetailedCancelationPolicy from '@/components/Trips/DetaildCancellationPolicy'
import FromTo from '@/components/Trips/FromTo'
import AccordionItem from '@/components/website/AccordionItem'
import PointMap from '@/components/website/PointMap'
import ProfileCard from '@/components/website/ProfileCard'
import { Bus, BusFront, Clock, Languages, Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

function MainTripDetails({name, about, groupId, depature_city, dest_city, locale, startLocation, policy, duration, translation}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showOriginalName, setShowOriginalName] = useState(false)
  const [showOriginalAbout, setShowOriginalAbout] = useState(false)
  const [showOriginalPickup, setShowOriginalPickup] = useState(false)
  const [showOriginalMeetingPoint, setShowOriginalMeetingPoint] = useState(false)
  
  const MAX_LENGTH = 300 // Adjust this value as needed
  
  // Get translated content and check if translation occurred
  const translatedAbout = getTranslatedAbout(about, translation, locale)
  const isAboutTranslated = translatedAbout !== about && translation?.description?.main_lang !== locale
  
  const translatedName = getTranslatedName(name, translation, locale)
  const isNameTranslated = translatedName !== name && translation?.name?.main_lang !== locale
  
  const pickupNote = getTranslatedPickUpNote(startLocation?.description, translation, locale)
  const isPickupTranslated = pickupNote !== startLocation?.description && translation?.pickup_note?.main_lang !== locale
  
  const meetingPointNote = getTranslatedMeetPointNotes(startLocation?.notes, translation, locale)
  const isMeetingPointTranslated = meetingPointNote !== startLocation?.notes && translation?.meeting_point_note?.main_lang !== locale

  // Determine what text to show based on translation state
  const displayName = showOriginalName ? name : translatedName
  const displayAbout = showOriginalAbout ? about : translatedAbout
  const displayPickupNote = showOriginalPickup ? startLocation?.description : pickupNote
  const displayMeetingPointNote = showOriginalMeetingPoint ? startLocation?.notes : meetingPointNote

  const shouldShowReadMore = displayAbout && displayAbout.length > MAX_LENGTH
  const displayText = shouldShowReadMore && !isExpanded 
    ? displayAbout.substring(0, MAX_LENGTH) + '...'
    : displayAbout

  // Translation indicator component
  const TranslationIndicator = ({ isTranslated, showOriginal, onToggle, originalLang }) => {
    if (!isTranslated) return null
    
    return (
      <div className="inline-flex items-center gap-1 ml-2">
        <Languages size={16} className="text-blue-500" />
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer focus:outline-none"
          title={showOriginal 
            ? (locale === "en" ? "Show translation" : "عرض الترجمة")
            : (locale === "en" ? "Show original" : "عرض النص الأصلي")
          }
        >
          {showOriginal ? <EyeOff size={12} /> : <Eye size={12} />}
          {showOriginal 
            ? (locale === "en" ? "Hide original" : "إخفاء الأصلي")
            : (locale === "en" ? "Show original" : "عرض الأصلي")
          }
        </button>
      </div>
    )
  }

  return (
    <div>
        <div className='text-2xl md:text-3xl font-bold gap-2 mb-2 mt-0 flex items-center flex-wrap'>
          {displayName}
          <TranslationIndicator 
            isTranslated={isNameTranslated}
            showOriginal={showOriginalName}
            onToggle={() => setShowOriginalName(!showOriginalName)}
            originalLang={translation?.name?.main_lang}
          />
        </div>
        
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
              <div className='font-medium mb-2 flex items-center flex-wrap'>
                {locale == "en"? "Pickup included" : "متاح استقبالك من مكان اقامتك"}
              </div>
              <div className='text-sm text-gray-600 flex gap-2 items-start flex-wrap'>
                {displayPickupNote}
                <TranslationIndicator 
                  isTranslated={isPickupTranslated}
                  showOriginal={showOriginalPickup}
                  onToggle={() => setShowOriginalPickup(!showOriginalPickup)}
                  originalLang={translation?.pickup_note?.main_lang}
                />
              </div>
            </div>
          </div>
        :
          null
        }

        <div className='text-lg mt-10 mb-2'>
          <span dangerouslySetInnerHTML={{ __html: displayText.replace(/\n/g, "<br />") }} />
          <div className="flex items-center flex-wrap gap-2 mt-2">
            {shouldShowReadMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='text-blue-600 hover:text-blue-800 underline underline-offset-4 cursor-pointer focus:outline-none'
              >
                {isExpanded 
                  ? (locale == "en" ? "Show less" : "عرض أقل")
                  : (locale == "en" ? "Show more" : "عرض المزيد")
                }
              </button>
            )}
            <TranslationIndicator 
              isTranslated={isAboutTranslated}
              showOriginal={showOriginalAbout}
              onToggle={() => setShowOriginalAbout(!showOriginalAbout)}
              originalLang={translation?.description?.main_lang}
            />
          </div>
        </div>
        
        <div className='mb-6 mt-10'>
          {
            startLocation?.type == "meeting_point" && startLocation?.location?.latitude && startLocation?.location?.longitude ?
              <AccordionItem
                title={locale == "en"? "Meeting Point" : "نقطة التجمع"}
              >
                <PointMap meetingPoint={startLocation.location}/>
                {
                  startLocation?.notes ? 
                    <div className='mt-4 flex items-start flex-wrap'>
                      {displayMeetingPointNote}
                      <TranslationIndicator 
                        isTranslated={isMeetingPointTranslated}
                        showOriginal={showOriginalMeetingPoint}
                        onToggle={() => setShowOriginalMeetingPoint(!showOriginalMeetingPoint)}
                        originalLang={translation?.meeting_point_note?.main_lang}
                      />
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