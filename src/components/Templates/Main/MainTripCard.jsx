import StarsRates from '@/components/website/StarsRates';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import formatPrice from '@/utils/currency/PriceFormate';
import Cookies from 'js-cookie';
import RateShow from '@/components/website/RateShow';

function MainTripCard({ tripData, themeColor = "#4F46E5", locale = "ar" }) {
  const {
    name,
    name_en,
    images,
    availability_type,
    available_day,
    pricing,
    id,
    slug,
    rates_sum,
    rates_count,
    dest,
    depature,
    translation
  } = tripData;

  const Currency = Cookies.get('currency');
  const firstImage = images && images.length > 0 ? images[0] : null;
  const ratingAverage = rates_sum / rates_count;
  const formattedPrice = formatPrice(pricing.PersonPrice, Currency)
  const name_ = getTranslatedName(name, translation, locale)

  return (
    <Link href={`/trips/${slug}`} className="block">
      <div className="max-w-lg rounded-md overflow-hidden transition-all duration-300 m-2 flex flex-col">
        {/* Image container */}
        <div className="relative h-50 md:h-52 overflow-hidden rounded-b-md">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={name_}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover h-full transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-b-lg">
              <span className="text-gray-400 text-sm">{locale === 'ar' ? 'لا توجد صورة' : 'No image'}</span>
            </div>
          )}

          {availability_type && (
            <div className="absolute top-2 right-2 bg-white/80 text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              {availability_type === 'fixed'
                ? available_day
                : availability_type === 'daily'
                ? (locale === 'ar' ? 'يوميا' : 'Daily')
                : (locale === 'ar' ? 'مواعيد متعددة' : 'Multiple dates')}
            </div>
          )}

          {pricing && (
            <div className="absolute bottom-2 left-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
              {formattedPrice} {locale === 'ar' ? 'للفرد' : 'per person'}
            </div>
          )}

          {ratingAverage && (
            <div className="absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
              <RateShow rate={ratingAverage.toFixed(1)} count={rates_count} type={1} size={3}/>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex flex-col justify-between items-start h-full">
            <div>
              <h2 className="text-md font-bold text-gray-800 mb-2">
                {name_}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MainTripCard;


function getTranslatedName(name, translation, locale) {
  
  try {
    if (translation.name.main_lang !== locale) {
      return translation.name.translation?.[locale] || name
    }
  } catch (e) {
  }
  return name
}