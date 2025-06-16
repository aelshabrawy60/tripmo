import { supabaseAdmin } from "@/utils/supabase/service";
// Alternative version with even better performance using a single RPC call
export async function getHostData(id) {

    // Convert string ID to integer if needed
  const groupId = parseInt(id);
  try {
    // Single database round trip using a custom RPC function
    const { data, error } = await supabaseAdmin
      .rpc('get_complete_host_data', { host_id: groupId });
    
    if (error) {
      throw new Error(`Error fetching host data: ${error.message}`);
    }

    console.log("Data", data)
    
    data.group.rating_avg = Number(data.group.rating_avg?.toFixed(1))
    return data;
  } catch (error) {
    console.error('Error in getHostDataOptimized:', error);
    throw error;
  }
}

// Cache version for frequently accessed data
const hostDataCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getHostDataCached(id) {
  const cacheKey = `host_${id}`;
  const cached = hostDataCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await getHostData(id);
  
  hostDataCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}