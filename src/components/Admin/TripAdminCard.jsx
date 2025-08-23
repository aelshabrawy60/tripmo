"use client"

import React, { useState } from 'react';
import { Users, MapPin, Star, Calendar, ExternalLink, Shield, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import BlockTripModal from './BlockTripModal';
import { useRouter } from 'next/navigation';

function TripAdminCard({ data, onStatusChange }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  
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

  async function addToCatalouge(e, tripId) {
    e.stopPropagation();
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/trips/extract?id=${tripId}`);
      if (!response.ok) {
        console.error("Failed to download CSV");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const currentStatus = statusConfig[data.status] || statusConfig.private;
  const priceInfo = getPriceInfo();
  const isBlocked = data.status === 'blocked';

  return (
    <div
      onClick={() => router.push(`/trips/${data.id}`)}
      className="group relative bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 overflow-hidden cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
    >
      {/* Mobile-first layout */}
      <div className="p-4 sm:p-5">
        {/* Header section */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Trip thumbnail and basic info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Trip thumbnail - responsive sizing */}
            <div className="relative flex-shrink-0">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300 shadow-sm">
                <Image
                  src={data.images?.[0] || '/profile-fallback.jpg'}
                  alt={data.name || 'Trip thumbnail'}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 48px, 64px"
                />
                {isBlocked && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
                    <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Trip details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                {data.name}
              </h3>
              
              {/* Mobile: Show only essential info */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">الحد الأقصى:</span>
                  <span>{data.max_clients}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{getAvailabilityText()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status badge - always visible */}
          <div className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${currentStatus.color} ${currentStatus.ring} ring-1 shadow-sm`}>
            <div className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}></div>
            <span className="hidden sm:inline">{currentStatus.label}</span>
          </div>
        </div>

        {/* Pricing section - responsive layout */}
        {priceInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 mb-4 border border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">السعر للفرد:</span>
                <span className="font-bold text-gray-900 text-sm sm:text-base">
                  {formatAmount(priceInfo.basePrice)}
                </span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-blue-600">الدفع المسبق:</span>
                <span className="font-semibold text-blue-700 text-sm sm:text-base">
                  {priceInfo.advancePayment}%
                </span>
              </div>
            </div>
            
            {/* Special pricing indicators */}
            {(priceInfo.weeklyDaysPricing.length > 0 || priceInfo.personsPricing.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-blue-200">
                {priceInfo.weeklyDaysPricing.length > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    أسعار خاصة للأيام: {priceInfo.weeklyDaysPricing.length}
                  </span>
                )}
                {priceInfo.personsPricing.length > 0 && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                    أسعار المجموعات: {priceInfo.personsPricing.length}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Location and Rating section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{data.depature_city} إلى {data.dest_city}</span>
          </div>

          {data.rates_count > 0 && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm bg-yellow-50 text-yellow-700 rounded-lg px-3 py-2 border border-yellow-200">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{data.score.toFixed(1)}</span>
              <span className="text-yellow-600">({data.rates_count})</span>
            </div>
          )}
        </div>

        {/* Action buttons - responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Block/Unblock component */}
          <div onClick={handleBlockComponentClick} className="flex-1 sm:flex-initial">
            <BlockTripModal 
              tripData={data} 
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
      </div>

      {/* View trip button - repositioned for mobile */}
      <button
        onClick={handleExternalLinkClick}
        className="absolute top-2 left-2 sm:top-3 sm:left-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg border border-gray-100 hover:scale-105"
        title="View trip in new tab"
      >
        <ExternalLink className="w-4 h-4 text-gray-600" />
      </button>

    </div>
  );
}

export default TripAdminCard;