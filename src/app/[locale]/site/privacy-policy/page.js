export default function PrivacyPolicy({ params }) {
  const locale = params.locale;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div>
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {locale === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </h1>
            <p className="text-gray-600">
              {locale === 'en' ? 'For Rehla Now users' : 'لمستخدمي موقع "رحلة ناو"'}
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              {locale === 'en'
                ? 'At Rehla Now, we value your privacy and are committed to protecting your data. This policy explains how we collect, use, and share your personal information.'
                : 'نحن في "رحلة ناو" نولي أهمية كبيرة لخصوصيتك، ونعمل على حماية بياناتك بكل الوسائل الممكنة. توضح هذه السياسة كيفية جمع بياناتك الشخصية واستخدامها ومشاركتها.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {locale === 'en' ? '1. Data We Collect' : '1. البيانات التي نقوم بجمعها'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              {locale === 'en' ? (
                <>
                  <li>Name and contact details such as email and phone number.</li>
                  <li>Booking information including destinations, dates, and number of travelers.</li>
                  <li>Payment details provided during booking.</li>
                  <li>Technical data like IP address, browser type, and device info.</li>
                </>
              ) : (
                <>
                  <li>الاسم ومعلومات الاتصال مثل البريد الإلكتروني ورقم الهاتف.</li>
                  <li>معلومات الحجز مثل الوجهات والتواريخ وعدد الأفراد.</li>
                  <li>بيانات الدفع التي يتم توفيرها عند إتمام الحجز.</li>
                  <li>البيانات التقنية مثل عنوان IP ونوع المتصفح والجهاز.</li>
                </>
              )}
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {locale === 'en' ? '2. How We Use Your Data' : '2. كيفية استخدام البيانات'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              {locale === 'en' ? (
                <>
                  <li>To complete bookings and communicate with users.</li>
                  <li>To improve service quality and user experience.</li>
                  <li>To send notifications or promotional offers (with user consent).</li>
                  <li>To prevent fraudulent or illegal activities.</li>
                </>
              ) : (
                <>
                  <li>إتمام عمليات الحجز والتواصل مع المستخدمين.</li>
                  <li>تحسين جودة الخدمات وتجربة المستخدم.</li>
                  <li>إرسال إشعارات أو عروض ترويجية (بموافقة المستخدم).</li>
                  <li>منع الأنشطة الاحتيالية أو غير القانونية.</li>
                </>
              )}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {locale === 'en' ? '3. Sharing Information with Third Parties' : '3. مشاركة المعلومات مع أطراف ثالثة'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {locale === 'en'
                ? 'We do not sell or rent your personal data to third parties. We may share data only with:'
                : 'نحن لا نبيع أو نؤجر بياناتك الشخصية لأي جهة خارجية. قد نشارك البيانات فقط مع:'}
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              {locale === 'en' ? (
                <>
                  <li>Trip providers to complete bookings.</li>
                  <li>Payment gateways for transaction processing.</li>
                  <li>Legal authorities when required by law.</li>
                </>
              ) : (
                <>
                  <li>مزودي الرحلات لتنفيذ الحجز.</li>
                  <li>جهات الدفع لتأكيد المعاملات المالية.</li>
                  <li>السلطات القانونية عند الحاجة والطلب الرسمي.</li>
                </>
              )}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {locale === 'en' ? '4. Data Protection' : '4. حماية البيانات'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {locale === 'en'
                ? 'We implement technical and organizational security measures to protect your data from unauthorized access, modification, or misuse.'
                : 'نعتمد على إجراءات أمنية تقنية وتنظيمية لحماية بياناتك من الوصول أو التعديل أو الاستخدام غير المصرح به.'}
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {locale === 'en' ? '5. Cookies' : '5. ملفات تعريف الارتباط (Cookies)'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {locale === 'en'
                ? 'We use cookies to enhance performance and deliver personalized content. You can change your browser settings to disable cookies, though this may impact your experience.'
                : 'يستخدم موقعنا ملفات تعريف الارتباط لتحسين الأداء وتقديم محتوى مخصص. يمكنك تغيير إعدادات المتصفح لتعطيل الكوكيز، لكن هذا قد يؤثر على تجربتك.'}
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {locale === 'en' ? '6. User Rights' : '6. حقوق المستخدم'}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              {locale === 'en' ? (
                <>
                  <li>The right to know what data we hold about you.</li>
                  <li>The right to correct or delete your data.</li>
                  <li>The right to withdraw consent at any time.</li>
                </>
              ) : (
                <>
                  <li>الحق في معرفة البيانات التي نحتفظ بها عنك.</li>
                  <li>الحق في تصحيح أو حذف بياناتك.</li>
                  <li>الحق في سحب الموافقة على استخدام بياناتك في أي وقت.</li>
                </>
              )}
            </ul>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {locale === 'en' ? '7. Changes to This Policy' : '7. التعديلات على سياسة الخصوصية'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {locale === 'en'
                ? 'We reserve the right to modify this policy at any time. Updates will be posted on this page with the effective date.'
                : 'نحتفظ بالحق في تعديل هذه السياسة في أي وقت. سيتم نشر التعديلات على هذه الصفحة مع تحديث تاريخ السريان.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
