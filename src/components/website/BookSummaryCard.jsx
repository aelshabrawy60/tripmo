import React, { useState } from 'react';
import { Calendar, Users, CreditCard, Clock } from 'lucide-react';
import StarsRates from './StarsRates';
import Cookies from 'js-cookie';
import formatPrice from '@/utils/currency/PriceFormate';
import PersonsNumChooserBottomSheet from '../Bookings/PersonsNumChooserBottomSheet';
import DateChooserBottomSheet from '../Bookings/DateChooserBottomSheet';
import TimeChooserBottomSheet from '../Trips/TimeChooserBottomSheet';


function BookSummaryCard({ tripData, day, seats, pricing, locale = 'ar', time = null, handlePersonsChange, handleDateChange, handleTimeChange }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPersonsModalOpen, setIsPersonsModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  

  const t = {
    tripDate: {
      ar: "اليوم",
      en: "Day"
    },
    tripTime: {
      ar: "الوقت",
      en: "Time"
    },
    notSelected: {
      ar: "لم يتم تحديد التاريخ",
      en: "Date not selected"
    },
    guests: {
      ar: "عدد الأفراد",
      en: "Number of Guests"
    },
    adults: {
      ar: "بالغ",
      en: "Adult"
    },
    children: {
      ar: "طفل",
      en: "Child"
    },
    infants: {
      ar: "رضيع",
      en: "Infant"
    },
    totalPrice: {
      ar: "إجمالي السعر",
      en: "Total Price"
    },
    deposit: {
      ar: "مقدم الدفع",
      en: "Deposit"
    },
  };

  function formatTime(timeStr) {
    // Create a date with the given time (today's date doesn't matter)
    const date = new Date(`1970-01-01T${timeStr}`);
    
    // Format to 12-hour clock with AM/PM
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  const Currency = Cookies.get('currency');

  // Calculate totals and check if breakdown is needed
  const adultsCount = parseInt(seats.adults) || 0;
  const childrenCount = parseInt(seats.children) || 0;
  const infantsCount = parseInt(seats.infants) || 0;
  const totalGuests = adultsCount + childrenCount + infantsCount;
  
  // Show breakdown if more than one type has guests
  const guestTypes = [
    { count: adultsCount, label: t.adults[locale] },
    { count: childrenCount, label: t.children[locale] },
    { count: infantsCount, label: t.infants[locale] }
  ].filter(type => type.count > 0);
  
  const showBreakdown = guestTypes.length > 1;

  // Calculate prices for sale display
  const calculatePrices = () => {
    if (!pricing?.price) return { finalPrice: 0, originalPrice: 0, hasSale: false };
    
    const finalPrice = pricing.price; // Customer pays this amount
    const saleUp = tripData?.pricing?.sale_up;
    
    if (saleUp && saleUp > 0) {
      // Calculate what the original price would have been before discount
      const originalPrice = finalPrice + (finalPrice * (saleUp));
      return { finalPrice, originalPrice, hasSale: true };
    }
    
    return { finalPrice, originalPrice: finalPrice, hasSale: false };
  };

  const { finalPrice, originalPrice, hasSale } = calculatePrices();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-50 overflow-hidden w-full">
      {/* Hero Image Section */}
      <div className="relative flex gap-4 mb-4">
        <img 
          className={`w-24 h-24 object-cover rounded-md transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          src={tripData?.images?.[0]} 
          alt={tripData?.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />        
        {/* Trip Name & Rating */}
        <div className="flex justify-between flex-col py-1">
            <h2 className="text-lg font-bold text-black-500 leading-tight mb-4">
              {tripData?.name}
            </h2>
            <StarsRates rate={tripData?.rate}/>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-5">
        <div className='flex gap-5 w-full'>

          {/* Date & Time */}
          <div className="flex flex-1 items-center gap-3 p-4 bg-gray-50 rounded-xl" onClick={() => setIsDateModalOpen(true)}>
              <div className="flex-1">
                <div className='flex items-center gap-2 mb-1'>
                  <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <div className="text-sm text-gray-500">
                  {t.tripDate[locale]}
                  </div>
                </div>
                
                <div className="font-semibold text-gray-800">
                  {day || t.notSelected[locale]}
                </div>
              </div>
          </div>

          {
              time && time != "null" && (
                <div className="flex flex-1 items-center gap-3 p-4 bg-gray-50 rounded-xl" onClick={() => setIsTimeModalOpen(true)}>
                  <div className="flex-1">
                    <div className='flex items-center gap-2 mb-1'>
                      <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      <div className="text-sm text-gray-500">
                        {t.tripTime[locale]}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {formatTime(time) || t.notSelected[locale]}
                    </div>
                  </div>
                </div>
              )
          }
        </div>


        {/* Guests & Price */}
        <div className="grid grid-cols-2 gap-4">
          {/* Guests */}
          <div className="text-center p-4 border border-gray-100 rounded-xl" onClick={() => setIsPersonsModalOpen(true)}>
            <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-xs text-gray-500 mb-1">
              {t.guests[locale]}
            </div>
            <div className="font-bold text-gray-800 mb-1">
              {!showBreakdown ? totalGuests || '0' : ''}
            </div>
            
            {/* Person Type Breakdown */}
            {showBreakdown && (
              <div className="text-xs font-bold">
                {guestTypes.map((type, index) => (
                  <span key={index}>
                    {type.count} {type.label}
                    {index < guestTypes.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Total Price */}
          <div className="text-center p-4 bg-tripmo-500 text-white rounded-xl">
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <div className="text-xs opacity-80 mb-1">
              {t.totalPrice[locale]}
            </div>
            <div className="font-bold">
              {hasSale ? (
                <div className="space-y-1">
                  <div className="text-xs opacity-75 line-through">
                    {formatPrice(originalPrice, Currency)}
                  </div>
                  <div>
                    {formatPrice(finalPrice, Currency)}
                  </div>
                </div>
              ) : (
                <div>
                  {finalPrice ? `${formatPrice(finalPrice, Currency)}` : `0 ${Currency || ''}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Deposit */}
        {pricing?.deposit && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {t.deposit[locale]}
              </span>
              <span className="font-semibold text-gray-800">
                {formatPrice(pricing.deposit, Currency)}
              </span>
            </div>
          </div>
        )}
      </div>

      
      <PersonsNumChooserBottomSheet
        onChange={handlePersonsChange}
        initialValue={{ adults: parseInt(seats.adults), children: parseInt(seats.children), infants: parseInt(seats.infants) }}
        isOpen={isPersonsModalOpen}
        tripPersonsGroups={{
                ChildPrice: tripData.pricing.ChildPrice ?? null,
                InfantPrice: tripData.pricing.InfantPrice ?? null
              }}
        onClose={() => setIsPersonsModalOpen(false)}
        locale={locale}
        selectedDate={day}
        tripData={tripData}
        selectedTime={time}
      />

      <DateChooserBottomSheet
        tripData={tripData}
        onDateChange={handleDateChange}
        initialDate={new Date(day)}
        locale={locale}
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
      />

      <TimeChooserBottomSheet
        tripData={tripData}
        onChange={handleTimeChange}
        initialTime={time}
        locale={locale}
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
      />
    </div>
  );
}

export default BookSummaryCard;