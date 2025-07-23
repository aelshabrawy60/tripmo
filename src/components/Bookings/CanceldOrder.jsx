import React from 'react';
import { X, Calendar, Users, MapPin, AlertCircle, Clock, CheckCircle, Ban } from 'lucide-react';
import { supabaseAdmin } from '@/utils/supabase/service';

async function fetchRefund(booId) {
  const { data, error } = await supabaseAdmin
    .from("refunds")
    .select('*')
    .eq("book_id", booId)
    .single();

  if (error) {
    return null;
  }
  return data;
}

async function CancelledOrder({ bookingData, TripData, locale = "ar" }) {
  const refundData = await fetchRefund(bookingData?.id);

  const isArabic = locale === 'ar';

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(isArabic ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRefundStatusDisplay = () => {
    if (!refundData) {
      return {
        icon: <Ban className="h-5 w-5 text-red-500" />,
        text: isArabic ? "غير قابل للاسترداد" : "Non-refundable",
        color: "text-red-700",
        bgColor: "bg-red-50",
        message: isArabic ? "هذا الحجز غير مؤهل للاسترداد" : "This booking is not eligible for a refund"
      };
    }

    const statusMap = {
      SUCCESS: {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        text: isArabic ? "تم الاسترداد" : "Refunded",
        message: isArabic ? "تم استرداد المبلغ بنجاح" : "The amount has been refunded successfully",
        color: "text-green-700",
        bgColor: "bg-green-50"
      },
      PENDING: {
        icon: <Clock className="h-5 w-5 text-orange-500" />,
        text: isArabic ? "قيد المعالجة" : "Pending",
        message: isArabic ? "جاري معالجة طلب الاسترداد" : "Refund request is being processed",
        color: "text-orange-700",
        bgColor: "bg-orange-50"
      },
      FAILURE: {
        icon: <X className="h-5 w-5 text-red-500" />,
        text: isArabic ? "مرفوض" : "Rejected",
        message: isArabic ? "تم رفض طلب الاسترداد" : "Refund request was rejected",
        color: "text-red-700",
        bgColor: "bg-red-50"
      },
      default: {
        icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
        text: isArabic ? "غير محدد" : "Undefined",
        message: isArabic ? "حالة الاسترداد غير واضحة" : "Refund status is unclear",
        color: "text-gray-700",
        bgColor: "bg-gray-50"
      }
    };

    return statusMap[refundData.status] || statusMap.default;
  };

  const refundStatus = getRefundStatusDisplay();

  const labels = {
    canceled: isArabic ? "تم إلغاء الحجز" : "Booking Cancelled",
    canceledNote: isArabic ? "تم إلغاء حجزك" : "Your booking has been cancelled",
    nonRefundableNote: isArabic ? "تم إلغاء حجزك - غير قابل للاسترداد" : "Booking cancelled - non-refundable",
    tripName: TripData?.name || (isArabic ? 'اسم الرحلة' : 'Trip Name'),
    dateBooked: isArabic ? "التاريخ المحجوز" : "Booking Date",
    persons: isArabic ? "عدد الأشخاص" : "Number of Persons",
    personUnit: isArabic ? "أشخاص" : "People",
    clientInfo: isArabic ? "بيانات العميل" : "Client Details",
    name: isArabic ? "الاسم" : "Name",
    phone: isArabic ? "رقم الهاتف" : "Phone Number",
    refundStatus: isArabic ? "حالة الاسترداد" : "Refund Status",
    refundLabel: isArabic ? "المبلغ المسترد" : "Refund Amount",
    cancelFees: isArabic ? "رسوم الإلغاء" : "Cancellation Fee",
    paidAmount: isArabic ? "المبلغ المدفوع (العربون)" : "Paid Amount (Deposit)",
    refundOnDate: isArabic ? "تم استرداد المبلغ في" : "Refund issued on",
    refundProcessing: isArabic ? "جاري معالجة طلب الاسترداد منذ" : "Refund processing since",
    refundRejected: isArabic ? "تم رفض طلب الاسترداد - يرجى التواصل مع الدعم" : "Refund request rejected - please contact support",
    notEligible: isArabic ? "هذا الحجز غير مؤهل للاسترداد" : "This booking is not eligible for a refund",
    supportNote: isArabic ? "في حالة وجود أي استفسار، يرجى التواصل مع فريق الدعم" : "For any inquiries, please contact the support team",
    bookingId: isArabic ? "رقم الحجز" : "Booking ID"
  };

  return (
    <div className=''>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl">
        {/* Cancellation header */}
        <div className="bg-red-500 p-6 text-white">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold">{labels.canceled}</h1>
            <div className="bg-white rounded-full p-1 mr-2">
              <X className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="text-center text-white/90">
            {refundData ? labels.canceledNote : labels.nonRefundableNote}
          </p>
        </div>

        {/* Trip details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4 gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-800">{labels.tripName}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">{labels.dateBooked}</p>
                <p className="text-gray-600">{formatDate(bookingData?.day || new Date().toISOString())}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">{labels.persons}</p>
                <p className="text-gray-600">{bookingData?.persons || 0} {labels.personUnit}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer details */}
        <div className="p-6 border-gray-200 border-b">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.clientInfo}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500">{labels.name}</p>
              <p className="font-medium text-gray-800">{bookingData?.client_name || (isArabic ? 'غير محدد' : 'N/A')}</p>
            </div>
            <div>
              <p className="text-gray-500">{labels.phone}</p>
              <p className="font-medium text-gray-800 ltr:text-left rtl:text-right" dir="ltr">
                {bookingData?.client_phone || (isArabic ? 'غير محدد' : 'N/A')}
              </p>
            </div>
          </div>
        </div>

        {/* Refund status */}
        <div className={`p-6 border-gray-200 ${refundStatus.bgColor}`}>
          <div className="flex items-center mb-4 gap-2">
            {refundStatus.icon}
            <h3 className="text-lg font-bold text-gray-800">{labels.refundStatus}</h3>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Status:</span>
              <span className={`font-bold ${refundStatus.color}`}>{refundStatus.text}</span>
            </div>
            <p className={`text-sm ${refundStatus.color}`}>{refundStatus.message}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{labels.paidAmount}</span>
              <span className="font-medium">{bookingData?.deposite_price?.toFixed(0) || '0.00'} EGP</span>
            </div>

            {refundData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">{labels.cancelFees}</span>
                  <span className="font-medium text-red-600">{refundData.amount == null ? 0.00 : (bookingData?.deposite_price - refundData?.amount).toFixed(0)} EGP</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 font-bold">
                  <span>{labels.refundLabel}</span>
                  <span className={refundData.status === 'completed' ? 'text-green-700' : 'text-orange-700'}>
                    {refundData.amount == null ? bookingData?.deposite_price?.toFixed(0) + ' EGP' : refundData.amount?.toFixed(0) + ' EGP'}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-red-700">
                <span>{labels.refundLabel}</span>
                <span>0.00 EGP</span>
              </div>
            )}

            {refundData?.status === 'completed' && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  ✅ {labels.refundOnDate} {formatDate(refundData.created_at)}
                </p>
              </div>
            )}

            {refundData?.status === 'pending' && (
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <p className="text-orange-800 text-sm font-medium">
                  ⏳ {labels.refundProcessing} {formatDate(refundData.created_at)}
                </p>
              </div>
            )}

            {refundData?.status === 'rejected' && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{labels.refundRejected}</p>
              </div>
            )}

            {!refundData && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{labels.notEligible}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 text-center space-y-3">
          <p className="text-gray-500 text-sm mt-4">{labels.supportNote}</p>
        </div>

        {/* Booking reference */}
        <div className="px-6 pb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm text-center">
              {labels.bookingId}: <span className="font-mono font-bold">#{bookingData?.id || (isArabic ? 'غير محدد' : 'N/A')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelledOrder;
