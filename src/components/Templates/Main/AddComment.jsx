"use client"
import React, { useState, useEffect } from 'react';
import { Star, X, MessageCircle, Send } from 'lucide-react';

const AddComment = ({ tripId, senderName, groupId, bookId, bookData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [canRate, setCanRate] = useState(false)

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleSubmit = async () => {
    if (!comment || rating === 0) {
      setSubmitStatus({
        success: false,
        message: 'يرجى تعبئة جميع الحقول وتحديد التقييم'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/client/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId,
          sender_name: senderName,
          value: rating,
          comment,
          groupId,
          bookId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus({
          success: true,
          message: 'تم إرسال تعليقك بنجاح!'
        });
        // Reset form after 2 seconds and close modal
        setTimeout(() => {
          setComment('');
          setRating(0);
          window.location.reload()
          setSubmitStatus(null);
          setIsModalOpen(false);
        }, 1000);
      } else {
        setSubmitStatus({
          success: false,
          message: 'حدث خطأ أثناء إرسال التعليق. يرجى المحاولة مرة أخرى.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(()=>{
    setCanRate(showRateButton(bookData))
  },[])

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitStatus(null);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  if(!canRate){
    return null
  }
  return (
    <>
      {/* Trigger Button */}
      <div className='p-4'>
        <button
          onClick={openModal}
          className="inline-flex justify-center w-full items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200"
        >
          <Star className="w-5 h-5" />
          <span>قيم الرحلة</span>
        </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">قيم تجربتك</h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitStatus && (
                <div className={`p-4 mb-6 rounded-xl border ${
                  submitStatus.success 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {submitStatus.success ? (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    )}
                    <span className="font-medium">{submitStatus.message}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                {/* Rating Section */}
                <div>
                  <label className="block mb-3 font-semibold text-gray-700 text-lg">
                    كيف كانت تجربتك؟
                  </label>
                  <div className="flex flex-row-reverse justify-center gap-1 p-4 bg-gray-50 rounded-xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className="cursor-pointer p-2 rounded-full hover:bg-white transition-all duration-200"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          size={32}
                          className={`transition-all duration-200 ${
                            (hoverRating || rating) >= star
                              ? 'text-yellow-400 fill-yellow-400 scale-110'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center mt-2 text-sm text-gray-600">
                      {rating === 1 && 'سيء جداً'}
                      {rating === 2 && 'سيء'}
                      {rating === 3 && 'متوسط'}
                      {rating === 4 && 'جيد'}
                      {rating === 5 && 'ممتاز'}
                    </p>
                  )}
                </div>
                
                {/* Comment Section */}
                <div>
                  <label htmlFor="comment" className="block mb-3 font-semibold text-gray-700 text-lg">
                    شاركنا رأيك
                  </label>
                  <div className="relative">
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                      placeholder="أخبرنا عن تجربتك مع الرحلة..."
                    />
                    <div className="absolute bottom-3 left-3 text-xs text-gray-400">
                      {comment.length}/500
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 text-gray-700 font-medium border-2 border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !comment || rating === 0}
                  className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                    isSubmitting || !comment || rating === 0
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddComment;



function showRateButton(bookData) {
  const day = bookData.day;
  const currentDate = new Date();
  
  // Parse the trip date (format: "2025-05-03")
  const tripDate = new Date(day);
  
  // Set both dates to start of day to compare only dates, not times
  const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const tripDateOnly = new Date(tripDate.getFullYear(), tripDate.getMonth(), tripDate.getDate());
  
  // Return true if current date is > trip date (trip has passed)
  return currentDateOnly > tripDateOnly;
}