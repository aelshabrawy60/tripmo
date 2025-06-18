import React, { useState, useEffect } from 'react';

// Individual record component
function WithdrawRecord({ data }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'TRANSFERRED':
      case 'مكتمل':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'معلق':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'فشل':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'TRANSFERRED':
        return 'مكتمل';
      case 'pending':
        return 'قيد المعالجة';
      case 'IN_TRANSIT':
        return 'قيد المعالجة'
      case 'INITIATED':
        return 'قيد المعالجة'
      case 'FAILED':
        return 'تحت المراجعة';
      default:
        return status;
    }
  };

  const getWithdrawMethod = (method) => {
    return method
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 mb-4" dir="rtl">
      <div className="flex items-center justify-between">
        {/* Amount and Method */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-bold text-gray-900">{data.amount} ج.م</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">
              {getWithdrawMethod(data.withdraw_methodes.number)}
            </span>
          </div>
          <p className="text-sm text-gray-500">{formatDate(data.created_at)}</p>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
            {getStatusText(data.status)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default WithdrawRecord