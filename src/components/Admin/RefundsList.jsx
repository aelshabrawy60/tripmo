"use client"

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Clock, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import RefundRecord from './RefundRecord'; // Your RefundRecord component
import LoadingCirc from '../Loading/LoadingCirc';

function RefundsList() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    timeFilter: 'allTime',
    startDate: '',
    endDate: '',
    status: '',
    bookId: '',
    transactionId: '',
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

  // Fetch refunds
  const fetchRefunds = async () => {
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
      
      const response = await fetch(`/api/admin/refunds?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRefunds(data.data);
        console.log("data", data)
        setPagination({
          total: data.total,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage
        });
        setStats(data.stats);
      } else {
        setError(data.message || 'Failed to fetch refunds');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching refunds:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchRefunds();
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
      bookId: '',
      transactionId: '',
      page: 1,
      limit: 20,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
  };

  // Export data (placeholder)
  const exportData = () => {
    console.log('تصدير البيانات...', refunds);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Time Filter */}
          <div>
            <select
              value={filters.timeFilter}
              onChange={(e) => handleFilterChange('timeFilter', e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">كل الأوقات</option>
              <option value="last24h">آخر 24 ساعة</option>
              <option value="lastWeek">الأسبوع الماضي</option>
              <option value="lastMonth">الشهر الماضي</option>
              <option value="last3Months">آخر 3 شهور</option>
              <option value="lastYear">العام الماضي</option>
              <option value="custom">نطاق مخصص</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {filters.timeFilter === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ البداية
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ النهاية
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </>
          )}

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">كل الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">موافق عليه</option>
              <option value="rejected">مرفوض</option>
              <option value="completed">مكتمل</option>
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
              <option value="amount-desc">المبلغ من الأعلى للأقل</option>
              <option value="amount-asc">المبلغ من الأقل للأعلى</option>
            </select>
          </div>

          {/* Toggle Advanced Filters */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            {showAdvancedFilters ? 'إخفاء' : 'إظهار'} الفلاتر المتقدمة
          </button>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium"
          >
            إعادة تعيين
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الحجز
                </label>
                <input
                  type="text"
                  value={filters.bookId}
                  onChange={(e) => handleFilterChange('bookId', e.target.value)}
                  placeholder="رقم الحجز"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم المعاملة
                </label>
                <input
                  type="text"
                  value={filters.transactionId}
                  onChange={(e) => handleFilterChange('transactionId', e.target.value)}
                  placeholder="رقم المعاملة"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Stats Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-purple-700 mb-1">إجمالي الاسترداد</h3>
                <p className="text-3xl font-bold text-purple-900">{stats.total.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full group-hover:bg-purple-300 transition-colors duration-200">
                <BookOpen className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-yellow-700 mb-1">قيد المراجعة</h3>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending?.toLocaleString() || '0'}</p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-full group-hover:bg-yellow-300 transition-colors duration-200">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-emerald-700 mb-1">موافق عليه</h3>
                <p className="text-3xl font-bold text-emerald-900">{stats.approved?.toLocaleString() || '0'}</p>
              </div>
              <div className="p-3 bg-emerald-200 rounded-full group-hover:bg-emerald-300 transition-colors duration-200">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
          </div>

          {/* Rejected Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-700 mb-1">مرفوض</h3>
                <p className="text-3xl font-bold text-red-900">{stats.rejected?.toLocaleString() || '0'}</p>
              </div>
              <div className="p-3 bg-red-200 rounded-full group-hover:bg-red-300 transition-colors duration-200">
                <XCircle className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          عرض {refunds.length} من {pagination.total} استرداد
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
            onClick={fetchRefunds}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            حاول مرة أخرى
          </button>
        </div>
      )}

      {/* Refunds List */}
      {!loading && !error && (
        <div className="space-y-4">
          {refunds.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لم يتم العثور على طلبات استرداد</p>
              <p className="text-gray-400">حاول تعديل الفلاتر</p>
            </div>
          ) : (
            refunds.map((refund) => (
              <RefundRecord key={refund.id} data={refund} />
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
                      ? 'bg-purple-600 text-white border-purple-600'
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

export default RefundsList;