import React, { useState } from 'react';
import { Calendar, Clock, Phone, User, Tag, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

function BookingRecord({ bookData, type = 0 }) {
  const [expanded, setExpanded] = useState(false);

  // Format date to be more readable
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format status with appropriate Arabic translations
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { text: 'نشط', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
      case 'canceled':
        return { text: 'ملغي', color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertCircle };
      case 'pending':
        return { text: 'بانتظار الدفع', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertCircle };
      case 'client_confirmed':
        return { text: 'بانتظار تاكيد الدفع', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertCircle };
      default:
        return { text: status, color: 'text-gray-600', bgColor: 'bg-gray-100', icon: AlertCircle };
    }
  };

  const statusInfo = getStatusInfo(bookData.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div onClick={() => setExpanded(!expanded)} className="bg-white cursor-pointer rounded-lg shadow-sm p-4 mx-auto border border-gray-100 font-sans" dir="rtl">
      {/* Main compact view - always visible */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${bookData.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-bold text-gray-800">#{bookData.id}</span>
          <span className="text-sm text-gray-500">|</span>
          <span className="text-sm font-medium">{bookData.trips.name}</span>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-expanded={expanded}
          aria-label={expanded ? "عرض أقل" : "عرض المزيد"}
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Essential info row - always visible */}
      <div className="mt-3 flex justify-between items-center text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <User className="ml-1 text-gray-500" size={16} />
            <span>{bookData.client_name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="ml-1 text-gray-500" size={16} />
            <span>{formatDate(bookData.day)}</span>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color} flex items-center`}>
          <StatusIcon className="ml-1 w-3 h-3" />
          {statusInfo.text}
        </div>
      </div>

      {/* Expandable section */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-sm">
          {/* Contact and booking details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
            <div className="bg-gray-50 rounded-md p-2 flex items-center">
              <Phone className="ml-1 text-gray-500" size={16} />
              <a href={`tel:${bookData.client_phone}`} className="text-blue-600 hover:underline">
                {bookData.client_phone}
              </a>
            </div>
            
            <div className="bg-gray-50 rounded-md p-2 flex items-center">
              <User className="ml-1 text-gray-500" size={16} />
              <div>
                <span className="text-gray-700">{bookData.persons} فرد</span>
              </div>
            </div>
            
            {/* Add more essential details as needed */}
          </div>

          {/* Financial information */}
          {(bookData.total_price !== null || bookData.deposite_price !== null) && (
            <div className="flex flex-wrap gap-3 mb-3">
              {bookData.total_price !== null && (
                <div className="bg-gray-50 rounded-md p-2 flex items-center">
                  <Tag className="ml-1 text-gray-500" size={16} />
                  <div>
                    <span className="text-xs text-gray-500 ml-1">السعر:</span>
                    <span className="text-gray-700">{bookData.total_price} ج.م</span>
                  </div>
                </div>
              )}
              
              {bookData.deposite_price !== null && (
                <div className="bg-gray-50 rounded-md p-2 flex items-center">
                  <Tag className="ml-1 text-gray-500" size={16} />
                  <div>
                    <span className="text-xs text-gray-500 ml-1">المدفوع:</span>
                    <span className="text-gray-700">{bookData.deposite_price} ج.م</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Creation timestamp */}
          {type !== 1 && (
            <div className="text-xs text-gray-400 flex items-center">
              <Clock size={12} className="ml-1" />
              <span>تم إنشاء الحجز في: {new Date(bookData.created_at).toLocaleString('ar-EG')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingRecord;