export default function ServiceProviderTerms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              الشروط والأحكام الخاصة بمقدمي الخدمة
            </h1>
            <p className="text-gray-600">
              في "رحلة ناو"
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              مرحبًا بك كمزود خدمة في منصة "رحلة ناو". باستخدامك للمنصة ، فإنك توافق على الشروط التالية، والتي تنظم العلاقة بينك وبين المنصة:
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
                <span className="font-medium text-gray-900">المنصة:</span>
                <span className="text-gray-700 mr-2">موقع "رحلة ناو" الإلكتروني.</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">مقدم الخدمة:</span>
                <span className="text-gray-700 mr-2">أي جهة أو فرد يقوم بنشر رحلات أو خدمات سياحية على المنصة.</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">العميل:</span>
                <span className="text-gray-700 mr-2">الشخص الذي يقوم بالحجز من خلال المنصة.</span>
              </div>
            </div>
          </section>

          {/* Section 2: Service Provider Responsibility */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              2. مسؤولية مقدم الخدمة
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                يلتزم مقدم الخدمة بتوفير معلومات صحيحة وكاملة عن الرحلة (الوصف، المدة، الموعد، السعر، سياسة الإلغاء).
              </p>
              <p className="text-gray-700 leading-relaxed">
                يلتزم بتنفيذ الرحلة بجودة مناسبة في الوقت المحدد، كما هو موضح في تفاصيلها.
              </p>
              <p className="text-gray-700 leading-relaxed">
                يتحمل كامل المسؤولية في حال حدوث إلغاء مفاجئ أو تقصير في تقديم الخدمة.
              </p>
              <p className="text-gray-700 leading-relaxed">
                لا يجوز لمقدم الخدمة مطالبة العميل بأي مبالغ إضافية تزيد عن السعر المعلن للتجربة أو الرحلة بعد إتمام الحجز. يكون مقدم الخدمة مسؤولًا عن جميع التكاليف والمصاريف اللازمة لتنفيذ الخدمة، ولا يجوز تحميل العميل أي زيادات على هذه التكاليف. يجب توضيح أي خيارات إضافية تتطلب دفعًا إضافيًا مسبقًا في تفاصيل الرحلة بشكل واضح.
              </p>
            </div>
          </section>


          {/* Section 3: Payment and Collection Policy */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              3. سياسة الدفع والتحصيل
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                العمولة المستحقة لصالح منصة "رحلة ناو" هي بنسبة <strong>20%</strong> من قيمة كل حجز.
              </p>
              <p className="text-gray-700 leading-relaxed">
                يتم خصم العمولة تلقائيًا من المبلغ المدفوع من قبل العميل.
              </p>
              <p className="text-gray-700 leading-relaxed">
                يتم احتساب <strong>الرصيد القابل للسحب</strong> بناءً على الشرط التالي:
              </p>
              <div className="mr-6 space-y-2">
                <p className="text-gray-700 leading-relaxed">
                  يجب أن يمر <strong>يوم واحد على الأقل من موعد الرحلة</strong>.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  ويجب أن يكون قد مر <strong>3 أيام على الأقل من تاريخ الدفع من العميل</strong>.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                بعد توفر الرصيد القابل للسحب، يمكن لمزود الخدمة سحب أرباحه إلى حسابه البنكي أو محفظته الإلكترونية.
              </p>
            </div>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              4. الملكية الفكرية
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                يحتفظ مقدم الخدمة بحقوق الصور والمحتوى الذي يرفعه، بشرط ألا ينتهك حقوق أطراف أخرى.
              </p>
              <p className="text-gray-700 leading-relaxed">
                يحق للمنصة استخدام هذا المحتوى في التسويق ضمن المنصة دون إذن إضافي.
              </p>
            </div>
          </section>

          {/* Section 6: Termination of Cooperation */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              5. إنهاء التعاون
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                يمكن لأي طرف إنهاء العلاقة في أي وقت عبر إشعار كتابي.
              </p>
              <p className="text-gray-700 leading-relaxed">
                المنصة تحتفظ بالحق في إغلاق حساب أي مزود خدمة يخالف السياسات أو يسيء استخدام المنصة.
              </p>
            </div>
          </section>


          {/* Section 8: Agreement */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              6. الموافقة
            </h2>
            <p className="text-gray-700 leading-relaxed">
              باستخدامك للمنصة وإنشاء حساب كمزود خدمة، فأنت توافق على الالتزام الكامل بهذه الشروط والأحكام دون تحفظ.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-500 text-center">
              © 2025 رحلة ناو - جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}