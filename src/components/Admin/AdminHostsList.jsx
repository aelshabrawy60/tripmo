"use client"

import React, { useState, useEffect, useCallback } from 'react';
import AdminHostCard from './AdminHostCard';
import { Loader2 } from 'lucide-react';

function AdminHostsList() {
  const [hosts, setHosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchHosts = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
      setHosts([]);
      setPage(1);
      setHasMore(true);
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/hosts?page=${isLoadMore ? page : 1}&limit=20`);
      const result = await response.json();

      if (result.success) {
        setHosts(prev => isLoadMore ? [...prev, ...result.data] : result.data);
        setHasMore(result.data.length > 0 && result.data.length === 20);
        setPage(prev => prev + 1);
      } else {
        throw new Error(result.message || 'Failed to fetch hosts');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchHosts();
  }, []);

  const handleStatusChange = (hostId, newStatus) => {
    setHosts(prevHosts =>
      prevHosts.map(host =>
        host.id === hostId ? { ...host, status: newStatus } : host
      )
    );
  };

  return (
    <div className="space-y-4">
      {hosts.map(host => (
        <AdminHostCard
          key={host.id}
          data={host}
          onStatusChange={(newStatus) => handleStatusChange(host.id, newStatus)}
        />
      ))}
      {isLoading && (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      {!isLoading && hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchHosts(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}

export default AdminHostsList;
