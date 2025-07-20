import AboutHero from '@/components/Templates/Main/AboutHero';
import React from 'react';

function page({ params }) {
  const locale = params.locale;

  return (
    <div>
      <AboutHero img="/0x0.webp" title={locale === 'en' ? 'About Us' : 'من نحن'} />

      <div>
        {/* Main Content */}
        <div className="prose prose-lg max-w-none mt-8 px-4">
          {locale === 'en' ? (
            <>
              <div className="mb-16">
                <p className="text-xl text-gray-800 leading-relaxed mb-8">
                  At Rehla Now, we believe that trip planning shouldn’t be complicated or boring. <br />
                  Whether you're embarking on a spontaneous adventure or planning a memorable weekend getaway, we provide everything you need in one place.
                </p>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Book your trip now... don't wait for tomorrow!
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  With Rehla Now, you can easily browse dozens of unique trips anytime, choose from top-rated experiences based on user reviews, and book instantly—no need for phone calls or waiting.
                </p>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8">
                  Why choose Rehla Now?
                </h2>

                <div className="space-y-6">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Fast & Easy Browsing:</span> Find trips by location, category, or rating.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Trusted Partners:</span> All trips are provided by verified partners with real user reviews.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Book Anytime:</span> Whether you're planning ahead or booking last minute, we've got you covered.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">Seamless Platform:</span> Browse, book, and pay easily via our website or your phone.
                  </p>
                </div>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We're here to give you the freedom to travel whenever you want. Our goal is to make every trip unforgettable—from the moment you book until your adventure ends.
                </p>
              </div>

              <div className="text-center">
                <a href="/" className="inline-block bg-tripmo-500 rounded-md text-white px-8 py-3 text-lg font-medium hover:bg-blue-700 transition-colors">
                  Start your journey now
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="mb-16">
                <p className="text-xl text-gray-800 leading-relaxed text-right mb-8">
                  في رحلة ناو، نؤمن أن التخطيط للرحلات لا يجب أن يكون معقدًا أو مملًا.<br /> سواء قررت الانطلاق في مغامرة مفاجئة أو كنت تبحث عن تجربة مميزة لقضاء عطلة نهاية الأسبوع، نحن نوفر لك كل ما تحتاجه في مكان واحد.
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

                <div className="space-y-6 text-right">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">تصفح سريع وسهل:</span> ابحث عن الرحلات حسب الموقع، النوع، أو التقييم.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">شركاء معتمدين:</span> جميع الرحلات مقدّمة من شركاء معتمدين وبتقييمات حقيقية من مستخدمين سبقوك.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">احجز متى تشاء:</span> سواء كنت تخطّط مسبقًا أو تبحث عن رحلة اللحظة الأخيرة، نحن هنا لخدمتك.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <span className="font-medium text-gray-900">منصة مريحة:</span> تصفّح واحجز وادفع بسهولة عبر الموقع أو من خلال هاتفك.
                  </p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
