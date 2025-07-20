import StarsRates from '@/components/website/StarsRates';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

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
  } = tripData;

  const firstImage = images && images.length > 0 ? images[0] : null;
  const ratingAverage = rates_sum / rates_count;
  const formattedPrice = pricing
    ? new Intl.NumberFormat(locale === 'ar' ? 'en-EG' : 'en-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 0,
      }).format(pricing.PersonPrice)
    : '';

  return (
    <Link href={`/trips/${slug}`} className="block">
      <div className="max-w-lg rounded-md overflow-hidden transition-all duration-300 m-2 flex flex-col h-full">
        {/* Image container */}
        <div className="relative h-50 md:h-52 overflow-hidden rounded-b-lg">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-b-lg">
              <span className="text-gray-400 text-sm">{locale === 'ar' ? 'لا توجد صورة' : 'No image'}</span>
            </div>
          )}

          {availability_type && (
            <div className="absolute top-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
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
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex flex-col justify-between items-start">
            <div>
              <h2 className="text-md font-bold text-gray-800 mb-2">
                {name}
              </h2>
            </div>
            {ratingAverage ? (
              <div className='flex gap-1 items-center text-gray-600'>
                <div>{ratingAverage.toFixed(1)}</div>
                <StarsRates rate={ratingAverage} size={4} />
                <div>{`(${rates_count})`}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MainTripCard;
