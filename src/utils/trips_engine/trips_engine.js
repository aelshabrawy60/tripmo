import { supabaseAdmin } from "../supabase/service";
export async function filterTripsByLocation(depatureLoctionId, destLocationId) {
    try {
        // Start building the query
        let query = supabaseAdmin
            .from("trips")
            .select("*");

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


export async function TrendingDestinations() {
    const {data, error} = await supabaseAdmin
        .from("cities")
        .select("*")
        .limit(5)

    if(error){
        console.log(error)
        return null
    }

    return data
}


export async function popularTrips() {
  // Fetch top 100 trips by score
  const { data, error } = await supabaseAdmin
    .from("trips")
    .select(`
      *,
      dest:dest_city (name),
      depature:depature_city (name)
    `)
    .order("score", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Error fetching top trips:", error);
    return {};
  }

  if (!data || data.length === 0) {
    return { top: [], categories: [] };
  }

  // Get top 20 trips
  const top20 = data.slice(0, 20);
  
  // Get remaining 80 trips for categorization
  const remaining80 = data.slice(20);
  
  // Group remaining trips by destination city
  const cityGroups = {};
  
  remaining80.forEach(trip => {
    const cityName = trip.dest?.name || `Unknown City`;
    
    if (!cityGroups[cityName]) {
      cityGroups[cityName] = [];
    }
    cityGroups[cityName].push(trip);
  });
  
  // Filter out categories with less than 5 elements and format the result
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
}
