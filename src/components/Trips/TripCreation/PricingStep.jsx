// components/steps/PricingStep.jsx
import TripPricingEditor from "../TripPricingEditor"; // Assuming path
import TripCancellationPolicyEditor from "../TripCancellationPolicyEditor"; // Assuming path

export default function PricingStep({ tripData, errors, onUpdateTripData, onClearErrors }) {
  const handlePricingChange = (priceData) => {
    onUpdateTripData({ pricing: priceData }); // Assuming priceData is the complete pricing object
    if (errors.pricing) {
      onClearErrors("pricing");
    }
  };

  const handleCancellationPolicyChange = (policy) => {
    onUpdateTripData({ cancellation_policy: policy });
    if (errors.cancellation_policy) {
      onClearErrors("cancellation_policy");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">تحديد الأسعار</h3>
        <TripPricingEditor
          fixedDate={tripData.availability_type === "fixed"}
          value={tripData.pricing}
          onChange={handlePricingChange}
        />
        {errors.pricing && (
          <p className="mt-1 text-sm text-red-600">{errors.pricing}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">سياسة الإلغاء</h3>
        <TripCancellationPolicyEditor 
          value={tripData.cancellation_policy}
          onChange={handleCancellationPolicyChange} 
        />
        {errors.cancellation_policy && (
          <p className="mt-1 text-sm text-red-600">{errors.cancellation_policy}</p>
        )}
      </div>
    </div>
  );
}