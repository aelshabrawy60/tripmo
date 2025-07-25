import React, { useEffect, useState } from 'react'
import { MapPin, Info } from 'lucide-react'

function PickupSetup({onEdit, initialData}) {
  const [data, setData] = useState(initialData || {
    "type": "pickup",
    "description": null
  })

  function handleInputChange(e){
    const newDescription = e.target.value || null;
    const newData = {
      ...data,
      description: newDescription,
    };
    setData(newData);
    onEdit(newData);
  }
  
  return (
    <div className="max-w-2xl">

      {/* Input Field */}
      <div className="mb-6">
        <label className="block text-blue-900 mb-3">
         الأماكن المتوفرة لاصطحاب العميل منها وأي تفاصيل إضافية
        </label>
        <textarea
          value={data.description || ''}
          onChange={handleInputChange}
          placeholder="نقوم باصطحابك من فنادق الأقصر ..."
          className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-100 transition-all duration-200 focus:outline-none focus:ring-0 resize-none text-right bg-white shadow-sm hover:shadow-md"
          rows="1"
          dir="rtl"
        />
      </div>
    </div>
  )
}

export default PickupSetup
