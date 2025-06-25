import { CheckCircle, Clock, Shield, XCircle } from "lucide-react";

// Compact inline version
const InlineCancelationPolicy = ({ policy }) => {
  const getPolicyContent = () => {
    switch (policy?.type) {
      case 'no_refund':
        return {
          icon: <XCircle className="w-3 h-3 text-red-600" />,
          text: 'غير قابل للإلغاء',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      
      case 'refund_until':
        return {
          icon: <Clock className="w-3 h-3 text-green-600" />,
          text: `إلغاء مجاني قبل ${policy.until} س من يوم الرحلة`,
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      
      case 'refund':
        return {
          icon: <CheckCircle className="w-3 h-3 text-green-600" />,
          text: 'الغاء مجاني قبل يوم الرحلة',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      
      default:
        return {
          icon: <Shield className="w-3 h-3 text-gray-600" />,
          text: 'سياسة غير محددة',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const content = getPolicyContent();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border ${content.borderColor} ${content.bgColor}`}>
      {content.icon}
      <span className={`text-sm font-bold ${content.textColor}`}>
        {content.text}
      </span>
    </div>
  );
};

export default InlineCancelationPolicy