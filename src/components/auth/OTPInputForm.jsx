'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const OTPInputForm = ({
  phoneNumber,
  isExistingUser,
  verificationId,
  primary_color = '#3b82f6',
  onVerified,
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResend = () => {
    if (resendCooldown === 0) {
      setResendCooldown(60); // 60 seconds cooldown
      // Call your OTP resend logic (probably a separate API)
    }
  };

  const handleOtpInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/client/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp, verificationId }),
      });

      const data = await response.json();
      console.log('OTP Response:', data); // Debug log

      if (response.ok && data.success) {
        Cookies.set('client_token', data.clientToken, { expires: 1000 });

        if (onVerified) onVerified(data); // Callback after success (e.g., redirect)
      } else {
        console.log('OTP Failed:', data); // Debug log

        setError(data.message || 'حدث خطأ أثناء التحقق');
      }
    } catch (err) {
      
      console.error(err);
      setError('حدث خطأ في الاتصال بالخادم');
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تحقق من رقم الهاتف</h2>
        <p className="text-gray-600">تم إرسال رمز التحقق إلى</p>
        <p className="text-lg font-semibold text-gray-900 mt-1">{phoneNumber}</p>
        {isExistingUser && (
          <p className="text-sm text-green-600 mt-2">✓ تم العثور على حسابك</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            رمز التحقق
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpInput}
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
            placeholder="123456"
            maxLength={6}
            disabled={isLoading}
            style={{ '--tw-ring-color': primary_color }}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full py-3 bg-tripmo-500 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            opacity: (isLoading || otp.length !== 6) ? 0.5 : 1
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              جاري التحقق...
            </div>
          ) : isExistingUser ? (
            'تسجيل الدخول'
          ) : (
            'تحقق من الرمز'
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">لم تستلم الرمز؟</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isLoading}
            className="text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: resendCooldown > 0 ? '#6b7280' : primary_color
            }}
          >
            {resendCooldown > 0
              ? `إعادة الإرسال خلال ${resendCooldown} ثانية`
              : 'إعادة إرسال الرمز'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>قد تستغرق الرسالة حتى دقيقة للوصول</p>
        <p>تحقق من رسائل WhatsApp</p>
      </div>
    </div>
  );
};

export default OTPInputForm;
