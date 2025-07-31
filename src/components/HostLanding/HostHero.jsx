import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  DollarSign,
  CalendarCheck,
} from 'lucide-react';
import Image from 'next/image';
import InstagramEmbed from './InstagramEmbed';

// --- Helper Components (Unchanged) ---
const ParallaxElement = ({ children, speed = 0.5, scrollY }) => (
  <div
    style={{
      transform: `translateY(${scrollY * speed}px)`,
      transition: 'transform 0.1s ease-out',
    }}
  >
    {children}
  </div>
);

const FloatingElement = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};


// --- Main HostHero Component ---
function HostHero({ signinUrl, onGoogleSignIn, isGoogleSignInLoading }) {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { number: '5000+', label: 'مزود خدمة', icon: Users },
    { number: '100K+', label: 'حجز مكتمل', icon: CheckCircle },
    { number: '25+', label: 'محافظة', icon: Globe },
    { number: '98%', label: 'رضا العملاء', icon: Heart },
  ];

  return (
    <>
      {/* Hero Section */}
      {/* RESPONSIVENESS: Adjusted padding for better mobile view (pb-32 for stats card space) */}
      <section className="relative bg-gray-50 overflow-hidden pt-16 pb-32 sm:pt-6 sm:pb-24 flex items-center min-h-screen">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-5">
          <ParallaxElement speed={0.2} scrollY={scrollY}>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          </ParallaxElement>
          <ParallaxElement speed={0.4} scrollY={scrollY}>
            <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </ParallaxElement>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* RESPONSIVENESS: Grid now reverses column order on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16 items-center">
            
            {/* Right Column (becomes top on mobile) - Visuals */}
            {/* RESPONSIVENESS: Added order-first lg:order-last to show image on top for mobile */}
            <div className="relative order-last lg:order-last">
              <FloatingElement delay={100}>
                {/* RESPONSIVENESS: Adjusted height for mobile and desktop */}
                <div className="relative w-full h-80 sm:h-96 lg:h-[500px]">
                   <Image 
                      className='rounded-3xl object-cover shadow-2xl'
                      src="https://xtcmkhuruoghbsliqbcb.supabase.co/storage/v1/object/public/trips/29/6eed8b72_1752869471337.jpg"
                      layout="fill"
                      alt='مزود خدمة سياحية سعيد في مصر'
                      priority
                    />
                </div>
              </FloatingElement>
              
              <FloatingElement delay={800}>
                {/* RESPONSIVENESS: Smart positioning for stats card */}
                <div className="absolute -bottom-30 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md lg:max-w-none lg:w-full lg:left-auto lg:right-0 lg:translate-x-0 lg:-bottom-12 lg:-left-8 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-1">
                      <stat.icon className="w-7 h-7 mx-auto text-tripmo-500 mb-1" />
                      <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.number}</p>
                      <p className="text-xs text-gray-600 leading-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </FloatingElement>
            </div>

            {/* Left Column (becomes bottom on mobile) - Text Content */}
            <div className="text-center lg:text-right">
              <FloatingElement>
                {/* MODIFICATION: More general, powerful headline for all providers */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                  <span className="text-tripmo-500">
                    ضاعف حجوزاتك.
                  </span>
                  <br />
                  <span className="text-gray-900">
                    نمِّ أرباحك.
                  </span>
                </h1>
              </FloatingElement>
              
              <FloatingElement delay={200}>
                {/* MODIFICATION: Inclusive sub-headline for all service types */}
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                  سواء كنت تقدم جولات سياحية أو أنشطة فريدة، <span className="font-bold text-blue-600">رحلة ناو</span> هو شريكك للنجاح.
                </p>
              </FloatingElement>

              <FloatingElement delay={400}>
                <div className="space-y-4 mb-10 text-right max-w-md mx-auto lg:mx-0">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <p className="text-gray-700 font-medium">وصول فوري لآلاف العملاء الجدد</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* MODIFICATION: "Offers" is more general than "trips" */}
                    <CalendarCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <p className="text-gray-700 font-medium">أدوات سهلة لإدارة عروضك وحجوزاتك</p>
                  </div>
                   <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <p className="text-gray-700 font-medium">تحصيل آمن وسريع لأرباحك</p>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement delay={600}>
                <div className="flex flex-col gap-4 items-center lg:items-start">
                  {/* RESPONSIVENESS: Button is full-width on small screens */}
                  <button onClick={onGoogleSignIn} disabled={isGoogleSignInLoading} className="group w-full sm:w-auto bg-tripmo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGoogleSignInLoading ? 'جاري التسجيل...' : 'انضم الآن'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>
      </section>

      {/* "Trusted By" Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* MODIFICATION: Generalized title */}
          <h3 className="text-center text-base font-semibold text-gray-500 tracking-wider">
            ينضم إلينا أفضل مزودي الخدمات السياحية في مصر
          </h3>
          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 flex justify-center items-center py-2">
              <img src='/nuvago.png' width={100} className='max-w-[200px]'></img>
            </div>
            <div className="col-span-1 flex justify-center items-center py-2">
               <img src='/octoboats-logo-2.png' width={100} className='max-w-[200px] '></img>
            </div>
            <div className="col-span-1 flex justify-center items-center py-2">
               <img src='/duck.png' width={100} className='max-w-[200px] '></img>
            </div>
            <div className="col-span-1 flex justify-center items-center py-2">
               <img src='/pushkin.png' width={120} className='max-w-[200px] '></img>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HostHero;