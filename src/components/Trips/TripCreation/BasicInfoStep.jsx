// components/steps/BasicInfoStep.jsx
import { useState } from "react"; // useState is not used in this component.



export default function BasicInfoStep({ tripData, errors, onUpdateTripData, onClearErrors }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onUpdateTripData({ [name]: value });
    
    if (errors[name]) {
      onClearErrors(name);
    }
  };

  return (
    <div className="space-y-6">
      {/* Trip Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          العنوان*
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
          placeholder="ادخل عنوان للرحلة"
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
          placeholder="ادخل وصف مفصل للرحلة"
        />
        {errors.about && <p className="mt-1 text-sm text-red-600">{errors.about}</p>}
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
    </div>
  );
}