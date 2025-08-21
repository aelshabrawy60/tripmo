"use client"

import DateChooser from '@/components/Bookings/DateChooser'
import PersonsNumChooser from '@/components/Bookings/PersonsNumChooser'
import React, { useState, useEffect } from 'react'
import { Check, X, Loader, ArrowRight, MessageCircle } from 'lucide-react'
import Cookies from 'js-cookie';
import formatPrice from '@/utils/currency/PriceFormate';
import TimeChooser from '@/components/Trips/TimeChooser'


function MainBookingCard({ tripData, locale }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSeatsNum, setSelectedSeatsNum] = useState({ adults: 1, children: 0, infants: 0 })
  const [selectedTime, setSelectedTime] = useState(null)
  const [totalPrice, setTotalPrice] = useState(null)
  const [depositPrice, setDepositPrice] = useState(null)
  const [isAvail, setIsAvail] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
    chatWithUs: locale === 'ar' ? 'تحدث معنا' : 'Chat with us'
  }

  const Currency = Cookies.get('currency');

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
    const timer = setTimeout(() => {
      if (selectedDate && selectedSeatsNum) {
        checkAvailAndPricing()
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [selectedDate, selectedSeatsNum, selectedTime])

  function handleDateChange(date) {
    setSelectedDate(date)
  }

  function handleSeatsChange(num) {
    setSelectedSeatsNum(num)
  }

  return (
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
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        {/* Availability */}
        {isAvail && !isLoading && totalPrice && (
          <div className="bg-blue-50 p-4 rounded-lg relative overflow-hidden">
            {hasSale && (
              <div className={`absolute -top-1 bg-red-500 text-white text-sm font-bold px-3 py-1 shadow-lg ${
                locale === 'ar' ? '-left-2 rounded-br-lg rounded-tr-lg' : '-right-2 rounded-bl-lg rounded-tr-lg'
              }`}>
                {t.save} {tripData.pricing.sale_up * 100}%
              </div>
            )}
            
            <div className="flex items-center mb-2">
              <Check className={`text-blue-600 w-5 h-5 ${locale == "ar"? "ml-2" : "mr-2"}`} />
              <h3 className="font-semibold text-blue-800">{t.available}</h3>
            </div>

            <div className="space-y-3 mt-3">
              <div className={`flex justify-between items-end`}>
                <span className="font-bold">{t.totalPrice}</span>
                <div className={`${locale === 'ar' ? 'text-left' : 'text-right'}`}>
                  {hasSale ? (
                    <div className="space-y-1">
                      <div className="text-md text-gray-800 line-through decoration-1 decoration-red-500 opacity-80">
                        {formatPrice(originalPrice, Currency)}
                      </div>
                      <div className="font-bold text-blue-600 text-xl md:text-2xl">
                        {formatPrice(finalPrice, Currency)}
                      </div>
                    </div>
                  ) : (
                    <span className="font-bold text-blue-600 text-lg md:text-xl">
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
              className={`bg-blue-600 w-full hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg`}
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

          {/* Chat with us link */}
          <div className="text-center">
            <a
              href="https://tawk.to/chat/689a083963e952192907c216/1j2cr084q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:underline"
            >
              <MessageCircle size={16} />
              {t.chatWithUs}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainBookingCard