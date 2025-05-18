import React, { useState, useEffect } from 'react';
import {Loader} from 'lucide-react';
import TripCard from './TripCard';
import Link from 'next/link';
import AddCategorie from './AddCategorie';
import Loading from '../Loading';
import LoadingCirc from '../Loading/LoadingCirc';

function TripsList({groupId}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/trips?groupId=${groupId}&`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        setTrips(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <LoadingCirc/>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center my-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center flex justify-center flex-col p-8 rounded-lg my-4">
        <p className="text-gray-600">لم يتم العثور علي رحلات</p>
        <div className='mt-6'>
          <Link href="/dashboard/trips/create" className="bg-tripmo-500 w-full md:w-auto text-center text-white py-3 px-4 rounded-lg mb-2 inline-block hover:bg-tripmo-400 transition-colors duration-300">
            إضافة رحلة جديدة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4">
      
      <div className='flex px-4'>
          <Link href="/dashboard/trips/create" className="bg-tripmo-500 w-full md:w-auto text-center text-white py-3 px-4 rounded-lg mb-2 inline-block hover:bg-tripmo-400 transition-colors duration-300">
            إضافة رحلة جديدة
          </Link>
          {/*<AddCategorie groupId={groupId}/> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {trips.map((trip) => (
          <TripCard key={trip.id} tripData={trip} />
        ))}
      </div>
    </div>
  );
}

export default TripsList;