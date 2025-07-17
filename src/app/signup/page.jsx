"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignInWithGoogleButton from '@/components/auth/SignInWithGoogleButton';
import { signup } from '@/lib/auth-actions';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
        
        // Create FormData with all required fields
        const formDataToSend = new FormData();
        formDataToSend.append('first-name', formData.firstName);
        formDataToSend.append('last-name', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        
        try {
            // Call the server action
            const result = await signup(formDataToSend);
            
            if(result.status == true){
                window.location.href = "/"
            }else{
                setLoading(false);
                setErrorMessage(`${result.error}`);
            }
            
        } catch (error) {
            console.error("Signup error:", error);
            setLoading(false);
            setErrorMessage("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
        }
    };

    const handleGoogleSignIn = () => {
        setLoading(true);
        // The loading state will remain true until redirect happens
    };

    return (
        <div dir="rtl" lang="ar">
            <div className="min-h-screen flex justify-center items-center font-[Tajawal]">
                <div className="lg:flex lg:flex-row-reverse w-full max-w-[1400px] max-h-[630px] h-screen">
                    {/* Image Section (Left Side on lg screens) */}
                    <div className="hidden relative p-8 lg:flex items-center justify-center">
                        <div className="text-center h-full rounded-lg bg-black">
                            <img 
                                src="/0x0.webp" 
                                alt="Tourism Management" 
                                className="w-full h-full rounded-lg opacity-50 shadow-lg object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                }}
                            />
                            <div className='absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                                <h2 className="text-3xl font-bold text-white">منصة احترافية لإدارة وتسويق رحلاتك السياحية</h2>
                                <p className="mt-3 text-white text-opacity-90">حل متكامل لأصحاب الرحلات لتنظيم الحجوزات والتواصل مع العملاء بكفاءة</p>
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
                                <div className="mb-[20px] relative z-10">كل ما تحتاجه لإدارة شركتك السياحية علي الانترنت.</div>

                                {/* Make Google Button More Prominent */}
                                <div className="mb-5 transform scale-105">
                                    <SignInWithGoogleButton loading={loading} onClick={handleGoogleSignIn} />
                                </div>

                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">أو</span>
                                    </div>
                                </div>
                                
                                <form className='text-right' onSubmit={handleSubmit}>
                                    <div className='flex gap-4'>
                                    {/* First Name */}
                                        <div className="mb-[20px]">
                                            <label htmlFor="firstName" className="block mb-[8px] font-medium text-[#444]">الاسم الأول</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                placeholder="احمد"
                                                required
                                                className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div className="mb-[20px]">
                                            <label htmlFor="lastName" className="block mb-[8px] font-medium text-[#444]">الاسم الأخير</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                placeholder="محمد"
                                                required
                                                className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                disabled={loading}
                                            />
                                        </div>

                                    </div>

                                    {/* Email */}
                                    <div className="mb-[20px]">
                                        <label htmlFor="email" className="block mb-[8px] font-medium text-[#444]">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="أدخل بريدك الإلكتروني"
                                            required
                                            className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-[20px]">
                                        <label htmlFor="password" className="block mb-[8px] font-medium text-[#444]">كلمة المرور</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="انشئ كلمة المرور"
                                            required
                                            className="w-full p-[12px] border-2 border-[#eee] rounded-[10px] text-base font-[Tajawal] transition-all duration-300 focus:border-tripmo-500 focus:outline-none"
                                            value={formData.password}
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
                                        disabled={loading}
                                        className="w-full bg-tripmo-500 text-white py-[12px] px-[30px] rounded-[10px] font-medium text-base transition-all duration-300 hover:bg-tripmo-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex justify-center items-center"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                جاري إنشاء حساب...
                                            </>
                                        ) : 'إنشاء حساب'}
                                    </button>
                                </form>

                                {/* Sign in link */}
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        لديك حساب بالفعل؟{' '}
                                        <Link 
                                            href="/signin" 
                                            className="text-tripmo-500 hover:text-tripmo-400 font-medium transition-colors duration-200"
                                        >
                                            تسجيل الدخول
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;