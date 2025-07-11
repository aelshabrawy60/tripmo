import React from 'react';
import { ExternalLink, Building2, Wallet } from 'lucide-react';
import ConfirmWithdraw from './ConfirmWithdraw';

function WithdrawRecord({ data , onConfirm}) {
  // Status configuration with Arabic labels and colors
  const statusConfig = {
    pending: {
      label: 'في انتظار التأكيد',
      color: 'bg-yellow-100 text-yellow-700',
      dot: 'bg-yellow-500'
    },
    INITIATED: {
      label: 'في انتظار التأكيد',
      color: 'bg-blue-100 text-blue-700',
      dot: 'bg-blue-500'
    },
    TRANSFERRED: {
      label: 'تم التحويل',
      color: 'bg-green-100 text-green-700',
      dot: 'bg-green-500'
    },
    FAILED: {
      label: 'فشل',
      color: 'bg-red-100 text-red-700',
      dot: 'bg-red-500'
    },
    IN_TRANSIT: {
      label: 'قيد التنفيذ',
      color: 'bg-yellow-100 text-yellow-700',
      dot: 'bg-yellow-500'
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-EG', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };


  const currentStatus = statusConfig[data.status] || statusConfig.INITIATED;
  const isBank = data.withdraw_methodes?.bank;

  return (
    <div className="w-full relative">
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          {
            data.transfer_id == "manual" ?
            <div className='bg-amber-500 px-4 py-1 text-xs text-white rounded-md absolute -top-3'>يدوي</div>
            :
            null
          }
          {/* Right side - Amount and status */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <div>
              <div className="text-lg font-bold text-gray-900">{formatAmount(data.amount)}</div>
              <div className="text-sm text-gray-500">{formatDate(data.created_at)}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-reverse ${currentStatus.color}`}>
              <div className={`w-2 h-2 me-2 rounded-full ${currentStatus.dot}`}></div>
              <span>{currentStatus.label}</span>
            </div>
          </div>

          {/* Left side - Method and action */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="text-left">
              <div className="flex items-center space-x-2 space-x-reverse text-sm font-medium text-gray-700">
                {isBank ? <Building2 className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
                <span>{data.withdraw_methodes?.methode}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {isBank && data.withdraw_methodes.bank ? `${data.withdraw_methodes.bank} • ` : ''}
                {data.withdraw_methodes?.number}
              </div>
              <div className="text-xs text-gray-400">{data.Group?.name}</div>
            </div>
            <a
              href={`https://portal.kashier.io/en/dashboard/transfers/transfer-details/${data.transfer_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="عرض التفاصيل"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
        {
          data.status != "TRANSFERRED" ?
          <div className='mt-3'>
          <ConfirmWithdraw withdrawId={data.id} onConfirm={onConfirm}/> 
          </div>
          :
          null
        }
      </div>
    </div>
  );
}

export default WithdrawRecord;