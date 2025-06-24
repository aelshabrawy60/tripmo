'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const PhoneInputForm = ({
  selectedCountryCode,
  onCountryCodeChange,
  countryCodes,
  onSuccess, // callback when OTP is successfully sent
  primary_color = '#1db954'
}) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to get full phone number like in UserAuthenticationFlow
  const getFullPhoneNumber = (inputPhone = phone, country = selectedCountryCode) => {
    if (!inputPhone) return "";
    return `${country.code.substring(1)}${inputPhone.startsWith("0") ? inputPhone.substring(1) : inputPhone}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Use the same logic as UserAuthenticationFlow to get full phone
    const fullPhone = getFullPhoneNumber();

    // Validate the full phone number
    if (!/^\d{10,15}$/.test(fullPhone)) {
      setError('صيغة رقم الهاتف غير صحيحة');
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
        throw new Error(data.message || 'فشل في إرسال رمز التحقق');
      }

      Cookies.set('client_phone', fullPhone, { expires: 1 }); // save phone in cookie
      if (onSuccess) onSuccess(fullPhone, data.verificationId);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          رقم الهاتف
        </label>
        <div className="relative flex">
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(بالإنجليزية) أدخل رقم الهاتف"
            className="flex-grow p-3 py-2 border rounded-r-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-left placeholder:text-right border-l-0"
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
        {isLoading ? 'جاري التحقق...' : 'متابعة'}
      </button>
    </form>
  );
};

export default PhoneInputForm;