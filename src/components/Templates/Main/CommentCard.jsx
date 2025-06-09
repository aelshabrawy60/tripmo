import React from 'react';
import { Star } from 'lucide-react';
import StarsRates from '@/components/website/StarsRates';

function CommentCard({ commentData }) {
  // Function to render the rating stars
  const renderRating = (value) => {
    return (
      <div className="flex flex-row-reverse justify-end mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="mx-px">
            <Star
              size={16}
              className={`${
                value >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </div>
        ))}
      </div>
    );
  };

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
          {commentData.comment}
        </p>
      </div>
    </div>
  );
}

export default CommentCard;