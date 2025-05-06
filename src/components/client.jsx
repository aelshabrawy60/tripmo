'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Client component for interactive UI
export default function PaymentClient({ paymentData, paymentMethods, paymentId }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // Check if payment status is client_confirmed
  const isClientConfirmed = paymentData.status === 'client_confirmed';
  const isPaymentConfirmed = paymentData.status === "confirmed";

  
  // Use useEffect for navigation to avoid setState during render
  useEffect(() => {
    if (isPaymentConfirmed) {
      router.push(`/booking?paymentId=${paymentId}`);
    }
  }, [isPaymentConfirmed, paymentId, router]);

  

  // Early return to prevent rendering if already confirmed
  if (isPaymentConfirmed) {
    // Trigger redirect via useEffect (already in place)
    return null;
  }
  
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedMethod === null) {
      setError('الرجاء اختيار طريقة دفع أولاً');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const selectedPaymentMethod = paymentMethods[selectedMethod];
      await confirmClientPay(paymentId, selectedPaymentMethod.name);
      window.location.reload();
      setIsSuccess(true);
    } catch (err) {
      setError('حدث خطأ أثناء تأكيد الدفع، الرجاء المحاولة مرة أخرى');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If payment is already client confirmed, show the review status
  if (isClientConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 text-white">
            <h2 className="text-xl font-bold text-center">حالة الدفع</h2>
          </div>
          
          {/* Payment Review Status */}
          <div className="px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="text-blue-500 w-8 h-8" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">جاري مراجعة عملية الدفع من المسؤول</h3>
            <p className="text-gray-600 mb-6">تم استلام تأكيد الدفع الخاص بك وسيتم مراجعته قريباً</p>
            
            {/* Payment amount */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">المبلغ:</span>
                <span className="text-xl font-bold">{paymentData.amount} ج.م</span>
              </div>
            </div>
            
            {/* Copy URL Button */}
            <button
              onClick={copyPageUrl}
              className="flex items-center gap-2 justify-center w-full py-3 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  تم النسخ!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  نسخ رابط تتبع الدفع
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original payment flow if not client_confirmed
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 text-white">
          <h2 className="text-xl font-bold text-center">تفاصيل الدفع</h2>
        </div>
        
        {/* Payment amount */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">المبلغ المطلوب:</span>
            <span className="text-xl font-bold">{paymentData.amount} ج.م</span>
          </div>
          {paymentData.note && (
            <div className="mt-2 text-gray-500 text-sm">
              <p>{paymentData.note}</p>
            </div>
          )}
        </div>
        
        {/* Payment methods */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">اختر طريقة الدفع</h3>
          
          <div className="space-y-3">
            {paymentMethods && paymentMethods.map((method, index) => (
              <div 
                key={index}
                className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === index
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleMethodSelect(index)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {method.name === 'vodafone_cash' ? 'فودافون كاش' : 
                       method.name === 'bank_transfer' ? 'تحويل بنكي' : method.name}
                    </h4>
                    <p className="text-gray-600 mt-1">{method.id}</p>
                    {method.note && <p className="text-sm text-gray-500 mt-1">{method.note}</p>}
                  </div>
                  
                  {selectedMethod === index && (
                    <CheckCircle className="text-blue-500 w-6 h-6" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Confirmation form */}
        <div className="px-6 py-4 bg-gray-50">
          {isSuccess ? (
            <div className="text-center py-4">
              <CheckCircle className="mx-auto text-green-500 w-12 h-12 mb-2" />
              <h3 className="text-lg font-medium text-green-600">تم تأكيد الدفع بنجاح</h3>
              <p className="text-gray-600 mt-1">سيتم مراجعة العملية قريباً</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="paymentConfirmation"
                  className="w-4 h-4 text-blue-600 rounded"
                  required
                />
                <label htmlFor="paymentConfirmation" className="mr-2 text-gray-700">
                  أؤكد أنني قمت بالدفع بالفعل
                </label>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || selectedMethod === null}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isSubmitting || selectedMethod === null
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors`}
              >
                {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الدفع'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function for client-side
async function confirmClientPay(paymentId, payment_methode) {
  // Call your API endpoint to confirm payment
  const response = await fetch(`/api/client/payments/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentId, payment_methode }),
  });

  if (!response.ok) {
    throw new Error('Failed to confirm payment');
  }

  return await response.json();
}