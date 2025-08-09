import React, { useState } from 'react';
import { Calendar, Users, CreditCard } from 'lucide-react';
import StarsRates from './StarsRates';
import Cookies from 'js-cookie';
import formatPrice from '@/utils/currency/PriceFormate';


function BookSummaryCard({ tripData, day, seats, pricing, locale = 'ar' }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const t = {
    tripDate: {
      ar: "موعد الرحلة",
      en: "Trip Date"
    },
    notSelected: {
      ar: "لم يتم تحديد التاريخ",
      en: "Date not selected"
    },
    guests: {
      ar: "عدد الأفراد",
      en: "Number of Guests"
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

  const Currency = Cookies.get('currency');

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
        {/* Date & Time */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">
              {t.tripDate[locale]}
            </div>
            <div className="font-semibold text-gray-800">
              {day || t.notSelected[locale]}
            </div>
          </div>
        </div>

        {/* Guests & Price */}
        <div className="grid grid-cols-2 gap-4">
          {/* Guests */}
          <div className="text-center p-4 border border-gray-100 rounded-xl">
            <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-xs text-gray-500 mb-1">
              {t.guests[locale]}
            </div>
            <div className="font-bold text-gray-800">
              {parseInt(seats.adults) + parseInt(seats.children) + parseInt(seats.infants) || '0'}
            </div>
          </div>

          {/* Total Price */}
          <div className="text-center p-4 bg-tripmo-500 text-white rounded-xl">
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <div className="text-xs opacity-80 mb-1">
              {t.totalPrice[locale]}
            </div>
            <div className="font-bold">
              {pricing?.price ? `${formatPrice(pricing.price, Currency)}` : `0 ${t.currency[locale]}`}
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
    </div>
  );
}

export default BookSummaryCard;
