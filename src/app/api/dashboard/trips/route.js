// app/api/trips/route.js
import { NextResponse } from "next/server";
import { createTrip, deleteTrip, getAllTrips, getTrip, updateTrip } from "./helpers"; // Adjust the import path as necessary
import { withAuth } from "@/lib/auth";

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

// POST handler - Create a new trip
export const POST = withAuth(async (request)=> {
  const { groupId } = request.auth;

  try {
    const body = await request.json();
    body.group_id = groupId
    const trip = await createTrip(body);
    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
})

// PUT handler - Update an existing trip
export const PUT = withAuth(async (request)=> {
  const { groupId } = request.auth;

  try {
    const body = await request.json();
    const { id, ...updatedTrip } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    const trip = await updateTrip(id, updatedTrip, groupId);
    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
})


// DELETE handler - Delete a trip

/*
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const tripId = url.searchParams.get("id");
    
    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    const trip = await deleteTrip(tripId);
    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
*/