import { supabaseAdmin } from "@/utils/supabase/service";

export async function fetchTrips(filters = {}) {
  const {
    group_id,
    page = 1,
    limit = 50,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters;

  // Add { count: 'exact' } to get the total count
  let query = supabaseAdmin
    .from("trips")
    .select("*", { count: 'exact' });

  // Apply group_id filter
  if (group_id) {
    query = query.eq('group_id', group_id);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
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
