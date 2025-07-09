'use client';

import React, { useEffect, useState } from 'react';
import ArabicDateSelector from './PeriodSelector';
import StatsCard from './StatsCard';
import { Wallet, Clock, CheckCircle, Ticket } from 'lucide-react'
import RevenueRecords from './RevenueRecords';


const BalanceLoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Balance Cards Skeleton */}
      <div className="flex w-full flex-wrap gap-5 mb-5">
        {/* Total Balance Card Skeleton */}
        <div className="bg-gradient-to-br w-full flex-1 min-w-[300px] from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
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
        <div className="bg-gradient-to-br w-full flex-1 min-w-[300px] from-gray-400 to-gray-500 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
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
        <div className="bg-gradient-to-br w-full flex-1 min-w-[300px] from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
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

        {/* Available Balance Card Skeleton */}
        <div className="bg-gradient-to-br w-full flex-1 min-w-[300px] from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
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

        {/* Available Balance Card Skeleton */}
        <div className="bg-gradient-to-br w-full flex-1 min-w-[300px] from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
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

function RevenueStatics() {
  const [periodValue, setPeriodValue] = useState('today');
  const [loading, setLoading] = useState(false);
  const [revenue, setRevenue] = useState(null);
  const [error, setError] = useState(null);

  const fetchRevenue = async (periodInput) => {
    setLoading(true);
    setError(null);

    try {
        const params = new URLSearchParams();

        if (typeof periodInput === 'string') {
        params.set('period', periodInput);
        } else if (typeof periodInput === 'object') {
        params.set('period', 'custom');
        params.set('start_date', periodInput.start);
        params.set('end_date', periodInput.end);
        }

        const res = await fetch(`/api/admin/revenue?${params.toString()}`);
        const json = await res.json();

        if (!res.ok) {
        throw new Error(json.error || 'Unknown error');
        }

        // Sort by created_at descending
        json.revenue.deposits = json.revenue.deposits?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setRevenue(json.revenue);
    } catch (err) {
        console.error(err);
        setError(err.message || 'حدث خطأ ما');
    } finally {
        setLoading(false);
    }
    };


  useEffect(() => {
    fetchRevenue(periodValue);
  }, [periodValue]);

  return (
    <div className="mx-auto p-4">
      <ArabicDateSelector onChange={setPeriodValue} />

      <div className="mt-2">
        {loading ? (
          <BalanceLoadingSkeleton/>
        ) : error ? (
          <p className="text-sm text-red-500">خطأ: {error}</p>
        ) : revenue ? (
            <>
        <div className="flex w-full flex-wrap gap-5 mb-5">
            <StatsCard
                name="عدد الحجوزات"
                value={revenue.total_deposits_count}
                icon={Ticket}
                color="from-blue-500 to-blue-600"
                desc={"إجمالي الحجوزات"}
            />
            <StatsCard
                name="إجمالي الإيرادات"
                value={revenue.total_revenue}
                icon={Wallet}
                color="from-blue-500 to-blue-600"
                isCurrency={true}
                desc={"الإيرادات"}
            />
            <StatsCard
                name="الإيرادات المعلقة"
                value={revenue.pending_revenue}
                icon={Clock}
                color="from-gray-400 to-gray-500"
                isCurrency={true}
                desc={"قابلة للاسترداد"}
            />
            <StatsCard
                name="الإيرادات النهائية"
                value={revenue.final_revenue}
                icon={CheckCircle}
                color="from-green-500 to-emerald-600"
                isCurrency={true}
                desc={"لا يمكن استردادها"}
            />
            <StatsCard
                name="المتوسط للحجز"
                value={revenue.total_revenue / revenue.total_deposits_count}
                icon={Ticket}
                color="from-blue-500 to-blue-600"
                isCurrency={true}
                desc={"متوسط الايرادات لكل حجز"}
            />
        </div>
        <div>
            <RevenueRecords records={revenue.deposits}/>
        </div>
        </>

        ) : (
          <p className="text-sm text-gray-500">لا توجد بيانات.</p>
        )}
      </div>
    </div>
  );
}

export default RevenueStatics;
