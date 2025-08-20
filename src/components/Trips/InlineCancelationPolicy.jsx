import { CheckCircle, Clock, Shield, XCircle } from "lucide-react";

// Compact inline version
const InlineCancelationPolicy = ({ policy, locale }) => {
  const getPolicyContent = () => {
    switch (policy?.type) {
      case 'no_refund':
        return {
          icon: <XCircle className="w-3 h-3 text-red-600" />,
          text: locale === 'ar' ? 'غير قابل للإلغاء' : 'Non-refundable',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      
      case 'refund_until': {
        let textValue;
        if (policy.until > 25) {
          const days = Math.floor(policy.until / 24);
          textValue =
            locale === 'ar'
              ? `إلغاء مجاني قبل ${days} يوم${days > 1 ? '' : ''} من يوم الرحلة`
              : `Free cancellation until ${days} day${days > 1 ? 's' : ''} before the trip`;
        } else {
          textValue =
            locale === 'ar'
              ? `إلغاء مجاني قبل ${policy.until} س من يوم الرحلة`
              : `Free cancellation until ${policy.until}h before the trip`;
        }

        return {
          icon: <Clock className="w-3 h-3 text-green-600" />,
          text: textValue,
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      }
      
      case 'refund':
        return {
          icon: <CheckCircle className="w-3 h-3 text-green-600" />,
          text: locale === 'ar'
            ? 'إلغاء مجاني قبل يوم الرحلة'
            : 'Free cancellation before the trip day',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      
      default:
        return {
          icon: <Shield className="w-3 h-3 text-gray-600" />,
          text: locale === 'ar' ? 'سياسة غير محددة' : 'Unspecified policy',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const content = getPolicyContent();

  if (policy?.type === 'no_refund') {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${content.borderColor} ${content.bgColor}`}>
      {content.icon}
      <span className={`text-sm font-bold ${content.textColor}`}>
        {content.text}
      </span>
    </div>
  );
};

export default InlineCancelationPolicy;
