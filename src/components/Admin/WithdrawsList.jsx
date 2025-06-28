"use client"

import React, { useState, useEffect } from 'react';
import WithdrawRecord from './WithdrawRecord';

function WithdrawsList() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    timeFilter: 'lastWeek',
    startDate: '',
    endDate: '',
    status: '',
    methodId: '',
    groupId: '',
    minAmount: '',
    maxAmount: '',
    userId: '',
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

  // Advanced filters toggle
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch withdrawals
  const fetchWithdraws = async () => {
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
      
      // Include stats
      params.append('includeStats', 'true');
      
      const response = await fetch(`/api/admin/withdraws?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setWithdraws(data.data);
        setPagination({
          total: data.total,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage
        });
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to fetch withdrawals');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchWithdraws();
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

  // Reset filters
  const resetFilters = () => {
    setFilters({
      timeFilter: 'lastWeek',
      startDate: '',
      endDate: '',
      status: '',
      methodId: '',
      groupId: '',
      minAmount: '',
      maxAmount: '',
      userId: '',
      page: 1,
      limit: 20,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  // Export data (placeholder)
  const exportData = () => {
    // You can implement CSV export here
    console.log('Exporting data...', withdraws);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => fetchWithdraws()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
            <p className="text-2xl font-bold text-green-600">${stats.totalAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Filter
            </label>
            <select
              value={filters.timeFilter}
              onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Time</option>
              <option value="last24h">Last 24 Hours</option>
              <option value="lastWeek">Last Week</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {filters.timeFilter === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="amount-desc">Amount High to Low</option>
              <option value="amount-asc">Amount Low to High</option>
            </select>
          </div>

          {/* Toggle Advanced Filters */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
          </button>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  placeholder="999999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Method ID
                </label>
                <input
                  type="number"
                  value={filters.methodId}
                  onChange={(e) => handleFilterChange('methodId', e.target.value)}
                  placeholder="Method ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  placeholder="User ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {withdraws.length} of {pagination.total} withdrawals
        </p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Per page:</label>
          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading withdrawals...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={fetchWithdraws}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Withdrawals List */}
      {!loading && !error && (
        <div className="space-y-4">
          {withdraws.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No withdrawals found</p>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          ) : (
            withdraws.map((withdraw) => (
              <WithdrawRecord key={withdraw.id} data={withdraw} />
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
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === filters.page;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border rounded-md transition-colors ${
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
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default WithdrawsList;