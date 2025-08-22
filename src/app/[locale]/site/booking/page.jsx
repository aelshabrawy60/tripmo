import React from 'react';
import { PaymentRedirectFlow } from '../../../../utils/payments/payments';
import { confirmDeposit } from '@/utils/payments/helpers';
import { supabaseAdmin } from '@/utils/supabase/service';
import { Check, Calendar, Users, MapPin, Clock } from 'lucide-react';
import { paymentGateawayConfig , paypalGatewayConfig} from '../../../../utils/payments/payments';
import CancelBookClient from '@/components/Bookings/CancelBookClient';
import CanceldOrder from '@/components/Bookings/CanceldOrder';
import AddComment from '@/components/Templates/Main/AddComment';
import ProfileCard from '@/components/website/ProfileCard';
import QRCode from 'qrcode';
import { formatTime } from '@/components/website/helpers';


// Fetch booking data from Supabase
async function fetchBookingData(id) {
  const { data, error } = await supabaseAdmin.from("bookings").select("*, deposits(payment_id, type)").eq("id", id).single();
  return data;
}

async function fetchBookId(paymentId) {
  const { data, error } = await supabaseAdmin.from("deposits").select("book_id").eq("payment_id", paymentId).single();
  return data.book_id;
}

// Fetch trip data from Supabase
async function fetchTripData(id) {
  const { data, error } = await supabaseAdmin.from("trips").select("*").eq("id", id).single();
  return data;
}


async function isBookRated(bookId) {
  const {data, error} = await supabaseAdmin.from("ratings").select('*').eq("book_id", bookId)

  if(error){
    console.log(error)
    return true
  }

  if(data.length > 0){
    return true
  }

  return false
} 

const ConfirmationReceipt = ({ bookingData, tripData, isBookRated, qrDataUrl, locale = "ar" }) => {
  const t = translations;

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', options);
  };

  // Helper function to format persons breakdown
  const formatPersonsBreakdown = (personsTypes) => {
    if (!personsTypes) return '';
    
    const breakdown = [];
    if (personsTypes.adults && parseInt(personsTypes.adults) > 0) {
      breakdown.push(`${personsTypes.adults} ${locale === 'ar' ? 'بالغ' : 'Adult'}${parseInt(personsTypes.adults) > 1 ? (locale === 'ar' ? 'ين' : 's') : ''}`);
    }
    if (personsTypes.children && parseInt(personsTypes.children) > 0) {
      breakdown.push(`${personsTypes.children} ${locale === 'ar' ? 'طفل' : 'Child'}${parseInt(personsTypes.children) > 1 ? (locale === 'ar' ? '' : 'ren') : ''}`);
    }
    if (personsTypes.infants && parseInt(personsTypes.infants) > 0) {
      breakdown.push(`${personsTypes.infants} ${locale === 'ar' ? 'رضيع' : 'Infant'}${parseInt(personsTypes.infants) > 1 ? (locale === 'ar' ? '' : 's') : ''}`);
    }
    
    return breakdown.join(locale === 'ar' ? ' • ' : ' • ');
  };

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl">

        {/* Success header */}
        <div className="bg-tripmo-500 p-6 text-white">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h1 className="text-2xl font-bold">{t.successTitle[locale]}</h1>
            <div className="bg-white rounded-full p-1 mr-2">
              <Check className="h-6 w-6 text-tripmo-500" />
            </div>
          </div>
          <p className="text-center text-white/90">{t.successSubtitle[locale]}</p>
        </div>

        {/* Rating */}
        {!isBookRated && (
          <AddComment
            tripId={bookingData.bookable_id}
            senderName={bookingData.client_name}
            groupId={bookingData.group_id}
            bookId={bookingData.id}
            bookData={bookingData}
            locale={locale}
          />
        )}

        {/* Trip Details */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4 gap-2">
            <MapPin className="h-5 w-5 text-tripmo-500" />
            <h2 className="text-xl font-bold text-gray-800">{tripData.name}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-tripmo-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">{t.date[locale]}</p>
                <p className="text-gray-600">{formatDate(bookingData.day)}</p>
              </div>
            </div>


            {bookingData.start_time && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-tripmo-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">{t.time[locale]}</p>
                  <p className="text-gray-600">{formatTime(bookingData.start_time)}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-tripmo-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">{t.persons[locale]}</p>
                <p className="text-gray-600">{bookingData.persons} {t.personUnit[locale]}</p>
                {/* Persons breakdown */}
                {bookingData.persons_types && (
                  <p className="text-sm text-gray-500 mt-1">
                    ({formatPersonsBreakdown(bookingData.persons_types)})
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Service Provider */}
        <div className="p-6 border-gray-200 border-b">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{t.provider[locale]}</h3>
          <ProfileCard profileId={tripData.group_id} type={1} showPhone={true} />
        </div>

        {/* Customer Info */}
        <div className="p-6 border-gray-200 border-b">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t.clientInfo[locale]}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500">{t.name[locale]}</p>
              <p className="font-medium text-gray-800">{bookingData.client_name}</p>
            </div>
            <div>
              <p className="text-gray-500">{t.phone[locale]}</p>
              <p className="font-medium text-gray-800">{bookingData.client_phone}</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t.paymentSummary[locale]}</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.depositAmount[locale]}</span>
              <span className="font-medium">{bookingData.deposite_price.toFixed(0)} EGP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.remainingAmount[locale]}</span>
              <span className="font-medium">{(bookingData.total_price - bookingData.deposite_price).toFixed(0)} EGP</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-gray-800">
              <span>{t.totalAmount[locale]}</span>
              <span>{bookingData.total_price.toFixed(0)} EGP</span>
            </div>
          </div>
        </div>

        {/* Cancel Booking */}
        <CancelBookClient bookId={bookingData.id} bookData={bookingData} locale={locale}/>

        {/* Booking Reference */}
        <div className="px-6 py-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm text-center">
              {t.bookingRef[locale]}: <span className="font-mono font-bold">#{bookingData?.id || 'غير محدد'}</span>
            </p>
          </div>
        </div>

        {/* QR Code */}
        {qrDataUrl && (
          <div className="px-6 py-6 flex justify-center">
            <img src={qrDataUrl} alt="QR Code" width={300} />
          </div>
        )}

      </div>
    </div>
  );
};

// Main page component
export default async function Page({ searchParams, params }) {
  
  const locale = params.locale
  // Make sure searchParams exists and has the expected structure
  if (!searchParams || !searchParams.merchantOrderId) {

    if(searchParams.paymentId){
      // Fetch booking and trip data
      // Parse the merchantOrderId if it's a string
      const paymentId = searchParams.paymentId;

      const bookId = await fetchBookId(paymentId)
      const bookingData = await fetchBookingData(bookId);
      const tripData = await fetchTripData(bookingData.bookable_id);
      const isBookRated_ = await isBookRated(bookingData.id);    

      if(bookingData.status == "canceled"){
      return <CanceldOrder bookingData={bookingData} tripData={tripData} locale={locale}/>
      }

      const hostLink = `https://rehlanow.com/hostBooking?paymentId=${paymentId}`;
      const qrDataUrl = await QRCode.toDataURL(hostLink);

      return <ConfirmationReceipt bookingData={bookingData} tripData={tripData} isBookRated={isBookRated_} qrDataUrl={qrDataUrl} locale={locale}/>;
    }
    return <ErrorDisplay message="المعلمات المطلوبة مفقودة" />;
  }

  try {
    // Parse the merchantOrderId if it's a string
    const merchantOrderId = typeof searchParams.merchantOrderId === 'string'
      ? JSON.parse(searchParams.merchantOrderId)
      : searchParams.merchantOrderId;

    console.log("merchantId", merchantOrderId)
    // Fetch booking and trip data
    const bookingData = await fetchBookingData(merchantOrderId);
    const tripData = await fetchTripData(bookingData.bookable_id);
    const isBookRated_ = await isBookRated(bookingData.id);    

    const paymentId = bookingData.deposits[0]?.payment_id || ''
    const hostLink = `https://rehlanow.com/hostBooking?paymentId=${paymentId}`;
    const qrDataUrl = await QRCode.toDataURL(hostLink);

    if(bookingData.status == "canceled"){
      return <CanceldOrder bookingData={bookingData} tripData={tripData} locale={locale}/>
    }

    if(bookingData.status == "active"){
      return <ConfirmationReceipt bookingData={bookingData} tripData={tripData} isBookRated={isBookRated_}qrDataUrl={qrDataUrl} locale={locale}/>;

    }else{
      const paymentConfig = bookingData.deposits[0]?.type === "paypal" ? paypalGatewayConfig : paymentGateawayConfig; // Use the default payment gateway config

      const paymentService = new PaymentRedirectFlow(paymentConfig);
      const verf = await paymentService.verifyPaymentReturn(paymentConfig.name, searchParams);

      // If successful, confirm the deposit
      if (verf.success) {
        await confirmDeposit(merchantOrderId);
        return <ConfirmationReceipt bookingData={bookingData} tripData={tripData} isBookRated={isBookRated_} qrDataUrl={qrDataUrl} locale={locale}/>;
      } else {
        // Payment verification failed
        return <ErrorDisplay message="فشل التحقق من الدفع. يرجى الاتصال بخدمة العملاء." />;
      }
    }
    
  } catch (error) {
    console.error("Error in booking page:", error);
    return <ErrorDisplay message={error.message} />;
  }
}






const translations = {
  successTitle: {
    ar: "تم تأكيد الحجز!",
    en: "Booking Confirmed!",
  },
  successSubtitle: {
    ar: "تمت عملية الدفع بنجاح",
    en: "Your payment was successful",
  },
  date: {
    ar: "التاريخ",
    en: "Date",
  },
  time: {
    ar: "الوقت",
    en: "Time",
  },
  persons: {
    ar: "عدد الأشخاص",
    en: "Number of Persons",
  },
  personUnit: {
    ar: "أشخاص",
    en: "persons",
  },
  provider: {
    ar: "مقدم الخدمة",
    en: "Service Provider",
  },
  clientInfo: {
    ar: "بيانات العميل",
    en: "Customer Details",
  },
  name: {
    ar: "الاسم",
    en: "Name",
  },
  phone: {
    ar: "رقم الهاتف",
    en: "Phone Number",
  },
  paymentSummary: {
    ar: "ملخص الدفع",
    en: "Payment Summary",
  },
  depositAmount: {
    ar: "المبلغ المدفوع (العربون)",
    en: "Deposit Amount",
  },
  remainingAmount: {
    ar: "المبلغ المتبقي",
    en: "Remaining Amount",
  },
  totalAmount: {
    ar: "السعر الإجمالي",
    en: "Total Price",
  },
  bookingRef: {
    ar: "رقم الحجز",
    en: "Booking Reference",
  },
};

