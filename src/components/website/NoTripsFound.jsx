import React from 'react';
import { MapPin, Plus } from 'lucide-react';

export default function NoTripsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6" dir="rtl">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
          <MapPin className="w-10 h-10 text-blue-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-md">
          <Plus className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-3 font-arabic">
          لم يتم العثور على رحلات
        </h3>
        <p className="text-gray-500 text-base leading-relaxed font-arabic">
          جرب البحث بفلاتر أخرى أو وجهات مختلفة
        </p>
      </div>
    </div>
  );
}