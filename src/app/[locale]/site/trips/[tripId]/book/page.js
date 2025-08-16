"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import ClientAuthFlow from '@/components/auth/ClientAuthFlow';
import BookSummaryCard from '@/components/website/BookSummaryCard';
import LoadingCirc from '@/components/Loading/LoadingCirc';
import Loading from '@/components/Loading';
import TermsAcceptance from '@/components/website/TermsAcceptance';
import PaymentWays from '@/components/website/PaymentWays';

function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { tripId } = params;
  const locale = params.locale;

  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const numberOfSeats = searchParams.get('seats') || '1';
  const numberOfChildren = searchParams.get('children') || '0';
  const numberOfInfants = searchParams.get('infants') || '0';
  const time = searchParams.get('time') || null;

  const [pricing, setPricing] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [seats, setSeats] = useState({
    adults: parseInt(numberOfSeats),
    children: parseInt(numberOfChildren),
    infants: parseInt(numberOfInfants),
  });
  const [day, setDay] = useState(date);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [showAuthFlow, setShowAuthFlow] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  const t = {
    success: {
      ar: "تم الحجز بنجاح",
      en: "Booking successful",
    },
    processing: {
      ar: "جاري المعالجة...",
      en: "Processing...",
    },
    pay: {
      ar: "دفع",
      en: "Pay",
    },
    errorFallback: {
      ar: "فشل في إضافة الحجز. يرجى المحاولة مرة أخرى.",
      en: "Booking failed. Please try again.",
    },
    errorDate: {
      ar: "غير متوفر في هذا التاريخ",
      en: "Unavailable for this date",
    },
    errorGeneric: {
      ar: "غير متاح",
      en: "Unavailable",
    },
    clientSaved: {
      ar: "معلومات العميل محفوظة",
      en: "Client information saved",
    },
    termsLink: "/terms",
  };

  useEffect(() => {
    checkPricing();
  }, [seats, day]);

  const handlePersonsChange = (newCounts) => {
    setSeats(newCounts);
    
    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update the parameters
    params.set('seats', newCounts.adults.toString());
    params.set('children', newCounts.children.toString());
    params.set('infants', newCounts.infants.toString());
    
    // Update the URL without page reload
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDateChange = (newDate) => {
    setDay(newDate);
    
    // Create new URLSearchParams with current params
    const params = new URLSearchParams(searchParams.toString());
    
    // Update the parameters
    params.set('date', newDate);
    
    // Update the URL without page reload
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  async function checkPricing() {
    if (!date || !seats.adults) return;

    setIsLoading(true);
    setError(null);

    try {
      const formattedDate = day;

      const response = await fetch(
        `/api/client/bookings?tripId=${tripId}&date=${formattedDate}&numberOfSeats=${seats.adults}&getTrip=true&time=${time}&numberOfChildren=${seats.children}&numberOfInfants=${seats.infants}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPricing(data.pricing);
        setTripData(data.tripData);
        console.log("pricing", data)
      } else {
        setPricing(null);
        setTripData(null);
        setError(data.message || t.errorDate[locale] || t.errorDate.ar);
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setError(t.errorGeneric[locale] || t.errorGeneric.ar);
    } finally {
      setIsLoading(false);
    }
  }

  const addBooking = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        setRedirecting(true);
        window.location.href = data.redirectUrl;
        return;
      }

      if (response.ok) {
        setSuccess(t.success[locale] || t.success.ar);
      } else {
        setRedirecting(false);
        throw new Error(data.message || `خطأ في الحجز: ${response.status}`);
      }
    } catch (err) {
      setRedirecting(false);
      console.error("Error adding booking:", err);
      setError(err.message || t.errorFallback[locale] || t.errorFallback.ar);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = async (data) => {
    const { clientPhone, clientName, clientId } = data;

    setClientData({
      clientPhone,
      clientName,
      clientId
    });

    setShowAuthFlow(false);
    setShowPaymentButton(true);
  };

  const handlePaymentClick = async () => {
    if (!clientData) return;

    setRedirecting(true);

    const offset = -new Date().getTimezoneOffset() / 60;

    const formData = {
      name: clientData.clientName,
      phone: clientData.clientPhone,
      numberOfSeats: seats.adults,
      numberOfChildren: seats.children,
      numberOfInfants: seats.infants,
      date: day || new Date().toISOString().split('T')[0],
      time: time || null,
      tripId: tripId,
      offset: offset,
      client_id: clientData.clientId,
      lang: locale
    };

    try {
      await addBooking(formData);
    } catch (err) {
      console.error("Error during booking:", err);
      setRedirecting(false);
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  if (isLoading) {
    return <Loading />
  }

  if (redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingCirc />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-4xl">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className={`grid gap-6 ${showAuthFlow ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-1'}`}>
          <div className={`flex flex-col gap-4 ${showAuthFlow ? 'max-w-sm' : ''}`} >
            <BookSummaryCard
              day={day}
              seats={{
                adults: seats.adults,
                children: seats.children,
                infants: seats.infants
              }}
              tripData={tripData}
              pricing={pricing}
              locale={locale}
              time={time}
              handlePersonsChange={handlePersonsChange}
              handleDateChange={handleDateChange}
            />

            {showPaymentButton && (
              <>
                <button
                  onClick={handlePaymentClick}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {isSubmitting ? t.processing[locale] : t.pay[locale]}
                </button>
                <TermsAcceptance link={t.termsLink} locale={locale}/>
              </>
            )}

            <div className='mt-4'>
              <PaymentWays type={1} />
            </div>
          </div>

          {showAuthFlow && (
            <div className="flex flex-col">
              <ClientAuthFlow onSuccess={handleAuthSuccess} locale={locale} />
            </div>
          )}

          {!showAuthFlow && !showPaymentButton && (
            <div className="flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <p>{t.clientSaved[locale]}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;