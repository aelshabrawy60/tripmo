import React, { useState } from 'react';
import { Eye, EyeOff, Globe, Lock, Loader2 } from 'lucide-react';

const TripVisibilityToggle = ({ tripId, initialStatus = 'private' }) => {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isPublic = status === 'active';

  const toggleVisibility = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/trips/visibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !isPublic, tripId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'فشل في تحديث الرؤية');
      setStatus(data.trip.status);
    } catch (err) {
      setError(err.message);
      console.error('Error updating trip visibility:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={toggleVisibility}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isPublic 
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus:ring-emerald-500' 
            : 'bg-red-100 text-red-700 hover:bg-gray-200 focus:ring-gray-500'
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPublic ? (
          <Globe className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        <span>{isPublic ? 'عامة' : 'خاصة'}</span>
        
      </button>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600 flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default TripVisibilityToggle;