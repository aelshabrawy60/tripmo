import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Loader, RefreshCw, AlertCircle } from 'lucide-react';
import BookingRecord from './BookingRecord';

export default function BookingRecordsList({groupId}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch bookings data
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      let url = `/api/dashboard/bookings?groupId=${groupId}`;
      
      // Add time filter parameters based on selection
      if (timeFilter !== 'all') {
        let filterStart, filterEnd;
        const now = new Date();
        filterEnd = now.toISOString();
        
        switch (timeFilter) {
          case '24hours':
            // Last 24 hours
            filterStart = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();
            break;
          case 'week':
            // Last week
            filterStart = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();
            break;
          case 'month':
            // Last month
            filterStart = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString();
            break;
        }
        
        url += `&filterStart=${encodeURIComponent(filterStart)}&filterEnd=${encodeURIComponent(filterEnd)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`فشل في جلب البيانات: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh bookings data
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings().finally(() => {
      setTimeout(() => setRefreshing(false), 500);
    });
  };

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search term and status
  // Note: Date filtering is now handled server-side through API parameters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.client_phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className=" mx-auto px-4 py-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">قائمة الحجوزات</h1>
        <button 
          onClick={handleRefresh} 
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
          disabled={loading || refreshing}
        >
          <RefreshCw className={`ml-2 w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5"
              placeholder="بحث باسم العميل أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="w-full md:w-48">
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
              <div className="px-3">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                className="bg-transparent border-0 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="cancelled">ملغي</option>
                <option value="completed">مكتمل</option>
              </select>
            </div>
          </div>

          {/* Time period filter */}
          <div className="w-full md:w-48">
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg">
              <div className="px-3">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <select
                className="bg-transparent border-0 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none"
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value);
                  // Trigger refetch when time period changes
                  setTimeout(() => fetchBookings(), 100);
                }}
              >
                <option value="all">كل الفترات</option>
                <option value="24hours">آخر 24 ساعة</option>
                <option value="week">آخر أسبوع</option>
                <option value="month">آخر شهر</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="mr-3 text-lg text-gray-700">جاري التحميل...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <div className="flex">
            <AlertCircle className="w-5 h-5 ml-2" />
            <span className="block sm:inline">حدث خطأ أثناء تحميل البيانات: {error}</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد حجوزات</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || timeFilter !== 'all' 
              ? 'لا توجد حجوزات مطابقة لمعايير البحث الخاصة بك'
              : 'لا توجد حجوزات في النظام، سيتم عرضها هنا بمجرد إضافتها'}
          </p>
        </div>
      )}

      {/* Bookings list */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <BookingRecord key={booking.id} bookData={booking} />
          ))}
          
          <div className="text-center text-gray-500 mt-4">
            تم عرض {filteredBookings.length} {filteredBookings.length === 1 ? 'حجز' : 'حجوزات'} 
            {filteredBookings.length !== bookings.length && ` من أصل ${bookings.length}`}
          </div>
        </div>
      )}
    </div>
  );
}