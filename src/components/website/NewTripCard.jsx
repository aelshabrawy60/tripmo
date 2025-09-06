import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import formatPrice from '@/utils/currency/PriceFormate';
import Cookies from 'js-cookie';
import RateShow from '@/components/website/RateShow';
import { Clock, Clock1, RotateCcw } from 'lucide-react';


function NewTripCard({tripData, locale = "ar"}) {

  const {
    name,
    images,
    availability_type,
    available_day,
    pricing,
    slug,
    rates_sum,
    rates_count,
    translation,
    cancellation_policy,
    dest,
    duration
  } = tripData;

  const Currency = Cookies.get('currency');
  const firstImage = images && images.length > 0 ? images[0] : null;
  const ratingAverage = rates_sum / rates_count;
  const name_ = getTranslatedName(name, translation, locale);
  const location = dest ? (locale === 'ar' ? dest.name : dest.name_en) : '';


  // Calculate sale prices
  const calculatePrices = () => {
    if (!pricing?.PersonPrice) return { finalPrice: 0, originalPrice: 0, hasSale: false };
    
    const finalPrice = pricing.PersonPrice;
    const saleUp = pricing?.sale_up;

    if (saleUp && saleUp > 0) {
      const originalPrice = finalPrice + (finalPrice * saleUp);
      return { finalPrice, originalPrice, hasSale: true };
    }

    return { finalPrice, originalPrice: finalPrice, hasSale: false };
  };

  const { finalPrice, originalPrice, hasSale } = calculatePrices();

  return (
    <Link
        href={`/trips/${slug}`}
        className="bg-[#FAFAFA] h-[370px] rounded-md overflow-hidden shadow-xs m-2 border border-gray-100 flex flex-col"
      >
        {/* Image section */}
        <div className="relative h-48 md:h-50 overflow-hidden">
          <Image
            src={firstImage}
            alt={name_}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover h-full transition-transform duration-500 hover:scale-105"
          />
          {ratingAverage && (
            <div className="absolute bottom-2 right-2 bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
              <RateShow
                rate={ratingAverage.toFixed(1)}
                count={rates_count}
                type={1}
                size={3}
              />
            </div>
          )}
        </div>

        {/* Text area takes the remaining height */}
        <div className="p-3.5 flex flex-col flex-grow justify-between">
          <div>
            <div className="text-md font-bold text-gray-800">{name_}</div>
            <div className="text-sm text-gray-500 mb-2">{location}</div>
            <div className='flex items-center gap-2'>
              {duration && (
                <div className='flex items-center gap-1 text-sm'>
                  <Clock1 className="inline-block w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {duration <=24 ? duration : duration / 24} {locale === "ar" ? "ساعة" : duration <= 24 ? "hours" : "days"}
                  </span>
                </div>
              )}
              {cancellation_policy?.type != "no_refund" && (
                <div className='flex items-center gap-1 text-sm'>
                  <RotateCcw className="inline-block w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {locale === "ar" ? "إلغاء مجاني" : "Free cancellation"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div id="pricing" className="mt-auto">
            {pricing && (
              <div className="font-bold flex flex-col items-start">
                {hasSale ? (
                  <>
                    <span className="text-gray-500 line-through decoration-red-500 decoration-1 text-[12px]">
                      {formatPrice(originalPrice, Currency)}
                    </span>
                    <span className="text-gray-800">
                      {formatPrice(finalPrice, Currency)}{" "}
                      <span className="text-xs font-medium text-gray-500 mx-0.5">
                        {locale === "ar" ? "للفرد" : "per person"}
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="text-gray-800">
                    {formatPrice(finalPrice, Currency)}{" "}
                    <span className="text-xs font-medium text-gray-500 mx-0.5">
                      {locale === "ar" ? "للفرد" : "per person"}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>

  )
}

export default NewTripCard


function getTranslatedName(name, translation, locale) {
  try {
    if (translation.name.main_lang !== locale) {
      return translation.name.translation?.[locale] || name;
    }
  } catch (e) {}
  return name;
}
