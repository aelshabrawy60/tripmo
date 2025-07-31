// components/steps/BasicInfoStep.jsx
import GuideLangsSelector from "../GuideLangsSelector";

export default function BasicInfoStep({ tripData, errors, onUpdateTripData, onClearErrors }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdateTripData({ [name]: value });
    
    if (errors[name]) {
      onClearErrors(name);
    }
  };

  function handleLangsChange(newLangs) {
    onUpdateTripData({ guide_langs: newLangs });

    if (errors.guide_langs) {
      onClearErrors("guide_langs");
    }
  }

  return (
    <div className="space-y-6">

      {/* Trip Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          اسم الرحلة*
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={tripData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-md ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="ادخل اسم للرحلة"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      {/* Trip Description */}
      <div>
        <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
          الوصف*
        </label>
        <textarea
          id="about"
          name="about"
          value={tripData.about}
          onChange={handleInputChange}
          rows={6}
          className={`w-full px-4 py-2 border rounded-md ${
            errors.about ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="ادخل وصف مفصل للرحلة (تجنب إضافة معلومات الاتصال الشخصية)"
        />
        {errors.about && <p className="mt-1 text-sm text-red-600">{errors.about}</p>}
      </div>

      {/* Warning Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>تحذير: </strong>لا تقم بإضافة أرقام هواتف أو معلومات اتصال شخصية في الوصف أو الصور
            </p>
          </div>
        </div>
      </div>

      {/* Max Clients */}
      <div>
        <label htmlFor="max_clients" className="block text-sm font-medium text-gray-700 mb-1">
          اقصي عدد للافراد*
        </label>
        <input
          type="number"
          id="max_clients"
          name="max_clients"
          value={tripData.max_clients}
          onChange={handleInputChange}
          min="1"
          className={`w-full px-4 py-2 border rounded-md ${
            errors.max_clients ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.max_clients && (
          <p className="mt-1 text-sm text-red-600">{errors.max_clients}</p>
        )}
      </div>

      <GuideLangsSelector onEdit={handleLangsChange}/>
    </div>
  );
}