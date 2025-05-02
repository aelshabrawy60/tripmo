import React, { useState } from 'react';
import { FaUser, FaPhone, FaEdit, FaTrash } from 'react-icons/fa';
import { motion , AnimatePresence} from 'framer-motion';

function UserCard({ data, onEdit, onDelete }) {

    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);



    async function deleteUser() {
        setIsLoading(true);
        setDeleteError(null);
        
        try {
          const response = await fetch(`/api/dashboard/users?userId=${data.id}`, {
            method: 'DELETE',
          });
    
          if (response.ok) {
            setToastMessage('تم حذف اللاعب بنجاح');
            setShowSuccessToast(true);
            setIsModalOpen(false);
            onDelete();
          } else {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'Failed to delete user');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          setDeleteError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
          setIsLoading(false);
        }
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        if (!isLoading) {
        setIsModalOpen(false);
        setDeleteError(null);
        }
    };

    // Close success toast after 3 seconds
    React.useEffect(() => {
        if (showSuccessToast) {
        const timer = setTimeout(() => setShowSuccessToast(false), 3000);
        return () => clearTimeout(timer);
        }
    }, [showSuccessToast]);
  return (
    <>
    <div className="w-full transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="flex items-start gap-4 bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-xl p-5 relative overflow-hidden">
        {/* Avatar section */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            {data.avatar ? (
              <img
                src={data.avatar}
                alt={`${data.name}'s avatar`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-xl" />
            )}
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{data.name}</h2>
          <div className="flex items-center text-gray-600 mb-2">
            <FaPhone className="text-gray-400 ml-2 text-xs" />
            <p className="text-sm">{data.phone}</p>
          </div>
          
          {/* Optional client info */}
          {data.email && (
            <p className="text-xs text-gray-500 mt-1">{data.email}</p>
          )}
        </div>

        {/* Actions section */}
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
          {onEdit && (
            <button 
              onClick={() => onEdit(data)} 
              className="p-1.5 bg-gray-100 hover:bg-blue-100 rounded-full text-gray-600 hover:text-blue-600 transition-colors"
              aria-label={`Edit ${data.name}`}
            >
              <FaEdit size={14} />
            </button>
          )}
            
        </div>
        
        <button 
              onClick={() => openModal()} 
              className="p-1.5 bg-gray-100 hover:bg-red-100 rounded-full text-gray-600 hover:text-red-600 transition-colors"
              aria-label={`Delete ${data.name}`}
            >
              <FaTrash size={14} />
        </button>

        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
      </div>
    </div>

    {isModalOpen && (
          <div 
            className="fixed z-50 inset-0 overflow-y-auto" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div 
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right" dir="rtl">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        حذف اللاعب
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          هل أنت متأكد أنك تريد حذف اللاعب <span className="font-semibold text-gray-700">{name}</span>؟ لا يمكنك التراجع عن هذا الإجراء.
                        </p>
                        
                        {deleteError && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{deleteError}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row" dir="rtl">
                  <motion.button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={deleteUser}
                    disabled={isLoading}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جارٍ الحذف...
                      </span>
                    ) : (
                      'تأكيد الحذف'
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                    disabled={isLoading}
                    whileTap={{ scale: 0.95 }}
                  >
                    إلغاء
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 px-4 py-3 shadow-md rounded-md flex items-center z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="text-green-500 rounded-full bg-green-100 mr-3 p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Default props
UserCard.defaultProps = {
  onEdit: null,
  onDelete: null,
};

export default UserCard;