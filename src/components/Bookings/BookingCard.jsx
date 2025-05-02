import React from 'react';
import { Calendar, Clock, Phone, User, Tag, CheckCircle, AlertCircle } from 'lucide-react';

function BookingCard({ bookData , type = 0}) {
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
      case 'cancelled':
        return { text: 'ملغي', color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'completed':
        return { text: 'مكتمل', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      default:
        return { text: status, color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const statusInfo = getStatusInfo(bookData.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mx-auto font-sans">
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
                    <User className="ml-2 text-gray-500" size={18} />
                    <div>
                    <span className="block text-sm text-gray-500">عدد الأفراد</span>
                    <span className="font-medium text-gray-700">{bookData.persons} فرد</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;