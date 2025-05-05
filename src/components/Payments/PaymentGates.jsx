import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Plus } from 'lucide-react';
import AddPaymentGate from './AddPaymentGate';
import PaymentGateCard from './PaymentGateCard';


function PaymentGates({ groupId }) {
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = groupId 
        ? `/api/dashboard/payments/gates?groupId=${encodeURIComponent(groupId)}`
        : '/api/dashboard/payments/gates';
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`فشل في جلب بوابات الدفع: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.data) {
        setGates(result.data);
      } else {
        setGates([]);
      }
    } catch (err) {
      console.error('Error fetching payment gates:', err);
      setError(err.message || 'حدث خطأ أثناء جلب بوابات الدفع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGates();
  }, [groupId]);

  return (
    <div className="font-sans" dir="rtl">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">بوابات الدفع</h2>
        <AddPaymentGate onSuccess={fetchGates} groupId={groupId} onAdd={fetchGates}/>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-2">
          <AlertTriangle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mr-3 text-gray-600">جاري التحميل...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && gates.length === 0 && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">لا توجد بوابات دفع</h3>
          <p className="text-gray-500 mb-4">لم يتم إضافة أي بوابات دفع بعد.</p>
          <AddPaymentGate onSuccess={fetchGates} buttonStyle="primary" groupId={groupId} onAdd={fetchGates}/>
        </div>
      )}

      {/* Payment Gates Grid */}
      {!loading && gates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gates.map((gate) => (
            <PaymentGateCard 
              key={gate.id} 
              gate={gate} 
              onRefresh={fetchGates}
              GateData={gate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentGates;