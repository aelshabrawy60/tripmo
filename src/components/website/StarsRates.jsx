import React from 'react'

function StarsRates({rate, size = 5}) {
  const fullStars = Math.floor(rate);
  const hasPartialStar = rate % 1 !== 0;
  const partialStarPercentage = (rate % 1) * 100;

  return (
    <div dir='ltr' className='w-fit'>
      <div className="flex items-center">
        <span className="text-tripmo-500 flex gap-1">
          {Array.from({ length: 5 }, (_, index) => {
            if (index < fullStars) {
              // Full star
              return (
                <svg
                  key={index}
                  className={`w-${size} h-${size} fill-current`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.535L1 7.545l6.556-.955L10 1l2.444 5.59L19 7.545l-4.244 4.01L15.878 18z" />
                </svg>
              );
            } else if (index === fullStars && hasPartialStar) {
              // Partial star
              return (
                <div key={index} className={`relative w-${size} h-${size}`}>
                  {/* Empty star background */}
                  <svg
                    className={`absolute w-${size} h-${size} text-gray-200 fill-current`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.535L1 7.545l6.556-.955L10 1l2.444 5.59L19 7.545l-4.244 4.01L15.878 18z" />
                  </svg>
                  {/* Filled portion */}
                  <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${partialStarPercentage}%` }}
                  >
                    <svg
                      className={`w-${size} h-${size} text-tripmo-500 fill-current`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.535L1 7.545l6.556-.955L10 1l2.444 5.59L19 7.545l-4.244 4.01L15.878 18z" />
                    </svg>
                  </div>
                </div>
              );
            } else {
              // Empty star
              return (
                <svg
                  key={index}
                  className={`w-${size} h-${size} text-gray-200 fill-current`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.535L1 7.545l6.556-.955L10 1l2.444 5.59L19 7.545l-4.244 4.01L15.878 18z" />
                </svg>
              );
            }
          })}
        </span>
      </div>
    </div>
  )
}

export default StarsRates