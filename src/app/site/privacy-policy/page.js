export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div>
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              سياسة الخصوصية
            </h1>
            <p className="text-gray-600">
              لمستخدمي موقع "رحلة ناو"
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              نحن في "رحلة ناو" نولي أهمية كبيرة لخصوصيتك، ونعمل على حماية بياناتك بكل الوسائل الممكنة. توضح هذه السياسة كيفية جمع بياناتك الشخصية واستخدامها ومشاركتها.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Section 1: Data Collected */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              1. البيانات التي نقوم بجمعها
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              <li>الاسم ومعلومات الاتصال مثل البريد الإلكتروني ورقم الهاتف.</li>
              <li>معلومات الحجز مثل الوجهات والتواريخ وعدد الأفراد.</li>
              <li>بيانات الدفع التي يتم توفيرها عند إتمام الحجز.</li>
              <li>البيانات التقنية مثل عنوان IP ونوع المتصفح والجهاز.</li>
            </ul>
          </section>

          {/* Section 2: Purpose of Data Use */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              2. كيفية استخدام البيانات
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              <li>إتمام عمليات الحجز والتواصل مع المستخدمين.</li>
              <li>تحسين جودة الخدمات وتجربة المستخدم.</li>
              <li>إرسال إشعارات أو عروض ترويجية (بموافقة المستخدم).</li>
              <li>منع الأنشطة الاحتيالية أو غير القانونية.</li>
            </ul>
          </section>

          {/* Section 3: Sharing Information */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              3. مشاركة المعلومات مع أطراف ثالثة
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              نحن لا نبيع أو نؤجر بياناتك الشخصية لأي جهة خارجية. قد نشارك البيانات فقط مع:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              <li>مزودي الرحلات لتنفيذ الحجز.</li>
              <li>جهات الدفع لتأكيد المعاملات المالية.</li>
              <li>السلطات القانونية عند الحاجة والطلب الرسمي.</li>
            </ul>
          </section>

          {/* Section 4: Data Security */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              4. حماية البيانات
            </h2>
            <p className="text-gray-700 leading-relaxed">
              نعتمد على إجراءات أمنية تقنية وتنظيمية لحماية بياناتك من الوصول أو التعديل أو الاستخدام غير المصرح به.
            </p>
          </section>

          {/* Section 5: Cookies */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              5. ملفات تعريف الارتباط (Cookies)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              يستخدم موقعنا ملفات تعريف الارتباط لتحسين الأداء وتقديم محتوى مخصص. يمكنك تغيير إعدادات المتصفح لتعطيل الكوكيز، لكن هذا قد يؤثر على تجربتك.
            </p>
          </section>

          {/* Section 6: User Rights */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              6. حقوق المستخدم
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              <li>الحق في معرفة البيانات التي نحتفظ بها عنك.</li>
              <li>الحق في تصحيح أو حذف بياناتك.</li>
              <li>الحق في سحب الموافقة على استخدام بياناتك في أي وقت.</li>
            </ul>
          </section>

          {/* Section 7: Policy Updates */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              7. التعديلات على سياسة الخصوصية
            </h2>
            <p className="text-gray-700 leading-relaxed">
              نحتفظ بالحق في تعديل هذه السياسة في أي وقت. سيتم نشر التعديلات على هذه الصفحة مع تحديث تاريخ السريان.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
