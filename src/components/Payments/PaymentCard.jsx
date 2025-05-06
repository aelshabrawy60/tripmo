import React, { useState } from 'react';
import { Check, Clock, AlertCircle, CreditCard, ArrowRight, Receipt } from 'lucide-react';

function PaymentCard({ paymentData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format amount to display currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  // Get status display info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'client_confirmed':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          bgHover: 'hover:bg-amber-50',
          icon: <Clock size={18} className="ml-2" />,
          text: 'بانتظار التأكيد'
        };
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          bgHover: 'hover:bg-green-50',
          icon: <Check size={18} className="ml-2" />,
          text: 'تم التأكيد'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          bgHover: 'hover:bg-red-50',
          icon: <AlertCircle size={18} className="ml-2" />,
          text: 'مرفوض'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          bgHover: 'hover:bg-gray-50',
          icon: <CreditCard size={18} className="ml-2" />,
          text: status
        };
    }
  };

  const statusInfo = getStatusInfo(paymentData.status);

  async function confirmPayment(bookId) {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dashboard/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      });
      
      if (!response.ok) {
        throw new Error(`فشل تأكيد الدفع: ${response.status}`);
      }
      
      setSuccess(true);
      // You might want to refresh payment data here or trigger a parent component refresh
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-0 border border-gray-200 transition-all duration-300 ${statusInfo.bgHover} ${expanded ? 'shadow-lg' : ''}`}>
      {/* Main Card Content - Always Visible */}
      <div 
        className="p-3 md:p-4 cursor-pointer flex flex-col"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {/* Left Side - Payment Info */}
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${statusInfo.color.split(' ')[0]} ml-3`}>
              <Receipt size={20} className="text-gray-700" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-bold text-lg text-gray-900 ml-1 rtl:text-right">
                  {formatAmount(paymentData.amount)}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {paymentData.type}
                </span>
              </div>
              <span className="text-sm text-gray-500">{formatDate(paymentData.created_at)}</span>
            </div>
          </div>

          {/* Right Side - Status */}
          <div className="flex items-center">
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${statusInfo.color} shadow-sm border`}>
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </div>
            <button 
              className={`p-1 ml-1 text-gray-400 transition-transform duration-300 ${expanded ? 'transform rotate-90' : ''}`}
              aria-label={expanded ? "عرض تفاصيل أقل" : "عرض المزيد من التفاصيل"}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top Row - Icon, Amount and Expand Button */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${statusInfo.color.split(' ')[0]} ml-2`}>
                <Receipt size={16} className="text-gray-700" />
              </div>
              <span className="font-bold text-base text-gray-900 rtl:text-right">
                {formatAmount(paymentData.amount)}
              </span>
            </div>
            <button 
              className={`p-1 text-gray-400 transition-transform duration-300 ${expanded ? 'transform rotate-90' : ''}`}
              aria-label={expanded ? "عرض تفاصيل أقل" : "عرض المزيد من التفاصيل"}
            >
              <ArrowRight size={16} />
            </button>
          </div>
          
          {/* Second Row - Payment Type and Date */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {paymentData.type}
            </span>
            <span className="text-xs text-gray-500">{formatDate(paymentData.created_at)}</span>
          </div>
          
          {/* Third Row - Status */}
          <div className="flex justify-end">
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color} shadow-sm border`}>
              {statusInfo.icon}
              <span>{statusInfo.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-3 md:px-4 pb-4 pt-0 border-t border-gray-100">
          <div className="flex flex-col space-y-3">
            <div className="bg-gray-50 p-3 rounded-md text-right">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <span className="text-sm text-gray-500 mb-1 md:mb-0">رقم الحجز:</span>
                <span className="text-sm font-semibold">{paymentData.book_id}</span>
              </div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="text-sm text-gray-500 mb-1 md:mb-0">طريقة الدفع:</span>
                <span className="text-sm font-semibold">{paymentData.type}</span>
              </div>
            </div>
            
            {/* Error and Success Messages */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 md:p-3 rounded border border-red-100 flex items-center">
                <AlertCircle size={16} className="ml-2 flex-shrink-0" /> 
                <span className="text-xs md:text-sm">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-2 md:p-3 rounded border border-green-100 flex items-center">
                <Check size={16} className="ml-2 flex-shrink-0" /> 
                <span className="text-xs md:text-sm">تم تأكيد الدفع بنجاح</span>
              </div>
            )}
            
            {/* Confirm Payment Button */}
            {paymentData.status === "client_confirmed" && !success && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  confirmPayment(paymentData.book_id);
                }}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 md:py-2.5 px-4 rounded-md transition-colors duration-300 flex items-center justify-center disabled:bg-green-300 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm md:text-base">جاري التأكيد...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Check size={16} className="ml-2" />
                    <span className="text-sm md:text-base">تأكيد الدفع</span>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentCard;