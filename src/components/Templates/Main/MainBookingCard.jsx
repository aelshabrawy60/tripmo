"use client"
import DateChooser from '@/components/Bookings/DateChooser'
import PersonsNumChooser from '@/components/Bookings/PersonsNumChooser'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Users, Check, X, Loader, ArrowRight } from 'lucide-react'
import BookingFormWithModal from './MainBookForm'
import Loading from '@/components/Loading'

function MainBookingCard({ tripData }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSeatsNum, setSelectedSeatsNum] = useState(1)
  const [totalPrice, setTotalPrice] = useState(null)
  const [depositPrice, setDepositPrice] = useState(null)
  const [isAvail, setIsAvail] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function checkAvailAndPricing() {
    if (!selectedDate || !selectedSeatsNum) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Format date for the API - ensure it's properly formatted even if it's not a Date object
      const formattedDate = selectedDate
        
      // API call to check availability and get pricing
      const response = await fetch(`/api/client/bookings?tripId=${tripData.id}&date=${formattedDate}&numberOfSeats=${selectedSeatsNum}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setIsAvail(true)
        setTotalPrice(data.pricing.price)
        // Calculate deposit (assuming 20% of total price)
        setDepositPrice(data.pricing.deposit)
      } else {
        setIsAvail(false)
        setTotalPrice(null)
        setDepositPrice(null)
        setError(data.message || 'غير متوفر في هذاالتاريخ')
      }
    } catch (err) {
      setIsAvail(false)
      setError("غير متاح")
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
    }, 100) // Add debounce to prevent too many API calls
    
    return () => clearTimeout(timer)
  }, [selectedDate, selectedSeatsNum])

  function handleDateChange(date) {
    setSelectedDate(date)
  }

  function handleSeatsChange(num) {
    setSelectedSeatsNum(num)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-md w-full">      
      <div className="space-y-6">
        {/* Date Selection */}
        <div className="flex gap-2 p-2 rounded-lg">
          <DateChooser tripData={tripData} onDateChange={handleDateChange}/>
          <PersonsNumChooser onChange={handleSeatsChange} />
        </div>
      
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        )}
        
        {/* Error Message */}
        {error && !isLoading && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        )}
        
        {/* Availability and Pricing */}
        {isAvail && !isLoading && totalPrice && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Check className="text-blue-600 w-5 h-5 ml-2" />
              <h3 className="font-semibold text-blue-800">متوفر!</h3>
            </div>
            
            <div className="space-y-2 mt-3">              
              <div className="flex justify-between">
                <span className="font-bold">السعر الإجمالي:</span>
                <span className="font-bold text-blue-600">
                  {new Intl.NumberFormat('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    minimumFractionDigits: 0
                  }).format(totalPrice)}
                </span>

              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المقدم المطلوب:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    minimumFractionDigits: 0
                  }).format(depositPrice)}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Booking Button */}
        <a
          href={`/trips/${tripData.id}/book?date=${selectedDate}&seats=${selectedSeatsNum}`}
          className="bg-blue-600 w-full hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center gap-2"
        >
          حجز الآن
          <ArrowRight size={18} />
        </a>
        
      </div>
    </div>
  )
}

export default MainBookingCard