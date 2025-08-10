"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, MapPin, Clock, AlertCircle, CheckCircle, XCircle, Link2 } from 'lucide-react';
import Link from 'next/link';

// مكون كارت الحجز الواحد
const AffiliateBookingCard = ({ booking }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'canceled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'canceled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'canceled':
        return 'ملغي';
      default:
        return 'غير معروف';
    }
  };

  const trip = booking.trips;
  const bookingInfo = booking.bookings;
  const tripImage = trip?.images?.[0] || '/api/placeholder/300/200';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" dir="rtl">
      {/* صورة الرحلة */}
      <div className="relative h-40 bg-gray-200">
        <img
          src={tripImage}
          alt={trip?.name || 'رحلة'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bookingInfo?.status)}`}>
            {getStatusIcon(bookingInfo?.status)}
            {getStatusText(bookingInfo?.status)}
          </span>
        </div>
      </div>

      {/* محتوى الكارت */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 text-right">
              {trip?.name || 'اسم الرحلة غير متوفر'}
            </h3>
            <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
              <span className="mr-1">{formatDate(booking.created_at)}</span>
            </div>
          </div>
        </div>

        {/* التفاصيل المالية */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            
            <span className="text-gray-600 text-sm">إجمالي قيمة الحجز</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(bookingInfo?.total_price || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">مبلغ العربون</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(booking.amount || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-green-600 font-medium text-sm flex items-center">
              <span className="ml-1">العمولة</span>
            </span>
            <span className={`font-bold ${booking.status == "refunded" ? 'text-red-600' : 'text-green-600'} `}>
              {booking.status == "refunded" ? "مستردة" : formatCurrency(booking.affiliate_amount || 0)}
            </span>
            
          </div>
        </div>

        {/* رقم الحجز */}
        <div className="text-xs text-gray-400 text-right">
          رقم الحجز: {booking.id}
        </div>
      </div>
    </div>
  );
};

// المكون الرئيسي لقائمة الحجوزات
const AffiliateBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/affiliate/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`فشل في جلب الحجوزات: ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('خطأ في جلب الحجوزات:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6" dir="rtl">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6" dir="rtl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">خطأ في تحميل الحجوزات</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6" dir="rtl">

      {/* شبكة الحجوزات */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 flex flex-col gap-4 items-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">لا توجد حجوزات بعد</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            ابدأ بمشاركة رابط الإحالة الخاص بك لكسب عمولات من الحجوزات. 
            ستظهر هنا الحجوزات المؤكدة للعملاء الذين أحلتهم.
          </p>
          <Link href={'/links'} className='p-3 bg-tripmo-500 text-white rounded-lg mt-4 w-40 flex items-center justify-center gap-2'>
            <Link2/>
            الروابط
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <AffiliateBookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export { AffiliateBookingCard, AffiliateBookings };