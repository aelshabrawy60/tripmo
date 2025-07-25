import { useEffect, useState, useCallback } from "react"
import MapPointSelector from "./MapPointSelector"
import { Check, Info, MapPin } from "lucide-react"

function MeetingPointSetup({ onEdit }) {
  const [data, setData] = useState({
    "type": "meeting-point",
    "location": {},
    "notes": ""
  })

  const [showMapSelector, setShowMapSelector] = useState(false)


  const handleLocationSelect = useCallback((locationData) => {
    setData(prevData => {
      const newData = {
        ...prevData,
        location: {
          ...prevData.location,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        }
      }
      onEdit(newData) // Call onEdit with new data
      console.log(newData)
      return newData
    })
  }, [onEdit])

  const handleNotesChange = useCallback((e) => {
    setData(prevData => {
      const newData = {
        ...prevData,
        notes: e.target.value || ""
      }
      onEdit(newData) // Call onEdit with new data
      console.log(newData)
      return newData
    })
  }, [onEdit])
    
  return (
    <div className="max-w-2xl">
             
      {/* Location Section */}
      <div className="mb-6">
        <label className="text-blue-900 mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          موقع نقطة التجمع
        </label>
                
        {/* Toggle Map Selector */}
        <div className="mb-4">
          <button
            onClick={() => setShowMapSelector(!showMapSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {showMapSelector ? 'إخفاء الخريطة' : 'اختيار من الخريطة'}
          </button>
        </div>

        {/* Map Selector */}
        {showMapSelector && (
          <div className="mb-6 p-4 border-2 border-blue-200 rounded-xl bg-blue-50">
            <h3 className="text-blue-900 font-medium mb-3 text-right" dir="rtl">
              اختر الموقع من الخريطة
            </h3>
            <MapPointSelector 
              onLocationSelect={handleLocationSelect}
              initialLocation={
                data.location.latitude && data.location.longitude 
                  ? { lat: parseFloat(data.location.latitude), lng: parseFloat(data.location.longitude) }
                  : null
              }
            />
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <label className="text-blue-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          ملاحظات إضافية
        </label>
        <textarea
          value={data.notes}
          onChange={handleNotesChange}
          placeholder="أي معلومات إضافية حول نقطة الالتقاء مثل علامات مميزة، تعليمات الوصول، أو تفاصيل أخرى..."
          className="w-full p-4 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-blue-100 transition-all duration-200 focus:outline-none focus:ring-0 resize-none text-right bg-white shadow-sm hover:shadow-md"
          rows="3"
          dir="rtl"
        />
      </div>
    </div>
  )
}

export default MeetingPointSetup
