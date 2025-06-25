import { supabaseAdmin } from "@/utils/supabase/service";

function fallbackArabicSlug(text) {
  if (!text) return '';
  
  return text.toString()
    .trim()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '') // Remove Arabic diacritics
    .replace(/\s+/g, '-')                         // Replace spaces with hyphens
    .replace(/[^\w\u0600-\u06FF-]/g, '-')        // Replace special chars, keep Arabic
    .replace(/-+/g, '-')                          // Remove duplicate hyphens
    .replace(/^-+|-+$/g, '');                    // Trim hyphens from start/end
}

async function generateSlug(title) {
  console.log("Input title:", title);
  
  if (!title) {
    console.log("No title provided");
    return '';
  }
  
  
  let slug;
  slug = fallbackArabicSlug(title);
  
  return slug;
}

export async function createTrip(trip) {
  console.log("Creating trip with data:", trip);
  
  // Step 1: Insert the trip (without slug)
  const { data: createdTrip, error: insertError } = await supabaseAdmin
    .from("trips")
    .insert([{ ...trip }])
    .select("*")
    .single();

  if (insertError) {
    throw new Error(`Error creating trip: ${insertError.message}`);
  }

  console.log("Created trip:", createdTrip);

  // Step 2: Create slug using title + ID
  const titleSlug = await generateSlug(createdTrip.name);
  const slug = `${titleSlug}-${createdTrip.id}`;

  console.log("Final slug:", slug);

  // Step 3: Update the trip with the generated slug
  const { error: updateError } = await supabaseAdmin
    .from("trips")
    .update({ slug })
    .eq("id", createdTrip.id);

  if (updateError) {
    throw new Error(`Error updating slug: ${updateError.message}`);
  }

  // Return the updated trip with slug
  return createdTrip;
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

export async function getTrip(tripId, bySlogan = false, active = false) {
  let query = supabaseAdmin
    .from("trips")
    .select(`
      *,
      ratings (*),
      depature_city:depature_city (*),
      dest_city:dest_city (*)
    `)
    .eq(`${bySlogan ? 'slug' : 'id'}`, tripId);

  if (active) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query.single();

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


export async function getAllTrips(groupId, active = false) {
  let query = supabaseAdmin
    .from("trips")
    .select("*, categories (id, name), ratings (*)")
    .eq("group_id", groupId);

  if (active) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query;

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


export async function getAllTripsSlugs() {
  const {data, error} = await supabaseAdmin.from("trips")
    .select("slug")

  if(error){
    throw new error(error)
  }

  return data
}