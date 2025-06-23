import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, CreditCard, Wallet, Building2, CheckCircle } from 'lucide-react';
import { banks } from './WithdrawManager';

function WithdrawConfirmation({ groupId, withdrawMethod }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchBalance = async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/dashboard/balance?groupId=${groupId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في جلب البيانات');
      }
      
      setBalance(data.aval_balance);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [groupId]);

  const handleWithdraw = async () => {
    if (!groupId || !withdrawMethod?.id) return;
    
    setWithdrawing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dashboard/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_id: groupId,
          withdraw_method_id: withdrawMethod.id
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'فشل في عملية السحب');
      }
      
      setSuccess(true);
      // Refresh balance after successful withdrawal
      setTimeout(() => {
        fetchBalance();
      }, 1000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'bank':
        return <Building2 className="w-5 h-5" />;
      case 'instant wallet':
        return <Wallet className="w-5 h-5" />;
      case 'card':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case 'bank':
        return 'تحويل بنكي';
      case 'instant wallet':
        return 'محفظة';
      case 'card':
        return 'بطاقة';
      default:
        return method;
    }
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP'
    }).format(amount);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">تم السحب بنجاح!</h3>
        <p className="text-gray-600 mb-6">سيتم معالجة طلب السحب في أقرب وقت ممكن</p>
        <a
          href='/dashboard/payments/withdraws'
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          موافق
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-tripmo-500 p-6 text-white">
        <h2 className="text-2xl font-bold text-center mb-2">تأكيد السحب</h2>
        <p className="text-blue-100 text-center">تأكد من البيانات قبل المتابعة</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Balance Display */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">الرصيد المتاح</span>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {loading ? (
                <div className="animate-pulse bg-gray-300 h-6 w-20 rounded"></div>
              ) : balance !== null ? (
                <span className="text-2xl font-bold text-green-600">
                  {formatBalance(balance)}
                </span>
              ) : (
                <span className="text-red-500">--</span>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawal Method Details */}
        {withdrawMethod && (
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {getMethodIcon(withdrawMethod.methode)}
              طريقة السحب
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">النوع:</span>
                <span className="font-medium text-gray-900">
                  {getMethodLabel(withdrawMethod.methode)}
                </span>
              </div>
              
              {withdrawMethod.bank && (
                <div className="flex justify-between">
                  <span className="text-gray-600">البنك:</span>
                  <span className="font-medium text-gray-900">
                    {banks[withdrawMethod.bank] || withdrawMethod.bank}
                  </span>
                </div>
              )}
              
              {withdrawMethod.number && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {withdrawMethod.methode === 'bank' ? 'رقم الحساب:' : 
                     withdrawMethod.methode === 'card' ? 'رقم البطاقة:' : 'رقم المحفظة:'}
                  </span>
                  <span className="font-medium text-gray-900 font-mono">
                    {withdrawMethod.number}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">خطأ</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleWithdraw}
            disabled={withdrawing || loading || !balance || !withdrawMethod}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {withdrawing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري السحب...
              </div>
            ) : (
              'تأكيد السحب'
            )}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

export default WithdrawConfirmation;