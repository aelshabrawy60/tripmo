'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const PhoneInputForm = ({
  selectedCountryCode,
  onCountryCodeChange,
  countryCodes,
  onSuccess,
  primary_color = '#1db954',
  locale = "ar"
}) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const t = {
    phoneLabel: {
      ar: "رقم الهاتف",
      en: "Phone number"
    },
    phonePlaceholder: {
      ar: "أدخل رقم الهاتف",
      en: "Enter your phone number"
    },
    sendError: {
      ar: "فشل في إرسال رمز التحقق",
      en: "Failed to send OTP"
    },
    invalidFormat: {
      ar: "صيغة رقم الهاتف غير صحيحة",
      en: "Invalid phone number format"
    },
    submit: {
      ar: "متابعة",
      en: "Continue"
    },
    loading: {
      ar: "جاري التحقق...",
      en: "Verifying..."
    }
  };

  const getFullPhoneNumber = (inputPhone = phone, country = selectedCountryCode) => {
    if (!inputPhone) return "";
    return `${country.code.substring(1)}${inputPhone.startsWith("0") ? inputPhone.substring(1) : inputPhone}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fullPhone = getFullPhoneNumber();

    if (!/^\d{10,15}$/.test(fullPhone)) {
      setError(t.invalidFormat[locale]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/client/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || t.sendError[locale]);
      }

      Cookies.set('client_phone', fullPhone, { expires: 1 });
      if (onSuccess) onSuccess(fullPhone, data.verificationId);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          {t.phoneLabel[locale]}
        </label>
        <div className={`relative flex ${locale == "en"? 'flex-row-reverse': null}`}>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.phonePlaceholder[locale]}
            className={`flex-grow p-3 py-2 border rounded-r-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-left ${locale == "ar"? "placeholder:text-right": "placeholder:text-left"} border-l-0`}
            disabled={isLoading}
          />
          <div className="relative">
            <button
              type="button"
              className="flex items-center justify-center h-full px-3 border bg-white border-gray-300 rounded-l-lg"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              disabled={isLoading}
            >
              <span>{selectedCountryCode.code}</span>
            </button>

            {showCountryDropdown && (
              <div className="absolute z-50 left-0 w-[250px] mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {countryCodes.map((country) => (
                  <div
                    key={country.code}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center transition-colors duration-150"
                    onClick={() => {
                      onCountryCodeChange(country);
                      setShowCountryDropdown(false);
                    }}
                  >
                    <span className="mr-2">{country.flag}</span>
                    <span className="mr-2">{country.code}</span>
                    <span className="text-gray-600">{country.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
      <button
        type="submit"
        className="w-full text-white py-2 bg-tripmo-500 px-4 rounded-md font-medium text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        disabled={isLoading || !phone.trim()}
      >
        {isLoading ? t.loading[locale] : t.submit[locale]}
      </button>
    </form>
  );
};

export default PhoneInputForm;
