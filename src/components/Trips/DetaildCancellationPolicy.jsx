const DetailedCancelationPolicy = ({ policy, locale }) => {
  const getPolicyContent = () => {
    switch (policy?.type) {
      case "no_refund":
        return {
          title: locale === "ar" ? "غير قابل للإلغاء" : "Non-refundable",
          description:
            locale === "ar"
              ? "لا يمكن إلغاء هذه الرحلة بعد الحجز، ولن يتم استرداد أي مبلغ. يُرجى التأكد من خططك قبل إتمام الحجز."
              : "This trip cannot be canceled once booked, and no refund will be issued. Please make sure your plans are certain before booking.",
        };

      case "refund_until": {
        let description;
        if (policy.until > 25) {
          const days = Math.floor(policy.until / 24);
          description =
            locale === "ar"
              ? `يمكنك إلغاء الحجز واسترداد المبلغ كاملًا إذا تم الإلغاء قبل ${days} يوم${days > 1 ? "" : ""} من يوم بدء الرحلة. بعد هذا الوقت، لن يكون هناك استرداد.`
              : `You can cancel your booking and receive a full refund if cancellation is made at least ${days} day${days > 1 ? "s" : ""} before the trip day begins. No refunds are available after this time.`;
        } else {
          description =
            locale === "ar"
              ? `يمكنك إلغاء الحجز واسترداد المبلغ كاملًا إذا تم الإلغاء قبل ${policy.until} ساعة من يوم بدء الرحلة. بعد هذا الوقت، لن يكون هناك استرداد.`
              : `You can cancel your booking and receive a full refund if cancellation is made at least ${policy.until} hours before the trip day begins. No refunds are available after this time.`;
        }

        return {
          title:
            locale === "ar"
              ? "إلغاء مجاني حتى وقت محدد قبل الرحلة"
              : "Free cancellation up to a specific time before the trip",
          description,
        };
      }

      case "refund":
        return {
          title:
            locale === "ar"
              ? "إلغاء مجاني حتى يوم الرحلة"
              : "Free cancellation up to the day of the trip",
          description:
            locale === "ar"
              ? "يمكنك إلغاء الحجز في أي وقت قبل بدء يوم الرحلة واسترداد المبلغ كاملا."
              : "You may cancel your booking anytime before the start of the day of the trip and receive a full refund.",
        };

      default:
        return {
          title: locale === "ar" ? "سياسة إلغاء غير محددة" : "Unspecified Cancellation Policy",
          description:
            locale === "ar"
              ? "لم يتم تحديد سياسة الإلغاء لهذه الرحلة. يُرجى التواصل مع مزود الخدمة لمزيد من المعلومات."
              : "The cancellation policy for this trip has not been specified. Please contact the provider for further details.",
        };
    }
  };

  const content = getPolicyContent();

  return (
    <div>
      <p className="text-sm mt-2 leading-relaxed mb-4">{content.description}</p>

      <a
        href="/terms#cancellation-policy"
        className="text-sm underline underline-offset-4"
      >
        {locale === "en" ? "more" : "المزيد عن سياسة الإلغاء"}
      </a>
    </div>
  );
};

export default DetailedCancelationPolicy;
