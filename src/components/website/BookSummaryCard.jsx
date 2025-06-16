import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, CreditCard } from 'lucide-react';
import RateShow from './RateShow';
import StarsRates from './StarsRates';

function BookSummaryCard({ tripData, day, seats, pricing }) {
  const [imageLoaded, setImageLoaded] = useState(false);

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
        {/* Floating Trip Name */}
        <div className="flex justify-between flex-col py-1">
            <h2 className="text-lg font-bold text-black-500 leading-tight mb-4">
              {tripData?.name}
            </h2>
            <StarsRates rate={tripData?.rate}/>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-5">
        {/* Date & Time Row */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">موعد الرحلة</div>
            <div className="font-semibold text-gray-800">
              {day || 'لم يتم تحديد التاريخ'}
            </div>
          </div>
        </div>

        {/* Guests & Pricing Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Guests */}
          <div className="text-center p-4 border border-gray-100 rounded-xl">
            <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-xs text-gray-500 mb-1">عدد الأفراد</div>
            <div className="font-bold text-gray-800">
              {seats || '0'}
            </div>
          </div>

          {/* Total Price */}
          <div className="text-center p-4 bg-tripmo-500 text-white rounded-xl">
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            <div className="text-xs opacity-80 mb-1">إجمالي السعر</div>
            <div className="font-bold">
              {pricing?.price ? `${pricing.price} ج.م` : '0 ج.م'}
            </div>
          </div>
        </div>

        {/* Deposit Section */}
        {pricing?.deposit && (
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">مقدم الدفع</span>
              <span className="font-semibold text-gray-800">
                {pricing.deposit} ج.م
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookSummaryCard