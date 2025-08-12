"use client";
import React, { useState } from 'react';
import { signInAffiliate } from '@/lib/auth-actions';
import Link from 'next/link';

const AffiliateSignInPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle form submission manually
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        
        // Create FormData manually
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        try {
            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            );
            
            const result = await Promise.race([
                signInAffiliate(formData),
                timeoutPromise
            ]);
            
            console.log('Sign in result:', result); // Debug log
            
            // Check if sign in was successful
            if (result && result.success) {
                // Redirect to admin page
                window.location.reload()
            } else if (result && result.error) {
                setErrorMessage(result.error);
                setLoading(false);
            } else {
                // If result is undefined or doesn't have expected properties
                setErrorMessage("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Affiliate login error:", error);
            setLoading(false);
            
            // Handle different types of errors
            if (error.message === 'Request timeout') {
                setErrorMessage("انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.");
            } else if (error.message && error.message.includes('NEXT_REDIRECT')) {
                // If the server action is still using redirect, handle it
                console.log('Redirect detected, navigating manually...');
                window.location.reload()
            } else {
                setErrorMessage(error.message || "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
            }
        }
    };

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
                                <h2 className="text-3xl font-bold text-white">التسويق بالعمولة</h2>
                            </div>
                        </div>
                    </div>
                    {/* Sign-in Card (Right Side on lg screens) */}
                    <div className="lg:w-1/2 flex items-center justify-center lg:justify-end p-0">
                        <div className="bg-white/95 rounded-xl w-[90%] shadow-md overflow-hidden relative">
                            <div className="p-[30px] text-center">
                                <div className="bg-white mb-2 flex justify-center text-white px-8 text-center relative overflow-hidden">
                                    <img src='/logo.png' width={100}></img>
                                </div>
                                <div className="mb-[30px] relative z-10">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">تسجيل دخول</h1>
                                    <p className="text-gray-600">الوصول إلى لوحة التحكم</p>
                                </div>
                                
                                <form className='text-right' onSubmit={handleSubmit}>
                                    <div className="mb-[20px]">
                                        <label htmlFor="username" className="block mb-[8px] font-medium text-[#444]">اسم المستخدم</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name='username'
                                            placeholder="أدخل اسم المستخدم"
                                            required
                                            className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="mb-[20px]">
                                        <label htmlFor="password" className="block mb-[8px] font-medium text-[#444]">كلمة المرور</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name='password'
                                            placeholder="أدخل كلمة المرور"
                                            required
                                            className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
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
                                        disabled={loading}
                                        className="w-full bg-tripmo-500 text-white py-[12px] px-[30px] rounded-[10px] font-medium text-base transition-all duration-300 hover:bg-tripmo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex justify-center items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                جاري تسجيل الدخول...
                                            </>
                                        ) : 'دخول لوحة التحكم'}
                                    </button>

                                    <div className="text-center text-gray-600 mt-4">
                                        <p className="text-sm">
                                            ليس لديك حساب ؟
                                            <Link href="/signup" className="text-tripmo-500 hover:text-tripmo-400 font-medium mr-1">
                                                انشاء حساب جديد
                                            </Link>
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

export default AffiliateSignInPage;