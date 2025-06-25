import { supabaseAdmin } from "../supabase/service";
import { unstable_cache } from 'next/cache'


export async function filterTripsByLocation(depatureLoctionId, destLocationId) {
    try {
        // Start building the query
        let query = supabaseAdmin
            .from("trips")
            .select("*")
            .eq("status", "active");


        if(destLocationId != null && depatureLoctionId != null){
            query = query.eq("dest_city", destLocationId).eq("depature_city", depatureLoctionId);
        }
        // Apply filters only if the parameter is not null/undefined
        if (depatureLoctionId != null) {
            query = query.eq("depature_city", depatureLoctionId);
        }

        if (destLocationId != null) {
            query = query.eq("dest_city", destLocationId);
        }

       

        // Execute the query
        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error("Error filtering trips by location:", error);
        throw error;
    }
}




export const TrendingDestinations = unstable_cache(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("cities")
      .select("*")
      .order("score", { ascending: false })
      .limit(5);

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  },
  ['trending-destinations'], // Cache key
  {
    revalidate: 21600, // 6 hours
    tags: ['destinations']
  }
)

export const popularTrips = unstable_cache(
  async () => {
    // Your existing logic here...
    const { data, error } = await supabaseAdmin
      .from("trips")
      .select(`
        *,
        dest:dest_city (name),
        depature:depature_city (name)
      `)
      .order("score", { ascending: false })
      .eq("status", "active")
      .limit(100);

    if (error) {
      console.error("Error fetching top trips:", error);
      return {};
    }

    if (!data || data.length === 0) {
      return { top: [], categories: [] };
    }

    const top20 = data.slice(0, 20);
    const remaining80 = data.slice(20);
    
    const cityGroups = {};
    
    remaining80.forEach(trip => {
      const cityName = trip.dest?.name || `Unknown City`;
      
      if (!cityGroups[cityName]) {
        cityGroups[cityName] = [];
      }
      cityGroups[cityName].push(trip);
    });
    
    const categories = Object.entries(cityGroups)
      .filter(([city, trips]) => trips.length >= 4)
      .map(([city, trips]) => ({
        city: city,
        trips: trips
      }));
    
    return {
      top: top20,
      categories: categories
    };
  },
  ['popular-trips'], // Cache key
  {
    revalidate: 21600, // 6 hours
    tags: ['trips']
  }
)