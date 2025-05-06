import React, { useState, useEffect } from 'react';
import PaymentCard from './PaymentCard';
import { Search, RefreshCw, FileText, AlertCircle, Loader } from 'lucide-react';

function PaymentsList({ groupId }) {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch payments on component mount and when groupId changes
  useEffect(() => {
    fetchPayments();
  }, [groupId]);

  async function fetchPayments() {
    setIsLoading(true);
    setError(null);

    try {
      const url = new URL('/api/dashboard/payments', window.location.origin);
      if (groupId) {
        url.searchParams.append('groupId', groupId);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`فشل في جلب المدفوعات: ${response.status}`);
      }

      const data = await response.json();
      setPayments(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPayments();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => 
    String(payment.amount).includes(searchTerm)
  );

  // Handler for when a payment is confirmed
  const onPaymentConfirmed = () => {
    // Refresh the list to show updated statuses
    fetchPayments();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {/* Header with search and refresh */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-2 md:space-y-0">
        <h2 className="text-xl font-bold text-gray-800">سجل المدفوعات</h2>
        
        <div className="flex space-x-2 items-center">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="تحديث"
          >
            <RefreshCw size={18} className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && !isRefreshing &&(
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="mr-3 text-lg text-gray-700">جاري التحميل...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
          <div className="flex">
            <AlertCircle size={24} className="text-red-500 mr-3" />
            <div>
              <h3 className="text-red-800 font-medium">حدث خطأ</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={fetchPayments}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                حاول مرة أخرى
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">لا توجد مدفوعات</h3>
          <p className="text-gray-500 mt-1">لم يتم العثور على أي سجلات للمدفوعات</p>
        </div>
      )}

      {/* Empty search results */}
      {!isLoading && !error && payments.length > 0 && filteredPayments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">لا توجد نتائج للبحث</h3>
          <p className="text-gray-500 mt-1">جرب استخدام كلمات بحث مختلفة</p>
        </div>
      )}

      {/* Payments list */}
      {!isLoading && !error && filteredPayments.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment) => (
            <PaymentCard 
              key={payment.book_id} 
              paymentData={payment} 
              onConfirmed={onPaymentConfirmed}
            />
          ))}
        </div>
      )}

      {/* Pagination component could be added here */}
    </div>
  );
}

export default PaymentsList;