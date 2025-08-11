import React, { useState } from 'react';
import { Calendar, Clock, Phone, User, Tag, CheckCircle, AlertCircle, Trash2, Edit } from 'lucide-react';
import EditBooking from './EditBooking';

// DeleteBookingModal component
const DeleteBookingModal = ({ isOpen, onClose, onConfirm, bookingId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 p-4 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-right mb-4">تأكيد الحذف</h3>
        <p className="text-gray-700 text-right mb-6">
          هل أنت متأكد من رغبتك في حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            onClick={() => onConfirm(bookingId)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

function BookingCard({ bookData, type = 0, onDeleteBooking, onEditBooking, tripData }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // Helper function to format persons breakdown in Arabic
  const formatPersonsBreakdown = (personsTypes) => {
    if (!personsTypes) return '';
    
    const breakdown = [];
    if (personsTypes.adults && parseInt(personsTypes.adults) > 0) {
      breakdown.push(`${personsTypes.adults} بالغ${parseInt(personsTypes.adults) > 1 ? 'ين' : ''}`);
    }
    if (personsTypes.children && parseInt(personsTypes.children) > 0) {
      breakdown.push(`${personsTypes.children} طفل`);
    }
    if (personsTypes.infants && parseInt(personsTypes.infants) > 0) {
      breakdown.push(`${personsTypes.infants} رضيع`);
    }
    
    return breakdown.join(' • ');
  };

  const statusInfo = getStatusInfo(bookData.status);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/dashboard/bookings?bookingId=${bookData.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Call the parent component's handler to update UI
        if (onDeleteBooking) {
          onDeleteBooking(bookData.id);
        }
      } else {
        console.error('Failed to delete booking:', data.message);
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    // Call the parent component's handler to update UI if provided
    if (onEditBooking) {
      onEditBooking();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 mx-auto font-sans relative">
      <div className="flex">
        {/* Client information */}
        <div className="w-full">
          <div className="flex flex-wrap gap-2 mb-2">
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
                {/* Persons breakdown */}
                {bookData.persons_types && (
                  <span className="block text-xs text-gray-500 mt-1">
                    ({formatPersonsBreakdown(bookData.persons_types)})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons - show only if no deposit */}
            {bookData.deposite_price <= 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {/* Edit button */}
                <button  
                  onClick={() => setShowEditModal(true)}
                  className="bg-blue-100 cursor-pointer p-2 rounded-sm text-blue-500 hover:text-blue-700 flex items-center justify-center"
                  aria-label="تعديل الحجز"
                >
                  <Edit size={16} className="ml-1" /> تعديل
                </button>

                {/* Delete button */}
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-100 cursor-pointer p-2 rounded-sm text-red-500 hover:text-red-700 flex items-center justify-center"
                  aria-label="حذف الحجز"
                >
                  <Trash2 size={16} className="ml-1" /> الغاء
                </button>
              </div>
            )}

        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteBookingModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        bookingId={bookData.id}
      />

      {/* Edit booking modal */}
      <EditBooking
        bookingId={bookData.id}
        tripData={tripData}
        initialDate={bookData.day}
        initialNumberOfSeats={bookData.persons_types?.adults ? bookData.persons_types : { adults: bookData.persons, children: 0, infants: 0 }}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

export default BookingCard;