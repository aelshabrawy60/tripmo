import { supabaseAdmin } from "@/utils/supabase/service";


export async function createTrip(trip) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .insert([trip])
    .select("*")
    .single();

  if (error) {
    throw new Error(`Error creating trip: ${error.message}`);
  }

  return data;
}

export async function deleteTrip(tripId) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .delete()
    .eq("id", tripId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Error deleting trip: ${error.message}`);
  }

  return data;
}

export async function updateTrip(tripId, updatedTrip) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .update(updatedTrip)
    .eq("id", tripId)
    .select(`
      *,
      ratings (*),
      depature_city:depature_city (*),
      dest_city:dest_city (*)
    `)
    .single();

  if (error) {
    throw new Error(`Error updating trip: ${error.message}`);
  }

  return data;
}

export async function getTrip(tripId) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .select(`
      *,
      ratings (*),
      depature_city:depature_city (*),
      dest_city:dest_city (*)
    `)
    .eq("id", tripId)
    .single();


  if (error) {
    throw new Error(`Error fetching trip: ${error.message}`);
  }

  // Calculate average rating
  const ratings = data.ratings || [];
  const total = ratings.reduce((sum, rating) => sum + (rating.value || 0), 0);
  const rate = ratings.length > 0 ? total / ratings.length : 0;

  return {
    ...data,
    rate
  };
}


export async function getAllTrips(groupId) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .select("*, categories (id, name), ratings (*)")
    .eq("group_id", groupId);

  if (error) {
    throw new Error(`Error fetching trips: ${error.message}`);
  }

  // Add averageRating to each trip
  const tripsWithRatings = data.map((trip) => {
    const ratings = trip.ratings || [];
    const total = ratings.reduce((sum, r) => sum + (r.value || 0), 0);
    const rate = ratings.length > 0 ? total / ratings.length : 0;

    return {
      ...trip,
      rate,
    };
  });

  return tripsWithRatings;
}