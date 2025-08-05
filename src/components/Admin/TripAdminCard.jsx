"use client"

import React from 'react';
import { Users, MapPin, Star, Calendar, ExternalLink, Shield } from 'lucide-react';
import Image from 'next/image';
import BlockTripModal from './BlockTripModal';
import { useRouter } from 'next/navigation';

function TripAdminCard({ data, onStatusChange }) {
  const router = useRouter();
  
  // Status configuration with Arabic labels and colors
  const statusConfig = {
    active: {
      label: 'عام',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-100'
    },
    private: {
      label: 'خاص',
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      dot: 'bg-gray-500',
      ring: 'ring-gray-100'
    },
    blocked: {
      label: 'محظور',
      color: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
      ring: 'ring-red-100'
    }
  };

  // Format currency amount
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get pricing information
  const getPriceInfo = () => {
    if (!data.pricing) return null;
    const pricing = data.pricing;
    return {
      basePrice: pricing.PersonPrice,
      advancePayment: pricing.AdvancePaymentPercentage,
      weeklyDaysPricing: pricing.PricePerWeeklyDays || [],
      personsPricing: pricing.PricePerPersons || []
    };
  };

  // Get availability text
  const getAvailabilityText = () => {
    switch (data.availability_type) {
      case 'daily':
        return 'يومي';
      case 'weekly':
        return 'أسبوعي';
      case 'specific':
        return data.available_day ? new Date(data.available_day).toLocaleDateString('ar-EG') : 'تاريخ محدد';
      default:
        return 'غير محدد';
    }
  };

  // Handle external link click - prevent event bubbling
  const handleExternalLinkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(`${process.env.NEXT_PUBLIC_SITE_URL}/trips/${data.slug}`, '_blank', 'noopener,noreferrer');
  };

  // Handle block component click - prevent event bubbling
  const handleBlockComponentClick = (e) => {
    e.stopPropagation();
  };

  async function downloadCsv(e, tripId) {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/admin/trips/extract?id=${tripId}`);
      if (!response.ok) {
        console.error("Failed to download CSV");
        return;
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trip-${tripId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  }

  const currentStatus = statusConfig[data.status] || statusConfig.private;
  const priceInfo = getPriceInfo();
  const isBlocked = data.status === 'blocked';

  return (
    <div
      onClick={() => router.push(`/trips/${data.id}`)}
      className="group relative bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 overflow-hidden cursor-pointer"
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Trip info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Trip thumbnail */}
            <div className="relative flex-shrink-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300">
                <Image
                  src={data.images?.[0] || '/profile-fallback.jpg'}
                  alt={data.name || 'Trip thumbnail'}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  sizes="56px"
                />
                {isBlocked && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Trip details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 truncate">
                {data.name}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>الحد الأقصى: {data.max_clients}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{getAvailabilityText()}</span>
                </div>
              </div>
              {priceInfo && (
                <>
                  <div className="flex items-center gap-3 text-sm mt-1">
                    <span className="font-semibold text-gray-900">
                      السعر للفرد: {formatAmount(priceInfo.basePrice)}
                    </span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="text-blue-600 font-medium">
                      الدفع المسبق: {priceInfo.advancePayment}%
                    </span>
                  </div>
                  {(priceInfo.weeklyDaysPricing.length > 0 || priceInfo.personsPricing.length > 0) && (
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      {priceInfo.weeklyDaysPricing.length > 0 && (
                        <span>أسعار خاصة للأيام: {priceInfo.weeklyDaysPricing.length}</span>
                      )}
                      {priceInfo.weeklyDaysPricing.length > 0 && priceInfo.personsPricing.length > 0 && (
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      )}
                      {priceInfo.personsPricing.length > 0 && (
                        <span>أسعار خاصة للمجموعات: {priceInfo.personsPricing.length}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Status badge and actions */}
          <div className="flex items-center gap-3">
            {/* Status badge */}
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 ${currentStatus.color} ${currentStatus.ring} ring-1`}>
              <div className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}></div>
              <span>{currentStatus.label}</span>
            </div>

            {/* Block/Unblock component */}
            <div onClick={handleBlockComponentClick}>
              <BlockTripModal 
                tripData={data} 
                onStatusChange={onStatusChange}
              />
            </div>

            <button className='px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 text-xs font-medium  flex items-center gap-2' onClick={(e) => downloadCsv(e, data.id)}>
              تحميل csv
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-50"></div>

        {/* Bottom section - Additional info */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>{data.depature_city} إلى {data.dest_city}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {data.rates_count > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span>{data.score.toFixed(1)} ({data.rates_count})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View trip link */}
      <button
        onClick={handleExternalLinkClick}
        className="absolute top-3 left-3 p-1.5 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-200"
        title="View trip in new tab"
      >
        <ExternalLink className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}

export default TripAdminCard;