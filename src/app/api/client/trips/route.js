// app/api/trips/route.js
import { NextResponse } from "next/server";
import { getAllTrips, getTrip } from "../../dashboard/trips/helpers"; // Adjust the import path as necessary

// GET handler - Fetch a specific trip by ID or all trips by group ID
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const tripId = url.searchParams.get("id");
    const groupId = url.searchParams.get("groupId");

    // If tripId is provided, get the specific trip
    if (tripId) {
      const trip = await getTrip(tripId);
      return NextResponse.json(trip);
    }
    
    // If groupId is provided, get all trips for that group
    if (groupId) {
      const trips = await getAllTrips(groupId);
      return NextResponse.json(trips);
    }

    // If neither is provided, return an error
    return NextResponse.json(
      { error: "Either trip ID or group ID is required" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}