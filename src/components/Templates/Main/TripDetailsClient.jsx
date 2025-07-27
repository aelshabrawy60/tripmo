'use client'

import { Languages, Eye, EyeOff, BusFront } from 'lucide-react'
import React, { useState } from 'react'

// Client component for interactive functionality
function TripDetailsClient({
  name,
  translatedName,
  isNameTranslated,
  about,
  translatedAbout, 
  isAboutTranslated,
  pickupNote,
  originalPickupNote,
  isPickupTranslated,
  meetingPointNote,
  originalMeetingPointNote,
  isMeetingPointTranslated,
  translation,
  locale
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showOriginalName, setShowOriginalName] = useState(false)
  const [showOriginalAbout, setShowOriginalAbout] = useState(false)
  const [showOriginalPickup, setShowOriginalPickup] = useState(false)
  
  const MAX_LENGTH = 300
  
  // Determine what text to show based on translation state
  const displayName = showOriginalName ? name : translatedName
  const displayAbout = showOriginalAbout ? about : translatedAbout
  const displayPickupNote = showOriginalPickup ? originalPickupNote : pickupNote

  const shouldShowReadMore = displayAbout && displayAbout.length > MAX_LENGTH
  const displayText = shouldShowReadMore && !isExpanded 
    ? displayAbout.substring(0, MAX_LENGTH) + '...'
    : displayAbout

  return (
    <>
      {/* Title with translation toggle */}
      <div className='text-2xl md:text-3xl font-bold gap-2 mb-2 mt-0 flex items-center flex-wrap'>
        {displayName}
        <TranslationIndicator 
          isTranslated={isNameTranslated}
          showOriginal={showOriginalName}
          onToggle={() => setShowOriginalName(!showOriginalName)}
          originalLang={translation?.name?.main_lang}
          locale={locale}
        />
      </div>

      {/* Pickup section */}
      {originalPickupNote && (
        <div className='flex gap-3 mt-4'>
          <BusFront size={25}/>
          <div>
            <div className='font-medium mb-2 flex items-center flex-wrap'>
              {locale == "en" ? "Pickup included" : "متاح استقبالك من مكان اقامتك"}
            </div>
            <div className='text-sm text-gray-600 flex gap-2 items-start flex-wrap'>
              {displayPickupNote}
              <TranslationIndicator 
                isTranslated={isPickupTranslated}
                showOriginal={showOriginalPickup}
                onToggle={() => setShowOriginalPickup(!showOriginalPickup)}
                originalLang={translation?.pickup_note?.main_lang}
                locale={locale}
              />
            </div>
          </div>
        </div>
      )}

      {/* About section with read more/less */}
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
            locale={locale}
          />
        </div>
      </div>
    </>
  )
}

// Separate component for meeting point notes
TripDetailsClient.MeetingPointNotes = function MeetingPointNotes({
  note,
  originalNote,
  isTranslated,
  translation,
  locale
}) {
  const [showOriginalMeetingPoint, setShowOriginalMeetingPoint] = useState(false)
  
  const displayMeetingPointNote = showOriginalMeetingPoint ? originalNote : note
  
  return (
    <>
      {displayMeetingPointNote}
      <TranslationIndicator 
        isTranslated={isTranslated}
        showOriginal={showOriginalMeetingPoint}
        onToggle={() => setShowOriginalMeetingPoint(!showOriginalMeetingPoint)}
        originalLang={translation?.meeting_point_note?.main_lang}
        locale={locale}
      />
    </>
  )
}

// Translation indicator component
const TranslationIndicator = ({ isTranslated, showOriginal, onToggle, originalLang, locale }) => {
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

export default TripDetailsClient