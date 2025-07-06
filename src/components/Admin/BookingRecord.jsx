import React, { useEffect } from 'react';
import { ExternalLink, Users, Calendar, Phone, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

function BookingRecord({ data }) {
  // Status configuration with Arabic labels and colors
  const statusConfig = {
    pending: {
      label: 'قيد الانتظار',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      ring: 'ring-amber-100'
    },
    active: {
      label: 'مؤكدة',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      ring: 'ring-emerald-100'
    },
    canceled: {
      label: 'ملغية',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      ring: 'ring-rose-100'
    }
  };

  const formatBookingTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const currentStatus = statusConfig[data.status] || statusConfig.pending;

  useEffect(()=>{
    console.log("data", data)
  },[])
  return (
    <a
      className="w-full"
      href={data.deposite_price > 0
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/booking?paymentId=${data.deposits[0]?.payment_id}`
        : undefined}
      target="_blank"
    >
      <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 overflow-hidden">        
        <div className="p-5">
          <div className="flex items-center justify-between gap-4">
            {/* Right side - Trip info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Trip thumbnail with overlay */}
              <div className="relative flex-shrink-0">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-300">
                  <Image
                    src={data.trips?.images[0] || '/profile-fallback.jpg'}
                    alt={data.trips?.name || 'Trip thumbnail'}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    sizes="56px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              {/* Trip details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 truncate">
                  {data.trips?.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{data.persons}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{data.day}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm mt-1">
                  <span className="font-semibold text-gray-900">المبلغ الكلي: {formatAmount(data.total_price)}</span>
                  {data.deposite_price && (
                    <>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <span className="text-blue-600 font-medium">المدفوع: {formatAmount(data.deposite_price)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2 ${currentStatus.color} ${currentStatus.ring} ring-1`}>
              <div className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}></div>
              <span>{currentStatus.label}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-50"></div>

          {/* Bottom section - Client info */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                {data.client_name?.charAt(0)?.toUpperCase() || 'ع'}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span>{data.client_name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{data.client_phone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatBookingTime(data.created_at)}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default BookingRecord;