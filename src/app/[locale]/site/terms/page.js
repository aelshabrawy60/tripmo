export default function TermsAndConditions({ params }) {
  const locale = params.locale;
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div>
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isArabic ? "الشروط والأحكام" : "Terms and Conditions"}
            </h1>
            <p className="text-gray-600">
              {isArabic ? 'لمستخدمي موقع "رحلة ناو"' : 'For users of "Rehla Now"'}
            </p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              {isArabic
                ? 'مرحبًا بك في "رحلة ناو" (Rehla Now). باستخدامك للموقع، فإنك توافق على هذه الشروط والأحكام، لذا يرجى قراءتها بعناية.'
                : 'Welcome to "Rehla Now". By using this website, you agree to these terms and conditions, so please read them carefully.'}
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
              {isArabic ? "1. تعريفات" : "1. Definitions"}
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-900">
                  {isArabic ? "الموقع:" : "Website:"}
                </span>
                <span className="text-gray-700 ml-2">
                  {isArabic ? 'منصة "رحلة ناو" الإلكترونية.' : 'The "Rehla Now" online platform.'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {isArabic ? "المستخدم:" : "User:"}
                </span>
                <span className="text-gray-700 ml-2">
                  {isArabic ? "أي شخص يقوم بتصفح الموقع أو إجراء حجز من خلاله." : "Anyone browsing the site or making a booking."}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {isArabic ? "مقدم الخدمة:" : "Service Provider:"}
                </span>
                <span className="text-gray-700 ml-2">
                  {isArabic ? "شركة أو فرد يعرض رحلاته وخدماته على المنصة." : "A company or individual offering trips or services on the platform."}
                </span>
              </div>
            </div>
          </section>

          {/* Section 2: Platform Nature */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {isArabic ? "2. طبيعة عمل المنصة" : "2. Nature of the Platform"}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {isArabic
                  ? '"رحلة ناو" تعمل كوسيط إلكتروني بين المستخدمين ومقدمي خدمات الرحلات، ولا تملك أو تدير أي من الرحلات المعروضة على الموقع.'
                  : '"Rehla Now" acts as a digital intermediary between users and trip providers, and does not own or operate any of the listed trips.'}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {isArabic
                  ? "جميع تفاصيل الرحلة، بما في ذلك الأسعار والمواعيد وسياسات الإلغاء، مقدّمة من طرف مزود الخدمة."
                  : "All trip details, including prices, schedules, and cancellation policies, are provided by the service provider."}
              </p>
            </div>
          </section>

          {/* Section 3: User Responsibility */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {isArabic ? "3. مسؤولية المستخدم" : "3. User Responsibility"}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isArabic
                ? "يتحمل المستخدم مسؤولية قراءة جميع تفاصيل الرحلة وشروطها قبل إتمام الحجز."
                : "The user is responsible for reading all trip details and terms before completing a booking."}
            </p>
          </section>

          {/* Section 4: Cancellation Policy */}
          <section className="mb-12" id="cancellation-policy">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {isArabic ? "4. سياسة الإلغاء والاسترداد" : "4. Cancellation and Refund Policy"}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {isArabic
                  ? "تخضع كل رحلة منشورة على المنصة لسياسة إلغاء واسترداد محددة من قبل مقدم الخدمة..."
                  : "Each trip published on the platform is subject to a specific cancellation and refund policy provided by the service provider..."}
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>
                  <strong>{isArabic ? "غير قابل للاسترداد:" : "Non-refundable:"}</strong>{" "}
                  {isArabic
                    ? "لا يُسمح باسترداد أي مبالغ مدفوعة في حال إلغاء الحجز من قبل العميل لأي سبب كان."
                    : "No refunds will be issued if the user cancels the booking for any reason."}
                </li>
                <li>
                  <strong>
                    {isArabic
                      ? "إلغاء مجاني قبل مدة محددة من موعد بدء يوم الرحلة:"
                      : "Free cancellation within a defined time before the trip day:"}
                  </strong>{" "}
                  {isArabic
                    ? "يمكن للعميل استرداد المبلغ كاملاً بشرط الإلغاء قبل الوقت المحدد."
                    : "Customers may cancel and receive a full refund if done within a specified time before the trip."}
                </li>
                <li>
                  <strong>
                    {isArabic
                      ? "إلغاء مجاني حتى موعد بدء يوم الرحلة:"
                      : "Free cancellation up to the day of the trip:"}
                  </strong>{" "}
                  {isArabic
                    ? "يحق للعميل الإلغاء واسترداد المبلغ بالكامل في أي وقت قبل بدء يوم الرحلة."
                    : "Customers can cancel and receive a full refund anytime before the trip starts."}
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                {isArabic
                  ? "لا تضمن المنصة استرداد أي مبالغ إذا لم تسمح سياسة مقدم الخدمة بذلك."
                  : "The platform does not guarantee any refunds if the service provider's policy does not allow it."}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {isArabic
                  ? "قد تستغرق عملية الاسترداد من 2 إلى 14 يومًا حسب البنك."
                  : "Refunds, once approved, may take 2 to 14 days depending on the user's bank."}
              </p>
            </div>
          </section>

          {/* Section 5: Liability Limits */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {isArabic ? "5. حدود المسؤولية" : "5. Liability Limits"}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isArabic
                ? 'لا تتحمل "رحلة ناو" أي مسؤولية مباشرة عن جودة أو تنفيذ الرحلة.'
                : '"Rehla Now" is not directly responsible for the quality or execution of any trip.'}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {isArabic
                ? "نقتصر على تسهيل الحجز والدفع وتقديم الدعم في حال الشكاوى."
                : "We only facilitate booking, payment, and provide support in case of complaints."}
            </p>
          </section>

          {/* Section 6: Modifications */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {isArabic ? "6. التعديلات" : "6. Modifications"}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isArabic
                ? 'تحتفظ "رحلة ناو" بحق تعديل هذه الشروط دون إشعار مسبق.'
                : '"Rehla Now" reserves the right to modify these terms at any time without prior notice.'}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {isArabic
                ? "يُعتبر استمرار استخدامك للموقع موافقة على التعديلات."
                : "Continued use of the platform constitutes acceptance of the changes."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
