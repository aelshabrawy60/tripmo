import React from 'react';

function StatsCard({ name, desc, value, icon: Icon, color = 'from-blue-500 to-purple-600', isCurrency = false }) {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const displayValue = isCurrency ? formatCurrency(value) : value;

  return (
    <div className='w-full flex-1 min-w-[300px]'>
      <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 rounded-full p-3">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1">{name}</p>
            <h3 className="text-2xl font-bold">{displayValue}</h3>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4">
          <p className="text-emerald-100 text-sm">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
