import React, { useEffect, useState } from 'react'
import WithdrawRecord from './WithdrawRecord';
import Loading from '../Loading';
import LoadingCirc from '../Loading/LoadingCirc';

// Main component that fetches and displays all records
function WithdrawRecordsList({ groupId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWithdrawRecords = async () => {
      if (!groupId) {
        setError('معرف المجموعة مطلوب');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/dashboard/withdraw?group_id=${groupId}`);
        
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات');
        }

        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }

        setRecords(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawRecords();
  }, [groupId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12" dir="rtl">
        <LoadingCirc/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center" dir="rtl">
        <div className="text-red-600 font-medium">خطأ في تحميل البيانات</div>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        <button 
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12" dir="rtl">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد عمليات سحب</h3>
        <p className="text-gray-500">لم يتم العثور على أي عمليات سحب لهذه المجموعة</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-tripmo-500 rounded-t-lg p-4 mb-6">
        <h2 className="text-white text-xl font-bold text-center">سجل عمليات السحب</h2>
      </div>
      
      <div className="space-y-0">
        {records.map((record, index) => (
          <WithdrawRecord key={record.id || index} data={record} />
        ))}
      </div>
    </div>
  );
}


export default WithdrawRecordsList