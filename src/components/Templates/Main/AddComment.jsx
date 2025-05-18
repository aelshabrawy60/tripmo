
import React, { useState } from 'react';
import { Star } from 'lucide-react';

const AddComment = ({ tripId }) => {
  const [senderName, setSenderName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async () => {
    if (!senderName || !comment || rating === 0) {
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
          comment
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus({
          success: true,
          message: 'تم إرسال تعليقك بنجاح!'
        });
        // Reset form
        setSenderName('');
        setComment('');
        setRating(0);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6" dir="rtl">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-right text-gray-800">أضف تقييمك</h2>
        
        {submitStatus && (
          <div className={`p-4 mb-6 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label htmlFor="senderName" className="block mb-2 font-medium text-gray-700">
              الاسم
            </label>
            <input
              type="text"
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل اسمك"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              التقييم
            </label>
            <div className="flex flex-row-reverse justify-end">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className="cursor-pointer p-1"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    size={28}
                    className={`${
                      (hoverRating || rating) >= star
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block mb-2 font-medium text-gray-700">
              التعليق
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="شاركنا رأيك حول الرحلة..."
            />
          </div>
          
          <div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full px-6 py-3 text-white font-medium rounded-md transition-colors ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال التعليق'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComment;