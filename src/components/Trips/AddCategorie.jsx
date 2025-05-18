import React, { useState } from 'react';

function AddCategorie({ groupId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const openModal = () => {
    setIsModalOpen(true);
    setFeedback({ type: '', message: '' });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName('');
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      setFeedback({ type: 'error', message: 'يرجى إدخال اسم الفئة' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch('/api/dashboard/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName, groupId }),
      });

      const result = await response.json();

      if (result.success) {
        setFeedback({ type: 'success', message: 'تم إضافة الفئة بنجاح' });
        setCategoryName('');
        // Close modal after 1.5 seconds on success
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: result.message || 'حدث خطأ أثناء إضافة الفئة' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'حدث خطأ في الاتصال بالخادم' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="rtl:text-right" dir="rtl">
      {/* Add Category Button */}
      <button
        onClick={openModal}
        className="flex items-center justify-center gap-2 bg-tripmo-500 hover:bg-tripmo-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        إضافة فئة جديدة
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 backdrop-blur-sm">
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">إضافة فئة جديدة</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الفئة
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-3 py-2 border  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-tripmo-500 focus:border-tripmo-500"
                  placeholder="أدخل اسم الفئة"
                  disabled={isLoading}
                />
              </div>

              {feedback.message && (
                <div className={`mb-4 p-3 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback.message}
                </div>
              )}

              {/* Modal Footer - Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                  disabled={isLoading}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`px-4 py-2 bg-tripmo-500 text-white rounded-md hover:bg-tripmo-400 transition-colors duration-300 flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإضافة...
                    </>
                  ) : (
                    'إضافة'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCategorie;