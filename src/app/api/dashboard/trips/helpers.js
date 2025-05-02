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
    .select("*")
    .single();

  if (error) {
    throw new Error(`Error updating trip: ${error.message}`);
  }

  return data;
}

export async function getTrip(tripId) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (error) {
    throw new Error(`Error fetching trip: ${error.message}`);
  }

  return data;
}

export async function getAllTrips(groupId) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .select("*")
    .eq("group_id", groupId);

  if (error) {
    throw new Error(`Error fetching trips: ${error.message}`);
  }

  return data;
}