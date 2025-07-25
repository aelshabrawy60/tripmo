import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import {Search} from 'lucide-react'

// Fix default marker icon issue
import 'leaflet/dist/leaflet.css'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

function LocationEvents({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng)
    }
  })
  return null
}

export default function MapPointSelector({ onLocationSelect, initialLocation = null }) {
  const [selectedPoint, setSelectedPoint] = useState(
    initialLocation || { lat: 25.6872, lng: 32.6396 } // Default: Luxor
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleMapClick = (latlng) => {
    const newPoint = { lat: latlng.lat, lng: latlng.lng };
    setSelectedPoint(newPoint);
    if (onLocationSelect) {
      onLocationSelect({
        latitude: newPoint.lat.toFixed(6),
        longitude: newPoint.lng.toFixed(6),
        address: '' // Address is not available on click
      });
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
        const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
        )
        const data = await response.json()

        if (data && data.length > 0) {
        const result = data[0]
        const newPoint = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            address: result.display_name
        };
        setSelectedPoint(newPoint);
        if (onLocationSelect) {
            onLocationSelect({
                latitude: newPoint.lat.toFixed(6),
                longitude: newPoint.lng.toFixed(6),
                address: newPoint.address
            });
        }
        } else {
        alert('لم يتم العثور على الموقع')
        }
    } catch (err) {
        console.error('Search error:', err)
        alert('حدث خطأ أثناء البحث')
    }

    setIsSearching(false)
    }

  const copyCoordinates = () => {
    const coords = `${selectedPoint.lat.toFixed(6)}, ${selectedPoint.lng.toFixed(6)}`
    navigator.clipboard.writeText(coords).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search */}
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مكان..."
              className="w-full p-3 pr-10 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-blue-100 transition-all duration-200 focus:outline-none focus:ring-0 text-right bg-white"
              dir="rtl"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
          >
            {isSearching ? '...' : 'بحث'}
          </button>
        </div>
      </div>

      {/* Real Map */}
      <div className="h-64 w-full rounded-lg overflow-hidden mb-4 border-2 border-blue-200">
        <MapContainer
            center={[selectedPoint.lat, selectedPoint.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[selectedPoint.lat, selectedPoint.lng]} />
            <LocationEvents onClick={handleMapClick} />
            <MapController center={selectedPoint} />
            </MapContainer>
      </div>
    </div>
  )
}


import { useMap } from 'react-leaflet'

function MapController({ center }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom(), {
        animate: true,
        duration: 1
      })
    }
  }, [center, map])

  return null
}
