import { supabaseAdmin } from "@/utils/supabase/service";

export async function fetchBookings(filters) {
  // First, get the total count
  const countQuery = supabaseAdmin
    .from("bookings")
    .select('*', { count: 'exact', head: true });

  // Apply the same filters to both queries
  if (filters.timeFilter) {
    const now = new Date();
    switch (filters.timeFilter) {
      case 'today':
        countQuery.gte('created_at', new Date(now.setHours(0,0,0,0)).toISOString());
        break;
      case 'week':
        countQuery.gte('created_at', new Date(now.setDate(now.getDate() - 7)).toISOString());
        break;
      case 'month':
        countQuery.gte('created_at', new Date(now.setMonth(now.getMonth() - 1)).toISOString());
        break;
      case 'custom':
        if (filters.startDate) {
          countQuery.gte('created_at', new Date(filters.startDate).toISOString());
        }
        if (filters.endDate) {
          countQuery.lte('created_at', new Date(filters.endDate).toISOString());
        }
        break;
    }
  }

  if (filters.status) {
    countQuery.eq('status', filters.status);
  }

  if (filters.tripId) {
    countQuery.eq('trip_id', filters.tripId);
  }

  if (filters.clientId) {
    countQuery.eq('client_id', filters.clientId);
  }

  if (filters.bookId) {
    countQuery.eq('id', filters.bookId);
  }

  if (filters.minAmount) {
    countQuery.gte('total_price', filters.minAmount);
  }

  if (filters.maxAmount) {
    countQuery.lte('total_price', filters.maxAmount);
  }

  // Get the count
  const { count, error: countError } = await countQuery;

  if (countError) {
    console.error("Error getting count:", countError);
    throw countError;
  }

  // Now get the actual data
  let query = supabaseAdmin
    .from("bookings")
    .select(`
      *,
      trips (
        id,
        name,
        images
      ),
      clients (
        id,
        name,
        phone
      ),
      deposits (
        id,
        amount,
        net_amount,
        status
      )`);

  // Apply the same filters
  if (filters.timeFilter) {
    const now = new Date();
    switch (filters.timeFilter) {
      case 'today':
        query = query.gte('created_at', new Date(now.setHours(0,0,0,0)).toISOString());
        break;
      case 'week':
        query = query.gte('created_at', new Date(now.setDate(now.getDate() - 7)).toISOString());
        break;
      case 'month':
        query = query.gte('created_at', new Date(now.setMonth(now.getMonth() - 1)).toISOString());
        break;
      case 'custom':
        if (filters.startDate) {
          query = query.gte('created_at', new Date(filters.startDate).toISOString());
        }
        if (filters.endDate) {
          query = query.lte('created_at', new Date(filters.endDate).toISOString());
        }
        break;
    }
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.tripId) {
    query = query.eq('trip_id', filters.tripId);
  }

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  if (filters.bookId) {
    query = query.eq('id', filters.bookId);
  }

  if (filters.minAmount) {
    query = query.gte('total_price', filters.minAmount);
  }

  if (filters.maxAmount) {
    query = query.lte('total_price', filters.maxAmount);
  }

  if(!filters.status){
    query = query.in('status', ["active", "canceled"])
  }

  // Calculate pagination
  const from = (filters.page - 1) * filters.limit;
  const to = from + filters.limit - 1;

  // Apply sorting and pagination
  query = query
    .order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })
    .range(from, to);

  // Execute query
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }

  const totalPages = Math.ceil(count / filters.limit);

  return {
    data,
    total: count,
    page: filters.page,
    totalPages
  };
}

export async function getBookingStats(filters) {
  let query = supabaseAdmin
    .from("bookings")
    .select(`
      id,
      status,
      total_price,
      deposite_price,
      created_at
    `);

  query = query.in("status", ["active", "canceled"])
  // Apply the same filters as in fetchBookings
  if (filters.timeFilter) {
    const now = new Date();
    switch (filters.timeFilter) {
      case 'today':
        query = query.gte('created_at', new Date(now.setHours(0,0,0,0)).toISOString());
        break;
      case 'week':
        query = query.gte('created_at', new Date(now.setDate(now.getDate() - 7)).toISOString());
        break;
      case 'month':
        query = query.gte('created_at', new Date(now.setMonth(now.getMonth() - 1)).toISOString());
        break;
      case 'custom':
        if (filters.startDate) {
          query = query.gte('created_at', new Date(filters.startDate).toISOString());
        }
        if (filters.endDate) {
          query = query.lte('created_at', new Date(filters.endDate).toISOString());
        }
        break;
    }
  }

  // Execute query
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching booking stats:", error);
    throw error;
  }

  // Calculate statistics
  const stats = {
    totalBookings: data.length,
    totalAmount: 0,
    totalDeposits: 0,
    completedBookings: 0,
    pendingBookings: 0,
    canceledBookings: 0
  };

  data.forEach(booking => {
    stats.totalAmount += booking.total_price || 0;
    stats.totalDeposits += booking.deposite_price || 0;

    switch (booking.status) {
      case 'active':
        stats.completedBookings++;
        break;
      case 'pending':
        stats.pendingBookings++;
        break;
      case 'canceled':
        stats.canceledBookings++;
        break;
    }
  });

  return stats;
}
