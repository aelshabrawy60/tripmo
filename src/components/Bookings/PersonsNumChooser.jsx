import React, { useState } from 'react';

function PersonsNumChooser({ onChange, initialValue = 1 }) {
  const [count, setCount] = useState(initialValue);
  
  const handleDecrement = (e) => {
    // Prevent default form submission
    e.preventDefault();
    if (count > 1) {
      const newValue = count - 1;
      setCount(newValue);
      onChange(newValue);
    }
  };
  
  const handleIncrement = (e) => {
    // Prevent default form submission
    e.preventDefault();
    const newValue = count + 1;
    setCount(newValue);
    onChange(newValue);
  };

  return (
    <div>
        <div className='mb-2'>عدد الأفراد</div>

        <div className="flex items-center border border-gray-200 rounded-lg p-2 bg-gray-50 w-fit">
        <button 
            type="button" // Add this to prevent form submission
            onClick={handleDecrement}
            disabled={count <= 1}
            aria-label="Decrease number of persons"
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-colors
            ${count <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
            -
        </button>
        
        <div className="mx-3 font-medium text-center min-w-[24px]">
            {count}
        </div>
        
        <button 
            type="button" // Add this to prevent form submission
            onClick={handleIncrement}
            aria-label="Increase number of persons"
            className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-lg hover:bg-gray-300 transition-colors"
        >
            +
        </button>
        </div>
    </div>
  );
}

export default PersonsNumChooser;