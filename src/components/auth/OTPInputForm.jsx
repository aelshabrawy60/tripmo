'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const OTPInputForm = ({
  phoneNumber,
  isExistingUser,
  verificationId,
  primary_color = '#3b82f6',
  onVerified,
  locale = 'ar'
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');

  const t = {
    title: {
      ar: 'تحقق من رقم الهاتف',
      en: 'Verify Phone Number'
    },
    sentTo: {
      ar: 'تم إرسال رمز التحقق إلى',
      en: 'A verification code was sent to'
    },
    accountFound: {
      ar: '✓ تم العثور على حسابك',
      en: '✓ Your account was found'
    },
    codeLabel: {
      ar: 'رمز التحقق',
      en: 'Verification Code'
    },
    codePlaceholder: {
      ar: '123456',
      en: '123456'
    },
    verifying: {
      ar: 'جاري التحقق...',
      en: 'Verifying...'
    },
    login: {
      ar: 'تسجيل الدخول',
      en: 'Login'
    },
    verify: {
      ar: 'تحقق من الرمز',
      en: 'Verify Code'
    },
    notReceived: {
      ar: 'لم تستلم الرمز؟',
      en: 'Didn’t receive the code?'
    },
    resend: {
      ar: 'إعادة إرسال الرمز',
      en: 'Resend Code'
    },
    waitResend: {
      ar: 'إعادة الإرسال خلال',
      en: 'Resend in'
    },
    delayNote1: {
      ar: 'قد تستغرق الرسالة حتى دقيقة للوصول',
      en: 'The message might take up to a minute to arrive'
    },
    delayNote2: {
      ar: 'تحقق من رسائل WhatsApp',
      en: 'Check your WhatsApp messages'
    },
    serverError: {
      ar: 'حدث خطأ في الاتصال بالخادم',
      en: 'A server error occurred'
    },
    verifyError: {
      ar: 'حدث خطأ أثناء التحقق',
      en: 'Verification failed'
    }
  };

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
      setResendCooldown(60);
      // Implement resend API logic here
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
        body: JSON.stringify({ phone: phoneNumber, otp, verificationId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Cookies.set('client_token', data.clientToken, { expires: 1000 });
        if (onVerified) onVerified(data);
      } else {
        setError(data.message || t.verifyError[locale]);
      }
    } catch (err) {
      console.error(err);
      setError(t.serverError[locale]);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title[locale]}</h2>
        <p className="text-gray-600">{t.sentTo[locale]}</p>
        <p className="text-lg font-semibold text-gray-900 mt-1">{phoneNumber}</p>
        {isExistingUser && (
          <p className="text-sm text-green-600 mt-2">{t.accountFound[locale]}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            {t.codeLabel[locale]}
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpInput}
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent tracking-widest"
            placeholder={t.codePlaceholder[locale]}
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
              {t.verifying[locale]}
            </div>
          ) : isExistingUser ? (
            t.login[locale]
          ) : (
            t.verify[locale]
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">{t.notReceived[locale]}</p>
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
              ? `${t.waitResend[locale]} ${resendCooldown} ${locale === 'ar' ? 'ثانية' : 's'}`
              : t.resend[locale]}
          </button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>{t.delayNote1[locale]}</p>
        <p>{t.delayNote2[locale]}</p>
      </div>
    </div>
  );
};

export default OTPInputForm;
