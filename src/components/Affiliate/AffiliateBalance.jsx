'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Loader2, RefreshCw, Wallet, CheckCircle, Clock } from 'lucide-react';

// Import or define the skeleton component
const AffiliateBalanceLoadingSkeleton = () => {
  return (
    <div className="space-y-6 p-4" dir="rtl">
      {/* Balance Cards Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Balance Card Skeleton */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <div className="h-8 w-8 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-white/30 rounded mb-2 w-24 animate-pulse"></div>
              <div className="h-8 bg-white/30 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <div className="h-3 bg-white/20 rounded w-full animate-pulse"></div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Pending Balance Card Skeleton */}
        <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <div className="h-8 w-8 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-white/30 rounded mb-2 w-24 animate-pulse"></div>
              <div className="h-8 bg-white/30 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <div className="space-y-2">
              <div className="h-3 bg-white/20 rounded w-full animate-pulse"></div>
              <div className="h-3 bg-white/20 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Available Balance Card Skeleton */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <div className="h-8 w-8 bg-white/30 rounded animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-white/30 rounded mb-2 w-24 animate-pulse"></div>
              <div className="h-8 bg-white/30 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <div className="h-3 bg-white/20 rounded w-4/5 animate-pulse"></div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default function AffiliateBalanceDisplay() {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalances = async () => {    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/affiliate/balance`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في جلب البيانات');
      }
      
      setBalanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Replace the old loading state with the skeleton
  if (loading) {
    return <AffiliateBalanceLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-8 shadow-lg border border-red-200" dir="rtl">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-red-800 font-bold text-lg mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBalances}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 space-x-reverse mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4" dir="rtl">
      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <Wallet className="h-8 w-8" />
            </div>
            <div className="">
              <p className="text-emerald-100 text-sm font-medium mb-1">الرصيد الإجمالي</p>
              <h3 className="text-3xl font-bold">{formatCurrency(balanceData?.total_balance)}</h3>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <p className="text-emerald-100 text-sm">
              جميع المدفوعات الوارده
            </p>
          </div>
        </div>

        {/* pending Balance Card */}
        <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <Clock  className="h-8 w-8" />
            </div>
            <div className="">
              <p className="text-blue-100 text-sm font-medium mb-1">الرصيد المعلق</p>
              <h3 className="text-3xl font-bold">{formatCurrency((balanceData?.total_balance || 0) - (balanceData?.aval_balance || 0))}</h3>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <p className="text-blue-100 text-sm">
              المدفوعات التي لم يمر علي موعد بدء رحلتها اكثر من يوم 
            </p>
          </div>
        </div>

        {/* Available Balance Card */}
        <a href='/withdraw' className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <CheckCircle  className="h-8 w-8" />
            </div>
            <div className="">
              <p className="text-blue-100 text-sm font-medium mb-1">الرصيد المتاح</p>
              <h3 className="text-3xl font-bold">{formatCurrency(balanceData?.aval_balance)}</h3>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-4">
            <p className="text-blue-100 text-sm">
                اضغط للسحب
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}