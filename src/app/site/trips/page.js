"use client"
import TripsViewer from '@/components/website/TripsViewer'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function TripsContent() {
  const [trips, setTrips] = useState()
  const searchParams = useSearchParams()

  const departureCity = searchParams.get('departure_city') // Fixed typo
  const destCity = searchParams.get('dest_city')
  const query = searchParams.get('q')

  // Function to fetch trips based on search parameters
  const fetchTrips = async () => {
    console.log('Fetching trips with:', {
      departureCity,
      destCity,
      query
    });
    try {
      // Build query parameters more cleanly
      const params = new URLSearchParams();
      if (departureCity) params.append('departure_city', departureCity);
      if (destCity) params.append('dest_city', destCity);
      if (query) params.append('q', query);
      
      const response = await fetch(`/api/client/trips?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTrips(data);

      console.log('Fetched trips:', data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips(null); // Set to null to indicate error state
    }
  }

  // Fetch trips when the component mounts or when search parameters change
  useEffect(() => {
    fetchTrips();
  }, [departureCity, destCity, query]);

  return (
    <div>
      <TripsViewer trips={trips}/>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

function page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TripsContent />
    </Suspense>
  )
}

export default page