import React from 'react';

function RevenueRecord({ data }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md space-y-2 border border-gray-100">
      <div className='flex items-center gap-2'>
        <div className="text-gray-600 text-sm">العمولة:</div>
        <div className="text-lg font-semibold text-blue-600">
            {formatCurrency(data.amount - data.net_amount)}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <div className="text-gray-600 text-sm">التاريخ:</div>
        <div className="text-md text-gray-800">{formatDate(data.created_at)}</div>
      </div>
    </div>
  );
}

export default RevenueRecord;
