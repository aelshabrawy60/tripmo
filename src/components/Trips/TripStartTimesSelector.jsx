import React, { useEffect, useState } from 'react'
import { Clock, Plus, X, AlertCircle } from 'lucide-react'

function TripStartTimesSelector({initValues = [], onAdd}) {
  const [startTimes, setStartTimes] = useState(initValues)
  const [errors, setErrors] = useState([])

  // Format time for Supabase (HH:MM:SS format)
  const formatTimeForSupabase = (timeString) => {
    if (!timeString) return null;

    // Check if it's already in HH:MM:SS format
    const parts = timeString.split(':');
    if (parts.length === 3) {
      return timeString; // Already formatted
    }

    // Check if it's in HH:MM format
    if (parts.length === 2) {
      return `${timeString}:00`; // Convert HH:MM to HH:MM:SS
    }

    // If format is invalid, return null or handle as needed
    return null;
  };


  // Validate times and check for duplicates
  const validateTimes = (times) => {
    const newErrors = []
    const timeSet = new Set()
    
    times.forEach((time, index) => {
      if (!time) {
        newErrors[index] = 'الوقت مطلوب'
      } else if (timeSet.has(time)) {
        newErrors[index] = 'الوقت مكرر'
      } else {
        timeSet.add(time)
      }
    })
    
    setErrors(newErrors)
    return newErrors.length === 0 || newErrors.every(error => !error)
  }

  // Update parent component with formatted times
  const updateParent = (times) => {
    const validTimes = times.filter(time => time && time.trim() !== '')
    const formattedTimes = validTimes.map(formatTimeForSupabase)
    onAdd(formattedTimes)
  }

  useEffect(() => {
    updateParent(startTimes)
  }, [])

  const handleTimeChange = (index, value) => {
    const newTimes = [...startTimes]
    newTimes[index] = value
    setStartTimes(newTimes)
    
    if (validateTimes(newTimes)) {
      updateParent(newTimes)
    }
  }

  const addTime = () => {
    const newTimes = [...startTimes, '07:00']
    setStartTimes(newTimes)
    updateParent(newTimes)
    // Focus on the new input after a brief delay
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[type="time"]')
      if (inputs[inputs.length - 1]) {
        inputs[inputs.length - 1].focus()
      }
    }, 100)
    
  }

  const removeTime = (index) => {
    const newTimes = startTimes.filter((_, i) => i !== index)
    setStartTimes(newTimes)
    updateParent(newTimes)
    
    // Clear error for removed item
    const newErrors = [...errors]
    newErrors.splice(index, 1)
    setErrors(newErrors)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">وقت بدء الرحلة</h3>
            <p className="text-sm text-gray-500">أضف الوقت الذي تبدأ فيه الرحلة يمكنك اضافة اكثر من وقت اذا كانت الرحلة تتكر اكثر من مرة في اليوم</p>
          </div>
        </div>
      </div>

      {startTimes?.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4 text-sm">لم يتم إضافة أوقات بعد</p>
          <button
            type="button"
            onClick={addTime}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                     rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Plus className="w-4 h-4" />
            إضافة وقت
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {startTimes.map((time, index) => (
              <div key={index} className="relative group">
                <div className={`relative ${errors[index] ? 'animate-pulse' : ''}`}>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                              group-hover:border-gray-300 font-mono text-center
                              ${errors[index] 
                                ? 'border-red-300 bg-red-50 text-red-700' 
                                : 'border-gray-200 bg-white text-gray-900'
                              }`}
                    placeholder="00:00"
                  />
                  
                  {startTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTime(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white 
                               rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                               duration-200 flex items-center justify-center hover:bg-red-600"
                      title="حذف الوقت"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                {errors[index] && (
                  <div className="flex items-center gap-1 mt-2 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors[index]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={addTime}
              className="flex justify-center items-center w-full gap-2 px-4 py-2 bg-blue-600 text-white 
                       rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 
                       font-medium transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              إضافة وقت جديد
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TripStartTimesSelector