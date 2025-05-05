import React, { useState } from 'react';
import { Check, X, Edit, RefreshCw, Power, AlertTriangle, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { gates } from './gates';

function PaymentGateCard({ GateData, onRefresh }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Find gate icon from gates array
  const gateInfo = gates.find((gate) => gate.name === GateData?.name);
  
  // Handle toggle active/inactive status
  const toggleActivation = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    
    try {
      const response = await fetch('/api/dashboard/payments/gates/active', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gateId: GateData.id,
          activate: GateData.status !== 'active'
        }),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تغيير حالة البوابة');
      }
      
      setUpdateSuccess(GateData.status === 'active' ? 'تم تعطيل البوابة بنجاح' : 'تم تفعيل البوابة بنجاح');
      
      // Call refresh function from parent if available
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating gate status:', error);
      setUpdateError('حدث خطأ أثناء تحديث حالة البوابة');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
      {/* Card Header */}
      <div className={`p-4 ${isExpanded ? 'border-b border-gray-100' : ''}`}>
        <div className="flex justify-between">
          {/* Gate Icon and Name */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
              {gateInfo?.icon ? (
                <img 
                  src={gateInfo.icon} 
                  alt={GateData?.name} 
                  className="w-10 h-10 object-contain" 
                />
              ) : (
                <CreditCard className="w-6 h-6 text-blue-500" />
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800">{GateData?.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  GateData?.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {GateData?.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
                {GateData?.mode && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    GateData?.mode === 'live' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {GateData?.mode === 'live' ? 'تشغيل فعلي' : 'اختبار'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        {updateSuccess && (
          <div className="mt-3 bg-green-50 text-green-700 p-2 rounded-md text-sm flex items-center gap-1">
            <Check size={14} />
            <span>{updateSuccess}</span>
          </div>
        )}
        
        {updateError && (
          <div className="mt-3 bg-red-50 text-red-700 p-2 rounded-md text-sm flex items-center gap-1">
            <AlertTriangle size={14} />
            <span>{updateError}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className={`flex justify-end gap-2 mt-3 ${isExpanded ? 'border-t border-gray-100 pt-3' : ''}`}>
          <button
            onClick={toggleActivation}
            disabled={isUpdating}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all
              ${GateData?.status === 'active' 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-green-500 text-white hover:bg-green-600'}
              ${isUpdating ? 'opacity-70 cursor-wait' : ''}
            `}
          >
            <Power size={14} className={isUpdating ? 'animate-pulse' : ''} />
            {GateData?.status === 'active' ? 'تعطيل' : 'تفعيل'}
          </button>
          
          <button
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-all text-sm font-medium flex items-center gap-1.5"
          >
            <Edit size={14} />
            تعديل
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateCard;