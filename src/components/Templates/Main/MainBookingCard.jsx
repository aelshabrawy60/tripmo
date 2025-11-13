"use client"

import DateChooser from '@/components/Bookings/DateChooser'
import PersonsNumChooser from '@/components/Bookings/PersonsNumChooser'
import React, { useState, useEffect, useRef } from 'react'
import { Check, X, Loader, ArrowRight, MessageCircle } from 'lucide-react'
import Cookies from 'js-cookie';
import formatPrice from '@/utils/currency/PriceFormate';
import TimeChooser from '@/components/Trips/TimeChooser'

function MainBookingCard({ tripData, locale, initData }) {
  const [selectedDate, setSelectedDate] = useState(initData.deafultDate)
  const [selectedSeatsNum, setSelectedSeatsNum] = useState({ adults: 1, children: 0, infants: 0 })
  const [selectedTime, setSelectedTime] = useState(initData.deafultTime)
  const [totalPrice, setTotalPrice] = useState(initData.totalPrice)
  const [depositPrice, setDepositPrice] = useState(initData.depoistPrice)
  const [isAvail, setIsAvail] = useState(initData.isAvail)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)


  const prevValuesRef = useRef({
    date: selectedDate,
    seats: selectedSeatsNum,
    time: selectedTime,
  });
  
  // FOMO Countdown states
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [showCountdown, setShowCountdown] = useState(false)

  const t = {
    available: locale === 'ar' ? 'متوفر!' : 'Available!',
    totalPrice: locale === 'ar' ? 'السعر الإجمالي:' : 'Total Price:',
    deposit: locale === 'ar' ? 'المقدم المطلوب:' : 'Deposit Required:',
    bookNow: locale === 'ar' ? 'احجز الآن' : 'Book Now',
    notAvailableMsg: locale === 'ar' ? 'غير متوفر في هذا التاريخ' : 'Not available on this date',
    unavailable: locale === 'ar' ? 'غير متاح' : 'Unavailable',
    save: locale === 'ar' ? 'وفر' : 'SAVE',
    youSave: locale === 'ar' ? 'توفر' : 'You save',
    sale: locale === 'ar' ? 'تخفيض!' : 'SALE!',
    chatWithUs: locale === 'ar' ? 'تحدث معنا' : 'Got questions? Chat now',
    limitedOffer: locale === 'ar' ? 'عرض محدود!' : 'Limited Time Offer!',
    offerEnds: locale === 'ar' ? 'ينتهي العرض في:' : 'Offer ends in:',
    hours: locale === 'ar' ? 'ساعة' : 'h',
    minutes: locale === 'ar' ? 'دقيقة' : 'm',
    seconds: locale === 'ar' ? 'ثانية' : 's',
    onlyLeft: locale === 'ar' ? 'متبقي فقط' : 'spots left!',
    hurryUp: locale === 'ar' ? 'أسرع! مقاعد محدودة' : 'Limited seats',
  }

  const Currency = Cookies.get('currency');

  useEffect(() => {
    const savedEndTime = localStorage.getItem(`offer-countdown-${tripData.id}`)
    let endTime

    if (savedEndTime) {
      endTime = new Date(savedEndTime)
      // If saved time has passed, create a new 62-hour countdown
      if (endTime <= new Date()) {
        endTime = new Date(Date.now() + 62 * 60 * 60 * 1000)
        localStorage.setItem(`offer-countdown-${tripData.id}`, endTime.toISOString())
      }
    } else {
      // Create new 62-hour countdown
      endTime = new Date(Date.now() + 62 * 60 * 60 * 1000)
      localStorage.setItem(`offer-countdown-${tripData.id}`, endTime.toISOString())
    }

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
        setShowCountdown(true)
      } else {
        // Timer expired, create new 62-hour countdown
        const newEndTime = new Date(Date.now() + 62 * 60 * 60 * 1000)
        localStorage.setItem(`offer-countdown-${tripData.id}`, newEndTime.toISOString())
        setShowCountdown(false)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [tripData.id])

  // Calculate prices for sale display
  const calculatePrices = () => {
    if (!totalPrice) return { finalPrice: 0, originalPrice: 0, hasSale: false };
    
    const finalPrice = totalPrice; // Customer pays this amount
    const saleUp = tripData?.pricing?.sale_up;
    
    if (saleUp && saleUp > 0) {
      // Calculate what the original price would have been before discount
      const originalPrice = finalPrice + (finalPrice * (saleUp));
      return { finalPrice, originalPrice, hasSale: true };
    }
    
    return { finalPrice, originalPrice: finalPrice, hasSale: false };
  };

  const { finalPrice, originalPrice, hasSale } = calculatePrices();

  async function checkAvailAndPricing() {
    if (!selectedDate || !selectedSeatsNum) return

    setIsLoading(true)
    setError(null)

    try {
      const formattedDate = selectedDate

      const response = await fetch(
        `/api/client/bookings?tripId=${tripData.id}&date=${formattedDate}&numberOfSeats=${selectedSeatsNum.adults}&time=${selectedTime}&numberOfChildren=${selectedSeatsNum.children}&numberOfInfants=${selectedSeatsNum.infants}`
      )

      if (!response.ok) throw new Error(`API error: ${response.status}`)

      const data = await response.json()

      if (data.success) {
        setIsAvail(true)
        setTotalPrice(data.pricing.price)
        setDepositPrice(data.pricing.deposit)
        setError(null)
      } else {
        setIsAvail(false)
        setTotalPrice(null)
        setDepositPrice(null)
        setError(data.message || t.notAvailableMsg)
      }
    } catch (err) {
      setIsAvail(false)
      setError(t.unavailable)
      console.error("Error checking availability:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {

    const prev = prevValuesRef.current;
    // Compare deeply for seats (object)
    const seatsChanged =
      prev.seats.adults !== selectedSeatsNum.adults ||
      prev.seats.children !== selectedSeatsNum.children ||
      prev.seats.infants !== selectedSeatsNum.infants;

    const dateChanged = prev.date !== selectedDate;
    const timeChanged = prev.time !== selectedTime;

    console.log("dateOld", prev.date, "dateNew", selectedDate)
    console.log("timeOld", prev.time, "timeNew", selectedTime)
    

    // If nothing changed, do nothing
    if (!dateChanged && !seatsChanged && !timeChanged) return;

    const timer = setTimeout(() => {
      if (selectedDate && selectedSeatsNum) {
        checkAvailAndPricing()
      }
    }, 150)

    // Update stored previous values
    prevValuesRef.current = {
      date: selectedDate,
      seats: selectedSeatsNum,
      time: selectedTime,
    };

    return () => clearTimeout(timer)
  }, [selectedDate, selectedSeatsNum, selectedTime])

  function handleDateChange(date) {
    setSelectedDate(date)
  }

  function handleSeatsChange(num) {
    setSelectedSeatsNum(num)
  }

  return (
    <>
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 lg:max-w-md w-full">
      <div className="space-y-6">

        <div className='flex flex-col gap-4'>
          {/* Date & Person Selectors */}
          <div className="flex gap-2 rounded-lg">
            <DateChooser tripData={tripData} onDateChange={handleDateChange} locale={locale} />
            <PersonsNumChooser onChange={handleSeatsChange} locale={locale} 
              tripPersonsGroups={{
                ChildPrice: tripData.pricing.ChildPrice ?? null,
                InfantPrice: tripData.pricing.InfantPrice ?? null
              }}
            />
          </div>
          <div>
            <TimeChooser tripData={tripData} onChange={setSelectedTime} locale={locale}/>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader className="w-6 h-6 text-tripmo-600 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {/* FOMO Countdown Banner */}
        {showCountdown && isAvail && (hasSale || tripData.id === 125) && (
          <div className="bg-gradient-to-r from-tripmo-500 to-tripmo-500 text-white p-3 rounded-lg shadow-lg">
            <div className={` ${locale === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="text-xs mb-1">{t.offerEnds}</div>
              <div className="flex items-center gap-1 font-mono font-bold">
                <span className="bg-white/20 px-2 py-1 rounded text-sm">
                  {String(timeLeft.hours).padStart(2, '0')}{t.hours}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-1 rounded text-sm">
                  {String(timeLeft.minutes).padStart(2, '0')}{t.minutes}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-1 rounded text-sm">
                  {String(timeLeft.seconds).padStart(2, '0')}{t.seconds}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Availability */}
        {isAvail && !isLoading && totalPrice && (
          <div className="bg-tripmo-50 p-4 rounded-lg relative overflow-hidden">
            {hasSale && (
              <div className={`absolute -top-1 bg-red-500 text-white text-sm font-bold px-3 py-1 shadow-lg ${
                locale === 'ar' ? '-left-2 rounded-br-lg rounded-tr-lg' : '-right-2 rounded-bl-lg rounded-tr-lg'
              }`}>
                {t.save} {tripData.pricing.sale_up * 100}%
              </div>
            )}
            
            <div className="flex items-center mb-2">
              <Check className={`text-tripmo-600 w-5 h-5 ${locale == "ar"? "ml-2" : "mr-2"}`} />
              <h3 className="font-semibold text-tripmo-800">{t.available}</h3>
            </div>

            {tripData.id == 125 && (
              <div className="flex items-center gap-2 mb-3">
                {showCountdown && (
                  <div className="h-fit px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs w-fit border border-red-200">
                    <span className='leading-none font-bold'>{t.hurryUp}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 mt-3">
              <div className={`flex justify-between items-end`}>
                <span className="font-bold">{t.totalPrice}</span>
                <div className={`${locale === 'ar' ? 'text-left' : 'text-right'}`}>
                  {hasSale ? (
                    <div className="space-y-1">
                      <div className="text-md text-gray-800 line-through decoration-1 decoration-red-500 opacity-80">
                        {formatPrice(originalPrice, Currency)}
                      </div>
                      <div className="font-bold text-tripmo-600 text-xl md:text-2xl">
                        {formatPrice(finalPrice, Currency)}
                      </div>
                    </div>
                  ) : (
                    <span className="font-bold text-tripmo-600 text-lg md:text-xl">
                      {formatPrice(finalPrice, Currency)}
                    </span>
                  )}
                </div>
              </div>

              <div className={`flex justify-between text-sm`}>
                <span className="text-gray-600">{t.deposit}</span>
                <span className="font-medium text-md md:text-lg">
                  {formatPrice(depositPrice, Currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Book Button & Chat Link */}
        <div className="space-y-3">
          {/* Book Button */}
          {isAvail ? (
            <a
              href={`/trips/${tripData.id}/book?date=${selectedDate}&seats=${selectedSeatsNum.adults}&time=${selectedTime}&children=${selectedSeatsNum.children}&infants=${selectedSeatsNum.infants}`}
              className={`bg-tripmo-600 w-full hover:bg-tripmo-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg`}
            >
              {t.bookNow}
              <ArrowRight size={18} />
            </a>
          ) : (
            <button
              disabled
              className="bg-gray-400 w-full text-gray-600 font-medium py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              {t.bookNow}
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        {/* Chat with us link */}
        <div className="text-center">
          <a
            href="https://wa.me/201061410951"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-tripmo-600 hover:text-tripmo-700 font-bold transition-colors duration-200 hover:underline"
          >
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1022px-WhatsApp.svg.png' width={26}></img>
            {t.chatWithUs}
          </a>
          <div className='text-xs text-gray-500'>we respond in minutes</div>
        </div>
      </div>
      
    </div>
    
    </>
  )
}

export default MainBookingCard