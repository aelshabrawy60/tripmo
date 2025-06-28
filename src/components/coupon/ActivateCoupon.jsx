import React, { useState, useEffect } from 'react';

function ActivateCoupon() {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Check for existing coupon on component mount
  useEffect(() => {
    checkExistingCoupon();
  }, []);

  const checkExistingCoupon = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch('/api/dashboard/coupon', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.message === "success" && data.data) {
        setActiveCoupon(data.data);
      }
    } catch (error) {
      console.error('Error checking existing coupon:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setResult({
        status: 'error',
        message: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/dashboard/coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coupon: couponCode.trim(),
        })
      });

      const data = await response.json();
      
      if (data.message == "success") {
        // Display the custom success message with amount and duration
        const successMessage = `لقد حصلت علي خصم ${data.data.amount}% لمدة ${data.data.duration} يوم علي عمولة الحجز`;
        
        setResult({
          status: 'success',
          message: successMessage,
          coupon: data.data.coupon,
          amount: data.data.amount,
          duration: data.data.duration
        });
        setCouponCode('');
        setActiveCoupon(data.data); // Set the active coupon
      } else if (data.message == "error") {
        setResult({
          status: 'error',
          message: 'كود الكوبون غير صحيح أو غير متاح'
        });
      } else {
        setResult({
          status: 'error',
          message: 'حدث خطأ أثناء تفعيل الكوبون'
        });
      }
    } catch (error) {
      setResult({
        status: 'error',
        message: 'حدث خطأ في الاتصال بالخادم'
      });
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <div className="animate-pulse">
        {/* Form skeleton */}
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );

  // Show skeleton loading during initial check
  if (initialLoading) {
    return <SkeletonLoader />;
  }

  // Show active coupon info if exists
  if (activeCoupon) {
    const endDate = new Date(activeCoupon.end_date);
    
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-green-50 border border-green-200 p-4 rounded-md">
          <div className="flex items-center text-green-800">
            <div className="flex-shrink-0 ml-2">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="w-full">
              <p className="font-medium text-lg mb-3">
                لديك خصم {activeCoupon.amount}% مفعل علي عمولة الحجز
              </p>
              <div className="text-sm bg-white p-3 rounded">
                <p className="mb-1"><strong>تاريخ الانتهاء:</strong> {endDate.toLocaleDateString('ar-EG')}</p>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-md ${
            result.status === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`flex items-center ${
              result.status === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              <div className="flex-shrink-0 ml-2">
                {result.status === 'success' ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="font-medium">{result.message}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show normal coupon activation form
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            كود الكوبون *
          </label>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="أدخل كود الكوبون"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              جارٍ التفعيل...
            </>
          ) : (
            'تفعيل الكوبون'
          )}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.status === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className={`flex items-center ${
            result.status === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            <div className="flex-shrink-0 ml-2">
              {result.status === 'success' ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{result.message}</p>
              {result.coupon && (
                <div className="mt-3 text-sm bg-white p-3 rounded border">
                  <p className="mb-1"><strong>نوع الكوبون:</strong> {result.coupon.type || 'غير محدد'}</p>
                  <p className="mb-1"><strong>نسبة الخصم:</strong> {result.amount || result.coupon.value || 'غير محدد'}%</p>
                  <p><strong>مدة الصلاحية:</strong> {result.duration || result.coupon.duration || 0} يوم</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivateCoupon;