// utils/withdraws.js
import { supabaseAdmin } from "@/utils/supabase/service";

export async function fetchWithdraws(filters = {}) {
  const {
    timeFilter,
    startDate,
    endDate,
    status,
    methodId,
    groupId,
    minAmount,
    maxAmount,
    userId,
    page = 1,
    limit = 50,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters;

  let query = supabaseAdmin
    .from("withdraws")
    .select("*, withdraw_methodes(*), Group(name, id)");

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

  if (methodId) {
    query = query.eq('method_id', parseInt(methodId));
  }

  if (groupId) {
    query = query.eq('group_id', parseInt(groupId));
  }

  if (userId) {
    query = query.eq('user_id', userId);
  }

 

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  console.log("query", query)


  const { data, error, count } = await query;

  console.log("data", data)
  if (error) {
    console.log(error)
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

export async function getWithdrawStats(filters = {}) {
  let query = supabaseAdmin
    .from("withdraws")
    .select("amount, status, created_at");

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

  const withdraws = data || [];
  
  const stats = {
    total: withdraws.length,
    totalAmount: withdraws.reduce((sum, w) => sum + (parseFloat(w.amount) || 0), 0),
    pending: withdraws.filter(w => w.status === 'pending').length,
    completed: withdraws.filter(w => w.status === 'completed').length,
    rejected: withdraws.filter(w => w.status === 'rejected').length,
    processing: withdraws.filter(w => w.status === 'processing').length,
  };

  return stats;
}
