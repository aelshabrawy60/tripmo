"use client";
import React, { useState } from 'react';
import { signUpAffiliate } from '@/lib/auth-actions';

const AffiliateSignUpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission manually
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setResult(null);
        
        // Create FormData manually
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        
        try {
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );
            
            const result = await Promise.race([
                signUpAffiliate(formDataToSend),
                timeoutPromise
            ]);
            
            console.log('Sign up result:', result); // Debug log
            
            // Check if sign up was successful
            if (result && result.success) {
                window.location.href = '/'
                setResult(result);
                setFormData({ name: '', email: '', phone: '' }); // Reset form
            } else if (result && result.error) {
                setErrorMessage(result.error);
                setLoading(false);
            } else {
                // If result is undefined or doesn't have expected properties
                setErrorMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Affiliate signup error:", error);
            setLoading(false);
            
            // Handle different types of errors
            if (error.message === 'Request timeout') {
                setErrorMessage("انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.");
            } else {
                setErrorMessage(error.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
            }
        }
    };

    const isFormValid = formData.email && formData.phone && formData.name;

    return (
        <div dir="rtl" lang="ar">
            <div className="min-h-screen flex justify-center items-center font-[Tajawal]">
                <div className="lg:flex lg:flex-row-reverse w-full max-w-[1400px] max-h-[630px] h-screen">
                    {/* Image Section (Left Side on lg screens) */}
                    <div className="hidden relative p-8 lg:flex items-center justify-center">
                        <div className="text-center h-full rounded-lg bg-black">
                            <img 
                                src="/shutterstock_1181523733.webp" 
                                alt="Affiliate Panel" 
                                className="w-full h-full rounded-lg opacity-50 shadow-lg object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                }}
                            />
                            <div className='absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                                <h2 className="text-3xl font-bold text-white">انضم إلى برنامج التسويق بالعمولة</h2>
                            </div>
                        </div>
                    </div>

                    {/* Sign-up Card (Right Side on lg screens) */}
                    <div className="lg:w-1/2 flex items-center justify-center lg:justify-end p-0">
                        <div className="bg-white/95 rounded-xl w-[90%] shadow-md overflow-hidden relative">
                            <div className="p-[30px] text-center">
                                <div className="bg-white mb-2 flex justify-center text-white px-8 text-center relative overflow-hidden">
                                    <img src='/logo.png' width={100} alt="Logo" />
                                </div>
                                <div className="mb-[30px] relative z-10">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">إنشاء حساب جديد</h1>
                                    <p className="text-gray-600">انضم إلى برنامج التسويق بالعمولة</p>
                                </div>

                                {/* Success Message */}
                                {result && (
                                    <div className="mb-[20px] p-[12px] bg-green-100 border border-green-200 rounded-[10px]">
                                        <div className="text-green-800 text-sm mb-2 font-semibold">تم إنشاء حسابك بنجاح!</div>
                                        <div className="text-sm text-green-700 space-y-1 text-right">
                                            <p><span className="font-medium">الاسم:</span> {result.affiliate?.name}</p>
                                            <p><span className="font-medium">البريد الإلكتروني:</span> {result.affiliate?.email}</p>
                                            <p><span className="font-medium">رقم الهاتف:</span> {result.affiliate?.phone}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <form className='text-right' onSubmit={handleSubmit}>
                                    <div className="mb-[20px]">
                                        <label htmlFor="name" className="block mb-[8px] font-medium text-[#444]">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name='name'
                                            placeholder="أدخل الاسم الكامل"
                                            required
                                            className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-[20px]">
                                        <label htmlFor="email" className="block mb-[8px] font-medium text-[#444]">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name='email'
                                            placeholder="أدخل البريد الإلكتروني"
                                            required
                                            className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-[20px]">
                                        <label htmlFor="phone" className="block mb-[8px] font-medium text-[#444]">رقم الهاتف</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name='phone'
                                            placeholder="أدخل رقم الهاتف"
                                            required
                                            className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    {errorMessage && (
                                        <div className="mb-[20px] p-[12px] bg-red-100 text-red-700 rounded-[10px] text-sm">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!isFormValid || loading}
                                        className="w-full bg-tripmo-500 text-white py-[12px] px-[30px] rounded-[10px] font-medium text-base transition-all duration-300 hover:bg-tripmo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex justify-center items-center mb-4"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                جاري إنشاء الحساب...
                                            </>
                                        ) : 'إنشاء حساب'}
                                    </button>

                                    <div className="text-center text-gray-600">
                                        <p className="text-sm">
                                            لديك حساب بالفعل؟ 
                                            <a href="/signin" className="text-tripmo-500 hover:text-tripmo-400 font-medium mr-1">
                                                تسجيل الدخول
                                            </a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AffiliateSignUpPage;