// components/Trips/TripCreation/StartLocationStep.jsx
import { useState, useCallback } from 'react';
import MeetingPointSetup from '../MeetingPointSetup';
import PickupSetup from '../PickupSetup';

export default function StartLocationStep({ tripData, errors, onUpdateTripData, onClearErrors }) {
  const [selection, setSelection] = useState(tripData.start_location?.type || '');

  const handleSelectionChange = (type) => {
    setSelection(type);
    onUpdateTripData({ start_location: { type } });
    if (errors.start_location) {
      onClearErrors('start_location');
    }
  };

  const handleSetupComplete = useCallback((data) => {
    onUpdateTripData({ start_location: { type: selection, ...data } });
  }, [onUpdateTripData, selection]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اختر نقطة البدء
        </label>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handleSelectionChange('pickup')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selection === 'pickup'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            اصطحاب العميل
          </button>
          <button
            type="button"
            onClick={() => handleSelectionChange('meeting_point')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selection === 'meeting_point'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            نقطة تجمع
          </button>
        </div>
        {errors.start_location && !selection && (
          <p className="mt-1 text-sm text-red-600">{errors.start_location}</p>
        )}
      </div>

      {selection === 'pickup' && (
        <PickupSetup
          onEdit={handleSetupComplete}
          initialData={tripData.start_location}
        />
      )}

      {selection === 'meeting_point' && (
        <MeetingPointSetup
          onEdit={handleSetupComplete}
          initialData={tripData.start_location}
        />
      )}
    </div>
  );
}
