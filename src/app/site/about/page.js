import AboutHero from '@/components/Templates/Main/AboutHero'
import MainHero from '@/components/Templates/Main/MainHero'
import React from 'react'

function page() {
  return (
    <div>
      <AboutHero img={"/0x0.webp"} title={"من نحن"}/>
      
      <div>
        
        {/* Main Content */}
        <div className="prose prose-lg max-w-none mt-8 px-4">
          
          <div className="mb-16">
            <p className="text-xl text-gray-800 leading-relaxed text-right mb-8">
              في رحلة ناو، نؤمن أن التخطيط للرحلات لا يجب أن يكون معقدًا أو مملًا.<br/> سواء قررت الانطلاق في مغامرة مفاجئة أو كنت تبحث عن تجربة مميزة لقضاء عطلة نهاية الأسبوع، نحن نوفر لك كل ما تحتاجه في مكان واحد.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 text-right mb-6">
              احجز رحلتك الآن... لا تنتظر الغد!
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-right">
              مع رحلة ناو، يمكنك بسهولة تصفّح عشرات الرحلات المتنوعة في أي وقت يناسبك، والاختيار من بين أفضل التجارب المصنّفة حسب تقييمات المستخدمين. لا حاجة للاتصال أو الانتظار – احجز رحلتك الآن بضغطة زر، وانطلق.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 text-right mb-8">
              لماذا تختار رحلة ناو؟
            </h2>
            
            <div className="space-y-6">
              <div className="text-right">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-medium text-gray-900">تصفح سريع وسهل:</span> ابحث عن الرحلات حسب الموقع، النوع، أو التقييم.
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-medium text-gray-900">شركاء معتمدين:</span> جميع الرحلات مقدّمة من شركاء معتمدين وبتقييمات حقيقية من مستخدمين سبقوك.
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-medium text-gray-900">احجز متى تشاء:</span> سواء كنت تخطّط مسبقًا أو تبحث عن رحلة اللحظة الأخيرة، نحن هنا لخدمتك.
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-medium text-gray-900">منصة مريحة:</span> تصفّح واحجز وادفع بسهولة عبر الموقع أو من خلال هاتفك.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 text-right mb-6">
              رسالتنا
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-right">
              نحن هنا لنمنحك حرية الانطلاق وقتما تشاء. هدفنا هو جعل كل رحلة تجربة لا تُنسى، تبدأ بسهولة من لحظة الحجز وحتى نهاية المغامرة.
            </p>
          </div>

          <div className="text-center">
            <a href="/" className="inline-block bg-tripmo-500 rounded-md text-white px-8 py-3 text-lg font-medium hover:bg-blue-700 transition-colors">
              ابدأ رحلتك الآن
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default page