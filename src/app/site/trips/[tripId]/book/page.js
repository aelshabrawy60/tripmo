"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import ClientAuthFlow from '@/components/auth/ClientAuthFlow';
import BookSummaryCard from '@/components/website/BookSummaryCard';
import LoadingCirc from '@/components/Loading/LoadingCirc';
import Loading from '@/components/Loading';

function BookingPage() {
  const params = useParams();
  const { tripId } = params;

  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const numberOfSeats = searchParams.get('seats') || '1';

  const [pricing, setPricing] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const [showAuthFlow, setShowAuthFlow] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);

  useEffect(() => {
    checkPricing();
  }, []);

  async function checkPricing() {
    if (!date || !numberOfSeats) return;

    setIsLoading(true);
    setError(null);

    try {
      const formattedDate = date;

      const response = await fetch(
        `/api/client/bookings?tripId=${tripId}&date=${formattedDate}&numberOfSeats=${numberOfSeats}&getTrip=true`
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
        setError(data.message || 'غير متوفر في هذا التاريخ');
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setError("غير متاح");
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
        window.location.href = data.redirectUrl
        return;
      }

      if (response.ok) {
        setSuccess('تم الحجز بنجاح');
      } else {
        setRedirecting(false);
        throw new Error(data.message || `خطأ في الحجز: ${response.status}`);
      }
    } catch (err) {
      setRedirecting(false);
      console.error("Error adding booking:", err);
      setError(err.message || 'فشل في إضافة الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = async (data) => {
    const { clientPhone, clientName, clientId } = data;
    
    // Store client data for later use
    setClientData({
      clientPhone,
      clientName,
      clientId
    });
    
    // Hide auth flow and show payment button
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
      numberOfSeats: numberOfSeats,
      date: date || new Date().toISOString().split('T')[0],
      tripId: tripId,
      offset: offset,
      client_id: clientData.clientId,
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

  if(isLoading){
    return <Loading/>
  }

  if (redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingCirc/>
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
          <div className={`flex flex-col gap-4 ${showAuthFlow? 'max-w-sm': ''}`} >
            <BookSummaryCard
              day={date}
              seats={numberOfSeats}
              tripData={tripData}
              pricing={pricing}
            />
            
            {showPaymentButton && (
              <button
                onClick={handlePaymentClick}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? 'جاري المعالجة...' : 'دفع'}
              </button>
            )}
          </div>

          {showAuthFlow && (
            <div className="flex flex-col">
              <ClientAuthFlow onSuccess={handleAuthSuccess} />
            </div>
          )}
          
          {!showAuthFlow && !showPaymentButton && (
            <div className="flex items-center justify-center">
              <div className="text-gray-500 text-center">
                <p>معلومات العميل محفوظة</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingPage;