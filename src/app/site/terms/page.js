export default function TermsAndConditions() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              الشروط والأحكام
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
              مرحبًا بك في "رحلة ناو" (Rehla Now). باستخدامك للموقع، فإنك توافق على هذه الشروط والأحكام، لذا يرجى قراءتها بعناية.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Section 1: Definitions */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              1. تعريفات
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-900">الموقع:</span>
                <span className="text-gray-700 mr-2">منصة "رحلة ناو" الإلكترونية.</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">المستخدم:</span>
                <span className="text-gray-700 mr-2">أي شخص يقوم بتصفح الموقع أو إجراء حجز من خلاله.</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">مقدم الخدمة:</span>
                <span className="text-gray-700 mr-2">شركة أو فرد يعرض رحلاته وخدماته على المنصة.</span>
              </div>
            </div>
          </section>

          {/* Section 2: Platform Nature */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              2. طبيعة عمل المنصة
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                "رحلة ناو" تعمل كوسيط إلكتروني بين المستخدمين ومقدمي خدمات الرحلات، ولا تملك أو تدير أي من الرحلات المعروضة على الموقع.
              </p>
              <p className="text-gray-700 leading-relaxed">
                جميع تفاصيل الرحلة، بما في ذلك الأسعار والمواعيد وسياسات الإلغاء، مقدّمة من طرف مزود الخدمة.
              </p>
            </div>
          </section>

          {/* Section 3: User Responsibility */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              3. مسؤولية المستخدم
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                يتحمل المستخدم مسؤولية قراءة جميع تفاصيل الرحلة وشروطها قبل إتمام الحجز.
              </p>
            </div>
          </section>

          {/* Section 4: Cancellation Policy */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              4. سياسة الإلغاء والاسترداد
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                كل رحلة لها سياسة إلغاء واسترداد خاصة بها، تكون مذكورة داخل تفاصيل الرحلة نفسها.
              </p>
              <p className="text-gray-700 leading-relaxed">
                عند الحجز، فإن المستخدم يوافق على سياسة الإلغاء الخاصة بتلك الرحلة دون أي اعتراض لاحق.
              </p>
              <p className="text-gray-700 leading-relaxed">
                المنصة لا تضمن استرداد المبلغ إذا كانت سياسة مقدم الخدمة تمنع ذلك.
              </p>
            </div>
          </section>

          {/* Section 5: Liability Limits */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              5. حدود المسؤولية
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                لا تتحمل "رحلة ناو" أي مسؤولية مباشرة عن جودة أو تنفيذ الرحلة الفعلية.
              </p>
              <p className="text-gray-700 leading-relaxed">
                دورنا يقتصر على تسهيل عملية الحجز والدفع، وتقديم الدعم في حال وجود شكاوى.
              </p>
            </div>
          </section>

          {/* Section 6: Modifications */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              6. التعديلات
            </h2>
            <p className="text-gray-700 leading-relaxed">
              تحتفظ "رحلة ناو" بحق تعديل هذه الشروط في أي وقت دون إشعار مسبق. ويُعتبر استمرار استخدامك للموقع موافقة ضمنية على التعديلات.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}