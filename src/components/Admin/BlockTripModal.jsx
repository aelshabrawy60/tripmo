import React, { useState } from 'react';
import { AlertTriangle, Shield, ShieldOff } from 'lucide-react';

function BlockTripModal({ tripData, onStatusChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const isBlocked = tripData.status === 'blocked';

  // Handle block/unblock action
  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/trips/block?tripId=${tripData.id}&action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state
        const newStatus = action === 'block' ? 'blocked' : 'active';
        onStatusChange?.(tripData.id, newStatus);
        
        // Show success message
        alert(action === 'block' ? 'تم حظر الرحلة بنجاح' : 'تم إلغاء حظر الرحلة بنجاح');
        
        // Close modal
        setShowConfirmModal(false);
      } else {
        throw new Error(result.error || 'فشل في تغيير حالة الرحلة');
      }
    } catch (error) {
      console.error('Error changing trip status:', error);
      alert('حدث خطأ أثناء تغيير حالة الرحلة: ' + error.message);
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  // Open confirmation modal
  const openConfirmModal = (action) => {
    setActionType(action);
    setShowConfirmModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowConfirmModal(false);
    setActionType(null);
  };

  return (
    <>
      {/* Block/Unblock Button */}
      <button
        onClick={() => openConfirmModal(isBlocked ? 'unblock' : 'block')}
        disabled={isLoading}
        className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
          isBlocked
            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : isBlocked ? (
          <ShieldOff className="w-4 h-4" />
        ) : (
          <Shield className="w-4 h-4" />
        )}
        <span>{isBlocked ? 'إلغاء الحظر' : 'حظر'}</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${actionType === 'block' ? 'bg-red-100' : 'bg-green-100'}`}>
                <AlertTriangle className={`w-5 h-5 ${actionType === 'block' ? 'text-red-600' : 'text-green-600'}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === 'block' ? 'تأكيد حظر الرحلة' : 'تأكيد إلغاء حظر الرحلة'}
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                {actionType === 'block' 
                  ? 'هل أنت متأكد من أنك تريد حظر هذه الرحلة؟'
                  : 'هل أنت متأكد من أنك تريد إلغاء حظر هذه الرحلة؟'
                }
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleAction(actionType)}
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                  actionType === 'block'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'جاري المعالجة...' : (actionType === 'block' ? 'حظر الرحلة' : 'إلغاء الحظر')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BlockTripModal;