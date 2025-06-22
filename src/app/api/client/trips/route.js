// app/api/trips/route.js
import { NextResponse } from "next/server";
import { getAllTrips, getTrip } from "../../dashboard/trips/helpers"; // Adjust the import path as necessary
import { filterTripsByLocation } from "@/utils/trips_engine/trips_engine";
import { supabaseAdmin } from "@/utils/supabase/service";

// GET handler - Fetch a specific trip by ID, all trips by group ID, or filter by location
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const tripId = url.searchParams.get("id");
    const tripSlug = url.searchParams.get("slug")
    const groupId = url.searchParams.get("groupId");
    const departureCity = url.searchParams.get("depature_city");
    const destCity = url.searchParams.get("dest_city");
    const query = url.searchParams.get("q");

    console.log("depature_city", departureCity)
    console.log("destCity", destCity)

    if(tripSlug){
      const trip = await getTrip(tripSlug, true, true);
      return NextResponse.json(trip);
    }
    // If tripId is provided, get the specific trip
    if (tripId) {
      const trip = await getTrip(tripId);
      return NextResponse.json(trip);
    }
    
    // If groupId is provided, get all trips for that group
    if (groupId) {
      const trips = await getAllTrips(groupId, true);
      return NextResponse.json(trips);
    }

    // If departure_city or dest_city is provided, filter trips by location
    if (departureCity || destCity || query) {

      const data = await filterTripsByLocation(departureCity, destCity)
      return NextResponse.json(data);
    }

    // If none of the required parameters are provided, return an error
    return NextResponse.json(
      { error: "Either trip ID, group ID, or location parameters (depature_city/dest_city) are required" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}