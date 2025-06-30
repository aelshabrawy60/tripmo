// utils/refunds.js
import { supabaseAdmin } from "@/utils/supabase/service";

export async function fetchRefunds(filters = {}) {
  const {
    timeFilter,
    startDate,
    endDate,
    status,
    bookId,
    transactionId,
    page = 1,
    limit = 50,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters;

  // Add { count: 'exact' } to get the total count
  let query = supabaseAdmin
    .from("refunds")
    .select("*", { count: 'exact' });

  // Apply time-based filters
  if (timeFilter && timeFilter !== 'custom') {
    const now = new Date();
    let filterDate;

    switch (timeFilter) {
      case 'last24h':
        filterDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'lastWeek':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last3Months':
        filterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'lastYear':
        filterDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        filterDate = new Date(0);
    }

    if (timeFilter !== 'custom') {
      query = query.gte('created_at', filterDate.toISOString());
    }
  }

  // Apply custom date range
  if (timeFilter === 'custom') {
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDateTime.toISOString());
    }
  }

  // Apply advanced filters
  if (status) {
    query = query.eq('status', status);
  }

  if (bookId) {
    query = query.eq('book_id', parseInt(bookId));
  }

  if (transactionId) {
    query = query.eq('transactionId', transactionId);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  console.log("query", query);

  const { data, error, count } = await query;

  console.log("data", data);
  console.log("count", count); // This should now show the actual count

  if (error) {
    console.log(error);
    throw error;
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data || [],
    total: count || 0,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

export async function getRefundStats(filters = {}) {
  let query = supabaseAdmin
    .from("refunds")
    .select("id, status, created_at");

  // Apply the same time filters as the main function
  if (filters.timeFilter && filters.timeFilter !== 'custom') {
    const now = new Date();
    let filterDate;

    switch (filters.timeFilter) {
      case 'last24h':
        filterDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'lastWeek':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last3Months':
        filterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'lastYear':
        filterDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    if (filterDate) {
      query = query.gte('created_at', filterDate.toISOString());
    }
  }

  if (filters.timeFilter === 'custom') {
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters.endDate) {
      const endDateTime = new Date(filters.endDate);
      endDateTime.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endDateTime.toISOString());
    }
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const refunds = data || [];
  
  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => r.status === 'PENDING').length,
    completed: refunds.filter(r => r.status === 'SUCCESS').length,
    rejected: refunds.filter(r => r.status === 'REJECTED').length,
    cancelled: refunds.filter(r => r.status === 'CANCELLED').length,
    processing: refunds.filter(r => r.status === 'PROCESSING').length,
  };

  return stats;
}

// Additional utility function to get refund by transaction ID
export async function getRefundByTransactionId(transactionId) {
  const { data, error } = await supabaseAdmin
    .from("refunds")
    .select("*")
    .eq('transactionId', transactionId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Additional utility function to get refunds by book ID
export async function getRefundsByBookId(bookId) {
  const { data, error } = await supabaseAdmin
    .from("refunds")
    .select("*")
    .eq('book_id', parseInt(bookId))
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}