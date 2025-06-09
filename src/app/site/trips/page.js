"use client"
import TripsViewer from '@/components/website/TripsViewer'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

function page() {
  const [trips, setTrips] = useState()
  const searchParams = useSearchParams()

  const departureCity = searchParams.get('depature_city')
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
            const response = await fetch(`/api/client/trips?${departureCity != null ? `depature_city=${departureCity}` : ''}${destCity != null ? `&dest_city=${destCity}` : ''}${query != null ? `&q=${query}` : ''}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTrips(data);

            console.log('Fetched trips:', data);
        } catch (error) {
            console.error('Error fetching trips:', error);
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

export default page