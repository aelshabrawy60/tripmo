"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import TripAdminCard from './TripAdminCard';
import LoadingCirc from '../Loading/LoadingCirc';

function TripsAdminList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    group_id: '',
    status: '',
    page: 1,
    limit: 20,
    sortBy: 'created_at',
    sortOrder: 'desc'
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
      // Build query parameters
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });
            
      const response = await fetch(`/api/admin/trips?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTrips(data.data);
        setPagination({
          total: data.total,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage
        });

        // Calculate stats
        const activeTrips = data.data.filter(trip => trip.status === 'active');
        const inactiveTrips = data.data.filter(trip => trip.status !== 'active');
        setStats({
          total: data.total,
          active: activeTrips.length,
          inactive: inactiveTrips.length
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
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Group ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              معرف المجموعة
            </label>
            <input
              type="text"
              value={filters.group_id}
              onChange={(e) => handleFilterChange('group_id', e.target.value)}
              placeholder="معرف المجموعة"
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">كل الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="created_at-desc">الأحدث أولاً</option>
              <option value="created_at-asc">الأقدم أولاً</option>
              <option value="score-desc">التقييم من الأعلى للأقل</option>
              <option value="score-asc">التقييم من الأقل للأعلى</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Stats Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-1">إجمالي الرحلات</h3>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full group-hover:bg-blue-300 transition-colors duration-200">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        {/* Active Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-emerald-700 mb-1">نشط</h3>
              <p className="text-3xl font-bold text-emerald-900">{stats.active}</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-full group-hover:bg-emerald-300 transition-colors duration-200">
              <CheckCircle className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* Inactive Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">غير نشط</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors duration-200">
              <XCircle className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          عرض {trips.length} من {pagination.total} رحلة
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">لكل صفحة:</label>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

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
        <div className="space-y-4">
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">لم يتم العثور على رحلات</p>
              <p className="text-gray-400">حاول تعديل الفلاتر</p>
            </div>
          ) : (
            trips.map((trip) => (
              <TripAdminCard key={trip.id} data={trip} onStatusChange={fetchTrips}/>
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

export default TripsAdminList;
