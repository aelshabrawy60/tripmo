import React, { useEffect, useRef } from 'react';

const PointMap = ({ 
  meetingPoint
}) => {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    console.log("meeting_point", meetingPoint)
    // Only initialize if we haven't already and we have a valid meeting point
    if (leafletMapRef.current || !meetingPoint) return;

    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(cssLink);
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || leafletMapRef.current) return;

      const lat = parseFloat(meetingPoint.latitude);
      const lng = parseFloat(meetingPoint.longitude);

      // Initialize the map
      leafletMapRef.current = window.L.map(mapRef.current).setView([lat, lng], 15);

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);

      const meetingIcon = window.L.divIcon({
        className: 'custom-meeting-icon',
        html: `
            <div style="
            position: relative;
            width: 30px;
            height: 42px;
            display: flex;
            justify-content: center;
            align-items: center;
            ">
            <div style="
                background: #3b82f6;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                z-index: 2;
            "></div>
            <div style="
                position: absolute;
                bottom: 0;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 12px solid #3b82f6;
                z-index: 1;
            "></div>
            </div>
        `,
        iconSize: [24, 36],
        iconAnchor: [12, 36]
        });


      // Add marker
      markerRef.current = window.L.marker([lat, lng], { icon: meetingIcon })
        .addTo(leafletMapRef.current)
        .bindPopup(`
          <div style="text-align: center; padding: 8px;">
            <strong>Meeting Point</strong><br/>
            <small>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}</small>
          </div>
        `);
    };

    loadLeaflet();

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [meetingPoint]);

  // Update marker position if meetingPoint changes
  useEffect(() => {
    if (leafletMapRef.current && markerRef.current && meetingPoint) {
      const lat = parseFloat(meetingPoint.latitude);
      const lng = parseFloat(meetingPoint.longitude);
      
      markerRef.current.setLatLng([lat, lng]);
      leafletMapRef.current.setView([lat, lng], 15);
      
      markerRef.current.setPopupContent(`
        <div style="text-align: center; padding: 8px;">
          <strong>Meeting Point</strong><br/>
          <small>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}</small>
        </div>
      `);
    }
  }, [meetingPoint]);

  if (!meetingPoint || !meetingPoint) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No meeting point data provided</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-300 shadow-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default PointMap;