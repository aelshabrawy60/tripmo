'use client';
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const NameInputForm = ({
  initialName = '',
  onSuccess,
  primary_color = '#1db954',
  locale = 'ar',
}) => {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isArabic = locale === 'ar';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const token = Cookies.get('client_token');

    if (!token) {
      setError(isArabic ? 'المعرف مفقود. الرجاء إعادة التحقق.' : 'Token is missing. Please check again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/client/auth/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (isArabic ? 'حدث خطأ' : 'An error occurred'));
      }

      if (onSuccess) onSuccess(data.client);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          {isArabic ? 'الاسم' : 'Name'}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
          className="w-full p-3 py-2 border rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          disabled={isLoading}
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <button
        type="submit"
        style={{ backgroundColor: primary_color }}
        className="w-full text-white py-2 px-4 rounded-md font-medium text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        disabled={isLoading || !name.trim()}
      >
        {isLoading
          ? isArabic ? 'جاري التسجيل...' : 'Submitting...'
          : isArabic ? 'تسجيل' : 'Submit'}
      </button>
    </form>
  );
};

export default NameInputForm;
