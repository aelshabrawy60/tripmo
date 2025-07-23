"use client"
import React, { useEffect, useState } from 'react'
import ClientAuthFlow from '../auth/ClientAuthFlow';

function CancelBookClient({ bookId, bookData, locale = "ar" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefundable, setIsRefundable] = useState(null);
  const [refundData, setRefundData] = useState(null); // Store refund details
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingRefund, setIsCheckingRefund] = useState(false);
  const [canCancel, setCanCancel] = useState(false)
  const [error, setError] = useState(null);
  const [showAuthFlow, setShowAuthFlow] = useState(false);
  const [retryAfterAuth, setRetryAfterAuth] = useState(false);

  const t = {
    cancelBooking: locale === "ar" ? "إلغاء الحجز" : "Cancel Booking",
    checking: locale === "ar" ? "جاري التحقق..." : "Checking...",
    loginRequired: locale === "ar" ? "تسجيل الدخول مطلوب" : "Login Required",
    loginMessage: locale === "ar" ? "يجب تسجيل الدخول أولاً لإلغاء الحجز" : "You must log in first to cancel the booking",
    confirmCancel: locale === "ar" ? "تأكيد إلغاء الحجز" : "Confirm Booking Cancellation",
    refundable: locale === "ar" ? "قابل للاسترداد" : "Refundable",
    nonRefundable: locale === "ar" ? "غير قابل للاسترداد" : "Non-refundable",
    refundMsg: locale === "ar" ? "سيتم استرداد المبلغ إلى حسابك" : "The amount will be refunded to your account",
    noRefundMsg: locale === "ar" ? "لن يتم استرداد أي مبلغ عند إلغاء هذا الحجز" : "No refund will be issued when canceling this booking",
    refundDetails: locale === "ar" ? "تفاصيل الاسترداد:" : "Refund Details:",
    cancelFees: locale === "ar" ? "رسوم الإلغاء:" : "Cancellation Fees:",
    refundAmount: locale === "ar" ? "المبلغ المسترد:" : "Refund Amount:",
    netRefund: locale === "ar" ? "صافي المبلغ المسترد:" : "Net Refundable Amount:",
    confirmQuestion: locale === "ar" ? "هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟" : "Are you sure you want to cancel this booking?",
    cancel: locale === "ar" ? "إلغاء" : "Cancel",
    confirm: locale === "ar" ? "تأكيد الإلغاء" : "Confirm Cancellation",
    canceling: locale === "ar" ? "جاري الإلغاء..." : "Cancelling...",
    authFailed: locale === "ar" ? "فشل في المصادقة. يرجى المحاولة مرة أخرى." : "Authentication failed. Please try again.",
    refundError: locale === "ar" ? "حدث خطأ في التحقق من إمكانية الاسترداد. يرجى المحاولة مرة أخرى." : "An error occurred while checking refund eligibility. Please try again.",
  }

  async function fetchBookRefundability(bookId) {
    if (!bookId) return false;

    try {
      const response = await fetch(`/api/client/bookings/refund?bookId=${bookId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check refundability');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async function cancelBooking(bookId) {
    if (!bookId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/client/bookings?bookingId=${bookId}`, {
        method: 'DELETE',
      });

      if (response.status === 401 || response.status === 403) {
        setIsLoading(false);
        setRetryAfterAuth(true);
        setShowAuthFlow(true);
        setIsModalOpen(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel booking');
      }

      await response.json();
      window.location.reload();

    } catch (error) {
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
      setRefundData(refundResult);
      setIsModalOpen(true);
    } catch (error) {
      setError(error.message);
      alert(t.refundError);
    } finally {
      setIsCheckingRefund(false);
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthFlow(false);
    if (retryAfterAuth) {
      setRetryAfterAuth(false);
      cancelBooking(bookId);
    }
  };

  const handleAuthFail = () => {
    setShowAuthFlow(false);
    setRetryAfterAuth(false);
    setError(t.authFailed);
  };

  useEffect(() => {
    setCanCancel(showCancelButton(bookData))
  }, [])

  function closeModal() {
    setIsModalOpen(false);
    setIsRefundable(null);
    setRefundData(null);
    setError(null);
  }

  function closeAuthFlow() {
    setShowAuthFlow(false);
    setRetryAfterAuth(false);
  }

  if (!canCancel) return null;

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
              {t.checking}
            </div>
          ) : (
            t.cancelBooking
          )}
        </button>
      </div>

      {showAuthFlow && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.loginRequired}
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
                  {t.loginMessage}
                </p>
              </div>

              <ClientAuthFlow
                onSuccess={handleAuthSuccess}
                onFail={handleAuthFail}
                primary_color="#EF4444"
              />
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.confirmCancel}
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
                        {isRefundable ? t.refundable : t.nonRefundable}
                      </p>
                      <p className={`text-sm ${isRefundable ? 'text-green-600' : 'text-red-600'}`}>
                        {isRefundable ? t.refundMsg : t.noRefundMsg}
                      </p>
                    </div>
                  </div>
                </div>

                {isRefundable && refundData && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">{t.refundDetails}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t.cancelFees}</span>
                        <span className="text-sm font-medium text-red-600">
                          {refundData.cancelationFees?.toFixed(0) || '0.00'} EGP
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{t.refundAmount}</span>
                        <span className="text-sm font-medium text-green-600">
                          {refundData.refundableAmount?.toFixed(0) || '0.00'} EGP
                        </span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{t.netRefund}</span>
                          <span className="text-base font-bold text-green-600">
                            {refundData.refundableAmount?.toFixed(0) || '0.00'} EGP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-gray-600 text-center">
                  {t.confirmQuestion}
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
                  {t.cancel}
                </button>
                <button
                  onClick={() => cancelBooking(bookId)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.canceling}
                    </div>
                  ) : (
                    t.confirm
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
  const tripDate = new Date(day);
  const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const tripDateOnly = new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate());
  return currentDateOnly < tripDateOnly;
}
