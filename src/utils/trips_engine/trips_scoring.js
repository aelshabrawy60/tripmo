import { supabaseAdmin } from "../supabase/service";

// ✅ Value-for-money score
export function priceValue(price, ratings) {
  if (!price || price === 0) return 0;
  const total = ratings.reduce((sum, rating) => sum + (rating.value || 0), 0);
  const rate = ratings.length > 0 ? total / ratings.length : 0;
  return rate / price;
}

// 🔄 Placeholder: You should actually implement recent-booking logic
export function freshnessScore(bookings) {
  // Count bookings from last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentBookings = bookings.filter(b => new Date(b.created_at) >= oneWeekAgo);
  return Math.min(1, recentBookings.length / 5); // normalize (e.g. max at 5 bookings)
}

// 📅 Availability score
export function avalScore(tripData) {
  if (tripData.availability_type === "daily") return 7;
  if (tripData.availability_type === "weekly") return 1;
  if (Array.isArray(tripData.weekly_days)) return tripData.weekly_days.length;
  return 0;
}

// 🔁 Log-scaled popularity
export function bookingFrequancyScore(bookings) {
  return Math.log(1 + bookings.length);
}

// ⭐ Simplified "bayesian" score (not true Bayesian)
export function bayesianRating(ratings) {
  const total = ratings.reduce((sum, rating) => sum + (rating.value || 0), 0);
  const rate = ratings.length > 0 ? total / ratings.length : 0;
  return rate * Math.log(1 + ratings.length);
}

// 🧮 Total trip score calculator
export function calcTripScore(tripData) {
  const rating = bayesianRating(tripData.ratings);
  const availability = avalScore(tripData);
  const frequency = bookingFrequancyScore(tripData.bookings);
  const freshness = freshnessScore(tripData.bookings);
  const price = priceValue(tripData.pricing?.PersonPrice || 0, tripData.ratings);

  const score = (
    0.4 * rating +
    0.2 * frequency +
    0.2 * freshness +
    0.1 * availability +
    0.1 * price
  );

  return Math.round(score * 100) / 100; // optional: round to 2 decimal places
}

export async function updateTripScore(tripId, rate = null) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .select(`
      id,
      availability_type,
      weekly_days,
      pricing,
      rates_sum,
      rates_count,
      ratings (value),
      bookings (created_at)
    `)
    .eq("id", tripId)
    .single();

  if (error || !data) {
    console.error("Failed to fetch trip:", error || "Trip not found");
    return;
  }

  const newScore = calcTripScore(data);

  // Prepare update object
  const updateData = { score: newScore };

  // If rate is provided, update rates_sum and rates_count
  if (rate !== null) {
    const currentRatesSum = data.rates_sum || 0;
    const currentRatesCount = data.rates_count || 0;
    
    updateData.rates_sum = currentRatesSum + rate;
    updateData.rates_count = currentRatesCount + 1;
  }

  const { error: updateError } = await supabaseAdmin
    .from("trips")
    .update(updateData)
    .eq("id", tripId);

  if (updateError) {
    console.error("Failed to update trip score:", updateError);
  }
}