"use client"

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Settings, 
  DollarSign, 
  Megaphone, 
  User, 
  Plus, 
  Calendar,
  ChevronDown,
  CheckCircle,
  ArrowRight,
  Award,
  Shield,
  Zap,
  Target,
  MessageCircle,
  Phone,
  Mail,
} from 'lucide-react';
import MainLayout from '@/components/Templates/Main/MainLayout';
import MainNavbar from '@/components/Templates/Main/MainNavbar';
import { email, footerPages, pages, phoneNumber, socialMedia } from '../[locale]/data';
import MainFooter from '@/components/Templates/Main/MainFooter';
import HostHero from '@/components/HostLanding/HostHero';
import { signInWithGoogle } from "@/lib/auth-actions";

const useUTMPreservation = (basePath = '/signin') => {
  const [urlWithUTM, setUrlWithUTM] = useState(basePath);


  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = new URLSearchParams();
    
    // UTM parameters to preserve
    const utmKeys = [
      'utm_source',
      'utm_medium', 
      'utm_campaign',
      'utm_id',
      'utm_content',
      'utm_term'
    ];
    
    // Extract and preserve UTM parameters
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utmParams.append(key, value);
      }
    });
    
    // Build final URL with UTM parameters
    const utmString = utmParams.toString();
    setUrlWithUTM(`${basePath}${utmString ? `?${utmString}` : ''}`);
  }, [basePath]);
  
  return urlWithUTM;
};

const TravelProviderLanding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isGoogleSignInLoading, setIsGoogleSignInLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  
  const signinUrlWithUTM = useUTMPreservation('/signin');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleSignInLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsGoogleSignInLoading(false);
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "احصل على حجوزات أكثر",
      description: "انشر رحلاتك أمام آلاف الباحثين عن مغامرات داخل مصر وخارجها.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Settings,
      title: "لوحة تحكم سهلة",
      description: "أضف رحلاتك، حدد الأسعار، وادخل مواعيدك بكل سهولة.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: DollarSign,
      title: "بدون رسوم تسجيل",
      description: "انضم مجانًا",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Megaphone,
      title: "دعاية وتسويق",
      description: "نروج لرحلاتك عبر إعلاناتنا على الإنترنت وصفحات التواصل.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const steps = [
    {
      icon: User,
      title: "سجّل كمزود رحلات",
      description: "املأ البيانات الأساسية عنك وعن شركتك أو نشاطك.",
      details: "عملية التسجيل تستغرق 5 دقائق فقط"
    },
    {
      icon: Plus,
      title: "أضف رحلاتك",
      description: "أضف التفاصيل والصور والأسعار بسهولة.",
      details: "نظام سهل لإضافة الصور والوصف والمواعيد"
    },
    {
      icon: Calendar,
      title: "استقبل الحجوزات",
      description: "ابدأ في تلقي الحجوزات وإدارة مواعيدك من لوحة تحكم سهلة.",
      details: "إشعارات فورية عند كل حجز جديد"
    }
  ];

  const faqs = [
    {
        question: "هل التسجيل مجاني؟",
        answer: "نعم، التسجيل مجاني بالكامل. لا توجد رسوم شهرية أو سنوية. تدفع فقط عمولة عند تأكيد الحجز."
    },
    {
        question: "كيف أستلم الأرباح؟",
        answer: "تستطيع سحب الأرباح إلى حسابك البنكي أو محفظتك الإلكترونية (مثل فودافون كاش أو أورانج موني)، بعد مرور 24 ساعة من تاريخ الرحلة و3 أيام من تاريخ الدفع."
    },
    {
        question: "هل أحتاج لشركة مسجلة؟",
        answer: "نقبل الأفراد والشركات."
    },
    {
      question: "كم تبلغ العمولة؟",
      answer: `العمولة تعتمد على قيمة الحجز:\n- 20٪ إذا كانت قيمة الحجز أقل من 2000 جنيه.\n- 15٪ إذا كانت بين 2000 و8000 جنيه.\n- 10٪ إذا تجاوزت 8000 جنيه.\nيتم خصم العمولة تلقائيًا من المبلغ المدفوع.`
    },

    {
        question: "هل يمكنني تعديل الرحلات بعد النشر؟",
        answer: "نعم، يمكنك تعديل أي تفاصيل مثل السعر، التاريخ، والوصف من لوحة التحكم في أي وقت."
    },
   ];

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


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 100); // Show button if scrolled down more than 100px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <MainLayout>
    <MainNavbar pages={pages} type={1}/>
      <HostHero
        signinUrl={signinUrlWithUTM}
        onGoogleSignIn={handleGoogleSignIn}
        isGoogleSignInLoading={isGoogleSignInLoading}
      />

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingElement>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                لماذا يثق مزودو الرحلات في <span className="text-blue-600">رحلة ناو</span>؟
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                اكتشف المزايا التي تجعل منصتنا الخيار الأول لمزودي الرحلات في مصر
              </p>
            </div>
          </FloatingElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <FloatingElement key={index} delay={index * 100}>
                <div className="group relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                    <div className={`w-full h-full rounded-full bg-gradient-to-r ${benefit.color} blur-2xl`}></div>
                  </div>
                  <div className={`bg-gradient-to-r ${benefit.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingElement>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                ثلاث خطوات فقط لبدء بيع رحلاتك
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                عملية بسيطة وسريعة للانضمام إلى أكبر شبكة سياحية في مصر
              </p>
            </div>
          </FloatingElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <FloatingElement key={index} delay={index * 200}>
                <div 
                  className={`relative p-8 rounded-3xl cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    activeStep === index 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl' 
                      : 'bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl relative ${
                      activeStep === index 
                        ? 'bg-white text-blue-600' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    }`}>
                      {index + 1}
                      {activeStep === index && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <step.icon className={`w-8 h-8 mx-auto mb-4 ${
                      activeStep === index ? 'text-white' : 'text-blue-600'
                    }`} />
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className={`leading-relaxed mb-2 ${
                      activeStep === index ? 'text-blue-100' : 'text-gray-600'
                    }`}>{step.description}</p>
                    <p className={`text-sm ${
                      activeStep === index ? 'text-blue-200' : 'text-gray-500'
                    }`}>{step.details}</p>
                  </div>
                </div>
              </FloatingElement>
            ))}
          </div>

          {/* Process Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <div className="space-y-12">
              {steps.map((step, index) => (
                <FloatingElement key={index} delay={index * 300}>
                  <div className={`flex items-center ${index % 2 === 0 ? 'justify-start ml-4' : 'justify-end mr-4'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'md:pr-8 ' : 'md:pl-8'}`}>
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.details}</p>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                </FloatingElement>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingElement>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                الأسئلة الشائعة
              </h2>
              <p className="text-xl text-gray-600">
                إجابات على أهم الأسئلة التي قد تخطر ببالك
              </p>
            </div>
          </FloatingElement>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <FloatingElement key={index} delay={index * 100}>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <button
                    className="w-full px-6 py-6 text-right flex items-center justify-between hover:bg-blue-50 transition-colors duration-300 group"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                    <div className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-6 text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingElement>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                هل تحتاج مساعدة؟
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                فريقنا جاهز لمساعدتك في أي وقت. تواصل معنا الآن
              </p>
            </div>
          </FloatingElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FloatingElement delay={100}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">اتصل بنا</h3>
                <p className="text-gray-600 mb-4">متاح من 9 صباحاً إلى 10 مساءً</p>
                <a href="tel:+201234567890" className="text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors">
                  {phoneNumber}
                </a>
              </div>
            </FloatingElement>

            <FloatingElement delay={200}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">واتساب</h3>
                <p className="text-gray-600 mb-4">دردشة مباشرة مع فريق الدعم</p>
                <a target="_blank" href={`https://wa.me/${phoneNumber}`} className="text-green-600 font-bold text-lg hover:text-green-700 transition-colors">
                  ابدأ المحادثة
                </a>
              </div>
            </FloatingElement>

            <FloatingElement delay={300}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">البريد الإلكتروني</h3>
                <p className="text-gray-600 mb-4">نرد خلال 24 ساعة</p>
                <a href="mailto:support@rihltak.com" className="text-purple-600 font-bold text-lg hover:text-purple-700 transition-colors">
                  {email}
                </a>
              </div>
            </FloatingElement>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className='bg-white rounded-2xl'>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FloatingElement>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                🚀 ابدأ رحلتك معنا اليوم
              </h2>
              <p className="text-xl text-gray-800 mb-8 leading-relaxed max-w-2xl mx-auto">
                لا تفوّت فرصتك في الحصول على المزيد من العملاء. انضم لأكبر شبكة لحجز الرحلات في مصر وابدأ في زيادة أرباحك الآن
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleSignInLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleSignInLoading ? 'جاري التسجيل...' : 'ابدأ مجانا'}
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>تسجيل مجاني</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>بدء فوري</span>
                </div>
              </div>
            </div>
          </FloatingElement>
        </div>
      </section>

      {showScrollTop && (
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5 -rotate-90" />
          </button>
        </div>
      )}

    </MainLayout>
    <MainFooter logo={'/logo.png'} pages={footerPages} socialMedia={socialMedia} />
    </>
  );
};

export default TravelProviderLanding;