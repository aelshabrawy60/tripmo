"use client"
import React, { useEffect, useState } from 'react'
import ClientAuthFlow from '../auth/ClientAuthFlow';

function CancelBookClient({bookId, bookData}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefundable, setIsRefundable] = useState(null);
  const [refundData, setRefundData] = useState(null); // Store refund details
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingRefund, setIsCheckingRefund] = useState(false);
  const [canCancel, setCanCancel] = useState(false)
  const [error, setError] = useState(null);
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [retryAfterAuth, setRetryAfterAuth] = useState(false);

  async function fetchBookRefundability(bookId) {
    if (!bookId) {
      console.error("Booking ID is required for refundability check.");
      return false;
    }

    try {
      const response = await fetch(`/api/client/bookings/refund?bookId=${bookId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error checking refundability:", errorData.message);
        throw new Error(errorData.message || 'Failed to check refundability');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Unexpected error occurred while checking refundability:", error);
      throw error;
    }
  }

  async function cancelBooking(bookId) {
    if (!bookId) {
      console.error("Booking ID is required for cancellation.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/client/bookings?bookingId=${bookId}`, {
        method: 'DELETE',
      });

      // Check for authentication errors
      if (response.status === 401 || response.status === 403) {
        setIsLoading(false);
        setRetryAfterAuth(true);
        setShowAuthFlow(true);
        setIsModalOpen(false); // Close confirmation modal when showing auth flow
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error canceling booking:", errorData.message);
        throw new Error(errorData.message || 'Failed to cancel booking');
      }

      const result = await response.json();
      console.log("Booking canceled successfully:", result);
      
      window.location.reload()
      
    } catch (error) {
      console.error("Unexpected error occurred while canceling booking:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelClick() {
    setIsCheckingRefund(true);
    setError(null);
    
    try {
      const refundResult = await fetchBookRefundability(bookId);
      setIsRefundable(refundResult.status);
      setRefundData(refundResult); // Store the complete refund data
      setIsModalOpen(true);
    } catch (error) {
      setError(error.message);
      alert('حدث خطأ في التحقق من إمكانية الاسترداد. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsCheckingRefund(false);
    }
  }

  const handleAuthSuccess = (clientData) => {
    console.log('Authentication successful:', clientData);
    setShowAuthFlow(false);
    
    // If we were retrying after auth, call the cancel API again
    if (retryAfterAuth) {
      setRetryAfterAuth(false);
      cancelBooking(bookId);
    }
  };

  const handleAuthFail = (error) => {
    console.error('Authentication failed:', error);
    setShowAuthFlow(false);
    setRetryAfterAuth(false);
    setError('فشل في المصادقة. يرجى المحاولة مرة أخرى.');
  };

  useEffect(()=>{
    setCanCancel(showCancelButton(bookData))
  }, [])

  function closeModal() {
    setIsModalOpen(false);
    setIsRefundable(null);
    setRefundData(null); // Clear refund data
    setError(null);
  }

  function closeAuthFlow() {
    setShowAuthFlow(false);
    setRetryAfterAuth(false);
  }

  if(!canCancel){
    return null
  }

  return (
    <div>
      <div className='p-4'>
        <button
          onClick={handleCancelClick}
          disabled={isCheckingRefund}
          className="bg-red-500 w-full text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
        >
          {isCheckingRefund ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري التحقق...
            </div>
          ) : (
            'إلغاء الحجز'
          )}
        </button>
      </div>

      {/* Authentication Flow Modal */}
      {showAuthFlow && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  تسجيل الدخول مطلوب
                </h3>
                <button
                  onClick={closeAuthFlow}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 text-center text-sm">
                  يجب تسجيل الدخول أولاً لإلغاء الحجز
                </p>
              </div>

              <ClientAuthFlow
                onSuccess={handleAuthSuccess}
                onFail={handleAuthFail}
                primary_color="#EF4444" // Red color to match the cancel theme
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  تأكيد إلغاء الحجز
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className={`p-4 rounded-lg mb-4 ${isRefundable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-3">
                    {isRefundable ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className={`font-medium ${isRefundable ? 'text-green-800' : 'text-red-800'}`}>
                        {isRefundable ? 'قابل للاسترداد' : 'غير قابل للاسترداد'}
                      </p>
                      <p className={`text-sm ${isRefundable ? 'text-green-600' : 'text-red-600'}`}>
                        {isRefundable 
                          ? 'سيتم استرداد المبلغ إلى حسابك'
                          : 'لن يتم استرداد أي مبلغ عند إلغاء هذا الحجز'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Refund Details Section */}
                {isRefundable && refundData && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">تفاصيل الاسترداد:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">رسوم الإلغاء:</span>
                        <span className="text-sm font-medium text-red-600">
                          {refundData.cancelationFees?.toFixed(2) || '0.00'} ج.م
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">المبلغ المسترد:</span>
                        <span className="text-sm font-medium text-green-600">
                          {refundData.refundableAmount?.toFixed(2) || '0.00'} ج.م
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">صافي المبلغ المسترد:</span>
                          <span className="text-base font-bold text-green-600">
                            {refundData.refundableAmount?.toFixed(2) || '0.00'} ج.م
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-gray-600 text-center">
                  هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => cancelBooking(bookId)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإلغاء...
                    </div>
                  ) : (
                    'تأكيد الإلغاء'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CancelBookClient

function showCancelButton(bookData) {
  const day = bookData.day;
  const currentDate = new Date();
  
  // Parse the trip date (format: "2025-05-03")
  const tripDate = new Date(day);
  
  // Set both dates to start of day to compare only dates, not times
  const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const tripDateOnly = new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate());
  
  // Return false if current date is >= trip date, true otherwise
  return currentDateOnly < tripDateOnly;
}