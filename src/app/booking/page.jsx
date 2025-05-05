import React from 'react';
import { PaymentRedirectFlow } from '../../utils/payments/payments';
import { confirmDeposit } from '@/utils/payments/helpers';
import { fetchPaymentsOptions } from "@/utils/group/group";
import { supabaseAdmin } from '@/utils/supabase/service';
import { Check, Calendar, Users, Phone, CreditCard, Info, MapPin } from 'lucide-react';

// Fetch booking data from Supabase
async function fetchBookingData(id) {
  const { data, error } = await supabaseAdmin.from("bookings").select("*").eq("id", id).single();
  return data;
}

// Fetch trip data from Supabase
async function fetchTripData(id) {
  const { data, error } = await supabaseAdmin.from("trips").select("*").eq("id", id).single();
  return data;
}

// Custom ChevronLeft icon for RTL layout
const ChevronLeft = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

// Receipt component for confirmed bookings
const ConfirmationReceipt = ({ bookingData, tripData }) => {
  // Format date nicely
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <div className='p-4'>
      <div className="max-w-2xl mx-auto my-4 md:my-8 bg-white rounded-xl shadow-xl">
        {/* Success header */}
        <div className="bg-tripmo-500 p-6 text-white">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold">تم تأكيد الحجز!</h1>
            <div className="bg-white rounded-full p-1 mr-2">
              <Check className="h-6 w-6 text-tripmo-500" />
            </div>
          </div>
          <p className="text-center text-white/90">
            تمت عملية الدفع بنجاح وتم تأكيد حجزك
          </p>
        </div>

        {/* Trip details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 ml-2 text-tripmo-500" />
            <h2 className="text-xl font-bold text-gray-800">{tripData.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 ml-3 text-tripmo-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">التاريخ</p>
                <p className="text-gray-600">{formatDate(bookingData.day)}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-5 w-5 ml-3 text-tripmo-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">عدد الأشخاص</p>
                <p className="text-gray-600">{bookingData.persons} أشخاص</p>
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
              <p className="font-medium text-gray-800">{bookingData.client_name}</p>
            </div>
            <div>
              <p className="text-gray-500">رقم الهاتف</p>
              <p className="font-medium text-gray-800 ltr:text-left rtl:text-right" dir="ltr">
                {bookingData.client_phone}
              </p>
            </div>
          </div>
        </div>

        {/* Payment summary */}
        <div className="p-6 border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص الدفع</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">المبلغ المدفوع (العربون)</span>
              <span className="font-medium">{bookingData.deposite_price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المبلغ المتبقي</span>
              <span className="font-medium">{(bookingData.total_price - bookingData.deposite_price).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-gray-800">
              <span>السعر الإجمالي</span>
              <span>{bookingData.total_price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error component for when something goes wrong
const ErrorDisplay = ({ message }) => (
  <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-xl shadow-xl" dir="rtl">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 className="text-xl font-bold text-red-600 mb-2">خطأ في معالجة الدفع</h2>
      <p className="text-gray-600 mb-6">{message || "حدث خطأ أثناء معالجة عملية الدفع الخاصة بك."}</p>
      <button className="px-6 py-3 bg-tripmo-500 text-white rounded-lg hover:bg-tripmo-600 transition-colors shadow-md">
        العودة إلى الحجوزات
      </button>
    </div>
  </div>
);

// Main page component
export default async function Page({ searchParams }) {
  // Make sure searchParams exists and has the expected structure
  if (!searchParams || !searchParams.merchantOrderId) {
    return <ErrorDisplay message="المعلمات المطلوبة مفقودة" />;
  }

  try {
    // Parse the merchantOrderId if it's a string
    const merchantOrderId = typeof searchParams.merchantOrderId === 'string'
      ? JSON.parse(searchParams.merchantOrderId)
      : searchParams.merchantOrderId;

    // Fetch booking and trip data
    const bookingData = await fetchBookingData(merchantOrderId);
    const tripData = await fetchTripData(bookingData.bookable_id);
    
    const groupId = bookingData.group_id;
    
    const paymentConfig = await fetchPaymentsOptions(groupId);
    const paymentService = new PaymentRedirectFlow(paymentConfig);

    const verf = await paymentService.verifyPaymentReturn(paymentConfig.name, searchParams);

    // If successful, confirm the deposit
    if (verf.success) {
      await confirmDeposit(merchantOrderId);
      return <ConfirmationReceipt bookingData={bookingData} tripData={tripData} />;
    } else {
      // Payment verification failed
      return <ErrorDisplay message="فشل التحقق من الدفع. يرجى الاتصال بخدمة العملاء." />;
    }
  } catch (error) {
    console.error("Error in booking page:", error);
    return <ErrorDisplay message={error.message} />;
  }
}