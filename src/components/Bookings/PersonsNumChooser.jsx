import React, { useState } from 'react';

function PersonsNumChooser({ onChange }) {
  const [count, setCount] = useState(1);
  
  const handleDecrement = () => {
    if (count > 1) {
      const newValue = count - 1;
      setCount(newValue);
      onChange(newValue);
    }
  };
  
  const handleIncrement = () => {
    const newValue = count + 1;
    setCount(newValue);
    onChange(newValue);
  };

  return (
    <div>
        <div className='mb-2'>عدد الأفراد</div>

        <div className="flex items-center border border-gray-200 rounded-lg p-2 bg-gray-50 w-fit">
        <button 
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