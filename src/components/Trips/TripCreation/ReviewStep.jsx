// components/steps/ReviewStep.jsx
import { CheckCircleIcon, PhotoIcon, InformationCircleIcon } from '@heroicons/react/24/outline'; // Or solid, if you prefer

export default function ReviewStep({ tripData, images, onSubmit, loading }) {
  const Card = ({ children, className = "" }) => (
    <div className={`${className}`}>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, isPlaceholder = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className={`text-sm ${isPlaceholder ? 'text-gray-400 italic' : 'text-gray-800 font-medium'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4 sm:p-6">

        {/* Images Review */}
      <Card>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div key={index} className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <img
                  src={img}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">لا توجد صور لعرضها.</p>
          </div>
        )}
      </Card>
      {/* Basic Info Review */}
      <Card>
        <div className="space-y-1">
          <InfoRow
            label="العنوان"
            value={tripData.name || "غير محدد"}
            isPlaceholder={!tripData.name}
          />
          <InfoRow
            label="اقصى عدد للأفراد"
            value={tripData.max_clients || "غير محدد"}
            isPlaceholder={!tripData.max_clients}
          />
          {/* Add more tripData fields here as needed using InfoRow */}
          {/* Example:
          <InfoRow
            label="السعر"
            value={tripData.price ? `${tripData.price} ريال` : "غير محدد"}
            isPlaceholder={!tripData.price}
          />
          <InfoRow
            label="المدينة"
            value={tripData.city || "غير محدد"}
            isPlaceholder={!tripData.city}
          />
          */}
        </div>
      </Card>

      
    </div>
  );
}