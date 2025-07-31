import React, { useState } from 'react';
import StarsRates from '@/components/website/StarsRates';

function CommentCard({ commentData, locale = "ar" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150; // Maximum characters to show before truncating
  
  const shouldTruncate = commentData.comment && commentData.comment.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? commentData.comment.substring(0, maxLength) + '...'
    : commentData.comment;
  
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  
  const seeMoreText = locale === "ar" ? "عرض المزيد" : "See more";
  const seeLessText = locale === "ar" ? "عرض أقل" : "See less";

  return (
    <div className="bg-white w-full rounded-lg shadow-sm p-4 border border-gray-100 h-fit">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">{commentData.sender_name}</h3>
          <StarsRates rate={commentData.value} />
        </div>
      </div>
      
      <div className="mt-2">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {displayText}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={toggleText}
            className={`text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 transition-colors ${
              locale === "ar" ? "text-right" : "text-left"
            }`}
          >
            {isExpanded ? seeLessText : seeMoreText}
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentCard;