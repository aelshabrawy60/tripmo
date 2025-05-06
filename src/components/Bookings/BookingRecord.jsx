import React from 'react';
import { Calendar, Clock, Phone, User, Tag, CheckCircle, AlertCircle } from 'lucide-react';

function BookingRecord({ bookData , type = 0}) {
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
        return { text: 'نشط', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'canceled':
        return { text: 'ملغي', color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'pending':
        return { text: 'بانتظار الدفع', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      case 'client_confirmed':
        return { text: 'بانتظار تاكيد الدفع', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
      default:
        return { text: status, color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const statusInfo = getStatusInfo(bookData.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mx-auto border border-gray-200 font-sans" dir="rtl">
      {/* Header with ID and status */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
        <div className="flex items-center">
          <span className="text-gray-500 ml-2">رقم الحجز:</span>
          <span className="font-bold text-gray-800">{bookData.id}#</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} flex items-center`}>
          {bookData.status === 'active' ? 
            <CheckCircle className="ml-1 w-4 h-4" /> : 
            <AlertCircle className="ml-1 w-4 h-4" />
          }
          {statusInfo.text}
        </div>
      </div>

      <div className='flex'>
        {/* Client information */}
        <div className="mb-4 w-full">
            <div className='flex flex-wrap gap-2'>
                <div className="bg-gray-50 rounded-lg p-4 flex-1">
                    <div className="flex items-center mb-2">
                        <User className="ml-2 text-gray-500" size={18} />
                        <span className="font-medium text-gray-700">{bookData.client_name}</span>
                    </div>
                    <div className="flex items-center">
                        <Phone className="ml-2 text-gray-500" size={18} />
                        <a href={`tel:${bookData.client_phone}`} className="font-medium text-blue-600 hover:underline">
                        {bookData.client_phone}
                        </a>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 flex items-center flex-1">
                    <Calendar className="ml-2 text-gray-500" size={18} />
                    <div>
                    <span className="block text-sm text-gray-500">تاريخ الحجز</span>
                    <span className="font-medium text-gray-700">{formatDate(bookData.day)}</span>
                    </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 flex items-center flex-1">
                    <User className="ml-2 text-gray-500" size={18} />
                    <div>
                    <span className="block text-sm text-gray-500">عدد الأفراد</span>
                    <span className="font-medium text-gray-700">{bookData.persons} فرد</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Financial information (if available) */}
      {(bookData.total_price !== null || bookData.deposite_price !== null) && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">المعلومات المالية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookData.total_price !== null && (
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <Tag className="ml-2 text-gray-500" size={18} />
                <div>
                  <span className="block text-sm text-gray-500">السعر الإجمالي</span>
                  <span className="font-medium text-gray-700">{bookData.total_price} ج.م</span>
                </div>
              </div>
            )}
            
            {bookData.deposite_price !== null && (
              <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                <Tag className="ml-2 text-gray-500" size={18} />
                <div>
                  <span className="block text-sm text-gray-500">مبلغ التأمين</span>
                  <span className="font-medium text-gray-700">{bookData.deposite_price} ج.م</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {type != 1 && (
        <div className="text-sm text-gray-500 mt-4 pt-3 border-t border-gray-200 flex items-center">
          <Clock size={16} className="ml-1" />
          <span>تم إنشاء الحجز في: {new Date(bookData.created_at).toLocaleString('ar-EG')}</span>
        </div>
      )}
      
    </div>
  );
}

export default BookingRecord;