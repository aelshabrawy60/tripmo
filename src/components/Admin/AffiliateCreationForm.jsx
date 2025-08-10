"use client"
import { useState } from 'react';
import { AlertCircle, CheckCircle, UserPlus, Loader2 } from 'lucide-react';

export default function AffiliateCreationForm() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إنشاء الشريك');
      }

      setResult(data);
      setFormData({ email: '', phone: '', name: '' }); // Reset form
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.phone && formData.name;

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6" dir="rtl">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">إنشاء مسوق جديد</h2>
      </div>

      {/* Success Message */}
      {result && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">تم إنشاء المسوق بنجاح!</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p><span className="font-medium">الاسم:</span> {result.affiliate?.name}</p>
            <p><span className="font-medium">البريد الإلكتروني:</span> {result.affiliate?.email}</p>
            <p><span className="font-medium">رقم الهاتف:</span> {result.affiliate?.phone}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">خطأ: {error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            الاسم الكامل
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل الاسم الكامل"
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && isFormValid && !loading && handleSubmit(e)}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            عنوان البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل عنوان البريد الإلكتروني"
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && isFormValid && !loading && handleSubmit(e)}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="أدخل رقم الهاتف"
            disabled={loading}
            onKeyDown={(e) => e.key === 'Enter' && isFormValid && !loading && handleSubmit(e)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جارٍ إنشاء مسوق...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              إنشاء مسوق
            </>
          )}
        </button>
      </div>
    </div>
  );
}