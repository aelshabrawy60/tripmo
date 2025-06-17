// components/steps/AvailabilityStep.jsx
export default function AvailabilityStep({ tripData, errors, onUpdateTripData, onClearErrors }) {
  const weekDays = [
    { code: 0, label: "الأحد" },
    { code: 1, label: "الاتنين" },
    { code: 2, label: "الثلاثاء" },
    { code: 3, label: "الاربعاء" },
    { code: 4, label: "الخميس" },
    { code: 5, label: "الجمعة" },
    { code: 6, label: "السبت" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let dataToUpdate = { [name]: value };

    if (errors[name]) {
      onClearErrors(name);
    }

    // When availability type changes, reset related fields and errors
    if (name === "availability_type") {
      dataToUpdate = {
        ...dataToUpdate, // keep the new availability_type
        available_day: "",
        start_date: null,
        end_date: null,
        weekly_days: [],
        has_specific_time_period: false, // Reset this too
      };
      const errorsToClear = ["available_day", "start_date", "end_date", "weekly_days"];
      onClearErrors(errorsToClear);
    }
    onUpdateTripData(dataToUpdate);
  };

  const handleTimePeriodToggle = (e) => {
    const { checked } = e.target;
    const updates = { has_specific_time_period: checked };
    if (!checked) {
      // If unchecking, clear dates and their errors
      updates.start_date = null;
      updates.end_date = null;
      onClearErrors(["start_date", "end_date"]);
    }
    onUpdateTripData(updates);
    // Assuming 'has_specific_time_period' itself doesn't have direct errors to clear
  };


  const handleWeekDayToggle = (day) => {
    const updatedDays = (tripData.weekly_days || []).includes(day) // Ensure weekly_days is an array
      ? (tripData.weekly_days || []).filter((d) => d !== day)
      : [...(tripData.weekly_days || []), day];
    
    onUpdateTripData({ weekly_days: updatedDays });
    
    if (errors.weekly_days) {
      onClearErrors("weekly_days");
    }
  };

  // Ensure tripData has default values for controlled components if not yet set
  const currentTripData = {
    availability_type: tripData.availability_type || "",
    available_day: tripData.available_day || "",
    weekly_days: tripData.weekly_days || [],
    has_specific_time_period: tripData.has_specific_time_period || false,
    start_date: tripData.start_date || null,
    end_date: tripData.end_date || null,
  };


  return (
    <div className="space-y-6">
      {/* Availability Type */}
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            نوع التواريخ المتاحة*
          </legend>
          <div className="flex flex-wrap gap-4">
            {["fixed", "daily", "weekly"].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="radio"
                  id={`availability-${type}`}
                  name="availability_type"
                  value={type}
                  checked={currentTripData.availability_type === type}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`availability-${type}`} className="mr-2 text-sm text-gray-700">
                  {type === "fixed" ? "مرة واحده" : type === "daily" ? "كل يوم" : "اسبوعي"}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        {errors.availability_type && ( // Added error display for availability_type itself
            <p className="mt-1 text-sm text-red-600">{errors.availability_type}</p>
        )}
      </div>

      {/* Fixed Date */}
      {currentTripData.availability_type === "fixed" && (
        <div>
          <label htmlFor="available_day" className="block text-sm font-medium text-gray-700 mb-1">
            اختر اليوم*
          </label>
          <input
            type="date"
            id="available_day"
            name="available_day"
            value={currentTripData.available_day}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-md ${
              errors.available_day ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.available_day && (
            <p className="mt-1 text-sm text-red-600">{errors.available_day}</p>
          )}
        </div>
      )}


      {/* Weekly Days Selection */}
      {currentTripData.availability_type === "weekly" && (
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            اختر ايام الاسبوع*
          </div>
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <button
                key={day.code}
                type="button"
                onClick={() => handleWeekDayToggle(day.code)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  currentTripData.weekly_days.includes(day.code)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
          {errors.weekly_days && (
            <p className="mt-1 text-sm text-red-600">{errors.weekly_days}</p>
          )}
        </div>
      )}

      {/* Checkbox for specific time period */}
      {["daily", "weekly"].includes(currentTripData.availability_type) && (
        <div className="mt-4"> {/* Added some margin */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="has_specific_time_period"
              name="has_specific_time_period" // Not strictly needed for controlled checkbox if using a dedicated handler
              checked={currentTripData.has_specific_time_period}
              onChange={handleTimePeriodToggle}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="has_specific_time_period" className="mr-2 text-sm font-medium text-gray-700">
                فترة مخصصة
            </label>
          </div>
        </div>
      )}

      {/* Date Range for Daily/Weekly (conditionally shown) */}
      {["daily", "weekly"].includes(currentTripData.availability_type) && currentTripData.has_specific_time_period && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"> {/* Added some top margin */}
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ البدء* {/* Keep asterisk as it's required IF checkbox is checked */}
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={currentTripData.start_date}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.start_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ الانتهاء* {/* Keep asterisk */}
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={currentTripData.end_date}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.end_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}