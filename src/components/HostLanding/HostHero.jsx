import React, { useEffect, useRef, useState } from 'react'
import { 
  MapPin,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Globe,
  Heart,
} from 'lucide-react';
import Image from 'next/image';


function HostHero() {
  const [scrollY, setScrollY] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);
  const heroRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
      setIsVisible(true);
    }, []);

  // Parallax effect
    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  // Animate stats counter
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentStat(prev => (prev + 1) % 4);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

      const stats = [
    { number: "5000+", label: "مزود رحلات", icon: Users },
    { number: "100K+", label: "رحلة محجوزة", icon: MapPin },
    { number: "25+", label: "محافظة", icon: Globe },
    { number: "98%", label: "رضا العملاء", icon: Heart }
  ];
    const ParallaxElement = ({ children, speed = 0.5 }) => (
    <div 
      style={{
        transform: `translateY(${scrollY * speed}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );

  const FloatingElement = ({ children, delay = 0 }) => (
    <div 
      className={`transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  return (
    <div>
        {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden pt-16 min-h-screen flex items-center">
        {/* Enhanced Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <ParallaxElement speed={0.2}>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          </ParallaxElement>
          <ParallaxElement speed={0.4}>
            <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </ParallaxElement>
          <ParallaxElement speed={0.6}>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          </ParallaxElement>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ParallaxElement speed={0.3}>
            <div className="absolute top-20 right-20 w-20 h-20 bg-blue-500/20 rounded-lg rotate-12 animate-bounce"></div>
          </ParallaxElement>
          <ParallaxElement speed={0.5}>
            <div className="absolute bottom-40 left-40 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse"></div>
          </ParallaxElement>
          <ParallaxElement speed={0.7}>
            <div className="absolute top-60 left-20 w-12 h-12 bg-blue-500/20 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
          </ParallaxElement>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-right">
              <FloatingElement>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                  <span className=" text-tripmo-500">
                    نَمِّ نشاطك
                  </span>
                  <br />
                  <span className="text-gray-900">
                    السياحي
                  </span>
                </h1>
              </FloatingElement>
              
              <FloatingElement delay={200}>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  انضم إلى منصة <span className="font-bold text-blue-600">رحلة ناو</span>، المنصة الأسرع نموًا لحجز الرحلات في مصر
                </p>
              </FloatingElement>

              <FloatingElement delay={400}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                  <button className="group bg-tripmo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                    سجّل رحلتك مجانًا
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </FloatingElement>

              <FloatingElement delay={600}>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                    التسجيل مجاني 100%
                </div>
              </FloatingElement>
            </div>

            {/* Right Column - Stats & Visual */}
            <div className="relative">
              <FloatingElement delay={800}>
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-2 border border-white/20 shadow-2xl">
                    <Image 
                    className='rounded-3xl'
                    src="/Egypt-tour-guide-at-temple.jpg"
                    width={600}
                    height={100}
                    alt='trips'
                    />
                </div>
              </FloatingElement>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HostHero