import React from 'react';
import { X, Calendar, Users, MapPin, AlertCircle, RefreshCw, Clock, CheckCircle, Ban } from 'lucide-react';
import { supabaseAdmin } from '@/utils/supabase/service';

async function fetchRefund(booId){
    const {data, error} = await supabaseAdmin
        .from("refunds")
        .select('*')
        .eq("book_id", booId)
        .single()

    if(error){
        return null
    }
    return data
}

async function CancelledOrder({ bookingData, TripData }) {
  // Fetch refund data on server
  const refundData = await fetchRefund(bookingData?.id);

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get refund status display
  const getRefundStatusDisplay = () => {
    if (!refundData) {
      return {
        icon: <Ban className="h-5 w-5 text-red-500" />,
        text: "غير قابل للاسترداد",
        color: "text-red-700",
        bgColor: "bg-red-50",
        message: "هذا الحجز غير مؤهل للاسترداد"
      };
    }

    switch(refundData.status) {
      case 'SUCCESS':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: "تم الاسترداد",
          color: "text-green-700",
          bgColor: "bg-green-50",
          message: "تم استرداد المبلغ بنجاح"
        };
      case 'PENDING':
        return {
          icon: <Clock className="h-5 w-5 text-orange-500" />,
          text: "قيد المعالجة",
          color: "text-orange-700",
          bgColor: "bg-orange-50",
          message: "جاري معالجة طلب الاسترداد"
        };
      case 'FAILURE':
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          text: "مرفوض",
          color: "text-red-700",
          bgColor: "bg-red-50",
          message: "تم رفض طلب الاسترداد"
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
          text: "غير محدد",
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          message: "حالة الاسترداد غير واضحة"
        };
    }
  };

  const refundStatus = getRefundStatusDisplay();

  return (
    <div className=''>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl">
        {/* Cancellation header */}
        <div className="bg-red-500 p-6 text-white">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold">تم إلغاء الحجز</h1>
            <div className="bg-white rounded-full p-1 mr-2">
              <X className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <p className="text-center text-white/90">
            {refundData ? "تم إلغاء حجزك" : "تم إلغاء حجزك - غير قابل للاسترداد"}
          </p>
        </div>

        {/* Trip details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 ml-2 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-800">{TripData?.name || 'اسم الرحلة'}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 ml-3 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">التاريخ المحجوز</p>
                <p className="text-gray-600">{formatDate(bookingData?.day || new Date().toISOString())}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-5 w-5 ml-3 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">عدد الأشخاص</p>
                <p className="text-gray-600">{bookingData?.persons || 0} أشخاص</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer details */}
        <div className="p-6 border-gray-200 border-b">
          <h3 className="text-lg font-bold text-gray-800 mb-4">بيانات العميل</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500">الاسم</p>
              <p className="font-medium text-gray-800">{bookingData?.client_name || 'غير محدد'}</p>
            </div>
            <div>
              <p className="text-gray-500">رقم الهاتف</p>
              <p className="font-medium text-gray-800 ltr:text-left rtl:text-right" dir="ltr">
                {bookingData?.client_phone || 'غير محدد'}
              </p>
            </div>
          </div>
        </div>

        {/* Refund status */}
        <div className={`p-6 border-gray-200 ${refundStatus.bgColor}`}>
          <div className="flex items-center mb-4">
            {refundStatus.icon}
            <h3 className="text-lg font-bold text-gray-800 mr-2">حالة الاسترداد</h3>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">حالة الطلب:</span>
              <span className={`font-bold ${refundStatus.color}`}>{refundStatus.text}</span>
            </div>
            <p className={`text-sm ${refundStatus.color}`}>{refundStatus.message}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">المبلغ المدفوع (العربون)</span>
              <span className="font-medium">{bookingData?.deposite_price?.toFixed(2) || '0.00'} ج.م</span>
            </div>
            
            {refundData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">رسوم الإلغاء</span>
                  <span className="font-medium text-red-600">0.00 ج.م</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 font-bold">
                  <span>المبلغ المسترد</span>
                  <span className={refundData.status === 'completed' ? 'text-green-700' : 'text-orange-700'}>
                    {refundData.amount == null ? bookingData?.deposite_price?.toFixed(2) + 'ج.م': refundData.amount?.toFixed(2)+ 'ج.م'}
                    
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-red-700">
                <span>المبلغ المسترد</span>
                <span>0.00 ج.م</span>
              </div>
            )}
            
            {refundData && refundData.status === 'completed' && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  ✅ تم استرداد المبلغ في {formatDate(refundData.created_at)}
                </p>
              </div>
            )}
            
            {refundData && refundData.status === 'pending' && (
              <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                <p className="text-orange-800 text-sm font-medium">
                  ⏳ جاري معالجة طلب الاسترداد منذ {formatDate(refundData.created_at)}
                </p>
              </div>
            )}
            
            {refundData && refundData.status === 'rejected' && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <p className="text-red-800 text-sm font-medium">
                  ❌ تم رفض طلب الاسترداد - يرجى التواصل مع الدعم
                </p>
              </div>
            )}
            
            {!refundData && (
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <p className="text-red-800 text-sm font-medium">
                  🚫 هذا الحجز غير مؤهل للاسترداد وفقاً لسياسة الشركة
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-6 text-center space-y-3">
          <p className="text-gray-500 text-sm mt-4">
            في حالة وجود أي استفسار، يرجى التواصل مع فريق الدعم
          </p>
        </div>

        {/* Booking reference */}
        <div className="px-6 pb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm text-center">
              رقم الحجز: <span className="font-mono font-bold">#{bookingData?.id || 'غير محدد'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelledOrder;