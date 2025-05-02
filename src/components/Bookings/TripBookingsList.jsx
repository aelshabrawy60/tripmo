import React, { useEffect, useState } from 'react';
import BookingRecord from './BookingRecord';
import { motion } from 'framer-motion';
import AddBooking from './AddBooking';
import BookingCard from './BookingCard';

function TripBookingsList({ tripData, date, groupId, refreshTrigger = 0}) {
  const tripId  = tripData.id;
  const [tripBookings, setTripBookings] = useState([]);
  const [seatsInfo, setSeatsInfo] = useState({ availableSeats: 0, maxSeats: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trip bookings based on tripId and date
  const fetchTripBookings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/dashboard/bookings?tripId=${tripId}&tripDate=${tripData.availability_type == "fixed"? tripData.available_day : date}`);
      if (!response.ok) {
        throw new Error(`Error fetching trip bookings: ${response.status}`);
      }
      const data = await response.json();
      setSeatsInfo({
        availableSeats: data.availableSeats || 0,
        maxSeats: data.maxSeats || 0,
      });
      return data.data || [];
    } catch (error) {
      console.error("Error fetching trip bookings:", error);
      setError("Failed to load bookings. Please try again later.");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Call the fetch function and handle the data
  useEffect(() => {
    console.log("Fetching trip bookings for tripId:", tripId, "and date:", date);
    const getTripBookings = async () => {
      const bookings = await fetchTripBookings();
      console.log("Fetched bookings:", bookings);
      setTripBookings(bookings);
    };
    getTripBookings();
  }, [tripId, date, refreshTrigger]);

  // Calculate booking percentage
  const bookedPercentage = seatsInfo.maxSeats ? 
    ((seatsInfo.maxSeats - seatsInfo.availableSeats) / seatsInfo.maxSeats) * 100 : 0;

  const renderSeatsInfo = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">معلومات الحجز</h2>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">عدد الاماكن المحجوزه:</span>
          <span className="text-indigo-600 font-bold text-xl">
            {seatsInfo.maxSeats - seatsInfo.availableSeats}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700 font-medium">عدد الاماكن المتاحه:</span>
          <span className="text-green-600 font-bold text-xl">{seatsInfo.availableSeats}</span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>0%</span>
            <span>{Math.round(bookedPercentage)}% محجوز</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-indigo-600" 
              style={{ width: `${bookedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
        <div className="bg-gray-200 h-20 rounded-lg mb-3"></div>
        <div className="bg-gray-200 h-20 rounded-lg mb-3"></div>
        <div className="bg-gray-200 h-20 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium">
          <span className="mr-2">⚠️</span>
          {error}
        </p>
        <button 
          onClick={() => fetchTripBookings()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderSeatsInfo()}

      <div className="p-1 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b mb-2 border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">قائمة الحجوزات</h2>
        </div>

        {tripBookings.length > 0 ? (
          <div className="gap-1 flex flex-col">
            {tripBookings.map((booking, index) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BookingCard bookData={booking} type={1}/>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 text-center">
            <svg 
              className="mx-auto h-16 w-16 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="mt-4 text-gray-600"> لا توجد حجوزات لهذه الرحلة في هذا اليوم</p>
            <p className="text-sm text-gray-500 mt-2">
              عندما يتم إجراء حجوزات، ستظهر هنا
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripBookingsList;