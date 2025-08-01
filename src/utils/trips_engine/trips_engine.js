import { supabaseAdmin } from "../supabase/service";
import { unstable_cache } from 'next/cache'


export async function filterTripsByLocation(depatureLoctionId, destLocationId) {
    try {
        // Start building the query
        let query = supabaseAdmin
            .from("trips")
            .select(
              `* , 
              dest:dest_city (name),
              depature:depature_city (name)`
            )
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


export async function TrendingDestinations(locale = "ar") {
    const { data, error } = await supabaseAdmin
        .from("cities")
        .select("*")
        .order("score", { ascending: false })
        .limit(5);

    if (error) {
        console.log(error);
        return null;
    }

    if (locale === "en") {
        return data.map(city => ({
            ...city,
            name: city.name_en,
            country: city.country_en
        }));
    }

    return data;
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
    .eq("status", "active")
    .limit(100);

  if (error) {
    console.error("Error fetching top trips:", error);
    return {};
  }

  if (!data || data.length === 0) {
    return { top: [], categories: [] };
  }

  // Get top 20 trips
  const top20 = data.slice(0, 25);
  
  // Get remaining 80 trips for categorization
  const remaining80 = data.slice(25);
  
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

export async function getSimilarTrips(tripId) {
  const { data, error } = await supabaseAdmin.rpc('get_similar_trips_optimized', {
    input_trip_id: tripId
  });

  if (error) {
    console.log("Error fetching similar trips:", error);
    console.error("Error fetching similar trips:", error);
    return []
  }
  return data || [];
}
