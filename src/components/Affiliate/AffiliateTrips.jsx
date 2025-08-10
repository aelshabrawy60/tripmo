"use client"

import React, { useState, useEffect } from 'react';
import LoadingCirc from '../Loading/LoadingCirc';
import AffiliateTripCard from './AffiliateTripCard';

function AffiliateTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });
  
  // Pagination states
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Fetch trips
  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    
    try {
           
      const response = await fetch(`/api/affiliate/trips`);
      const data = await response.json();
      
      if (data.success) {
        setTrips(data.data);
        setPagination({
          total: data.total,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage
        });

      } else {
        setError(data.message || 'Failed to fetch trips');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchTrips();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <LoadingCirc/>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">خطأ: {error}</p>
          <button
            onClick={fetchTrips}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            حاول مرة أخرى
          </button>
        </div>
      )}

      {/* Trips List */}
      {!loading && !error && (
        <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لم يتم العثور على رحلات</p>
            </div>
          ) : (
            trips.map((trip) => (
              <AffiliateTripCard trip={trip} key={trip.id}/>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            السابق
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === filters.page;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 border rounded-lg transition-colors font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={!pagination.hasNextPage}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}

export default AffiliateTrips;
