
// components/steps/LocationStep.jsx
import CityChooser from "../CityChooser"; // Assuming CityChooser is in ../CityChooser

export default function LocationStep({ tripData, errors, onUpdateTripData, onClearErrors }) {
  const handleDepCityChange = (city) => {
    onUpdateTripData({ depature_city: city.id });
    if (errors.depature_city) {
      onClearErrors("depature_city");
    }
  };

  const handleDestCityChange = (city) => {
    onUpdateTripData({ dest_city: city.id });
    if (errors.dest_city) {
      onClearErrors("dest_city");
    }
  };

  return (
    <div className="space-y-6">
      {/* Departure Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          مكان الانطلاق*
        </label>
        <CityChooser 
          defaultCity={tripData.depature_city} 
          onChange={handleDepCityChange} 
        />
        {errors.depature_city && (
          <p className="mt-1 text-sm text-red-600">{errors.depature_city}</p>
        )}
      </div>

      {/* Destination Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          وجهة الرحلة*
        </label>
        <CityChooser 
          defaultCity={tripData.dest_city}
          onChange={handleDestCityChange} 
        />
        {errors.dest_city && (
          <p className="mt-1 text-sm text-red-600">{errors.dest_city}</p>
        )}
      </div>
    </div>
  );
}
