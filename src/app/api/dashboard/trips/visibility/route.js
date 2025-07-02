import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { withAuth } from "@/lib/auth"; // Make sure this path is correct

// POST /api/trips/:id/visibility
export const POST = withAuth(async (request, { params }) => {
  const { groupId } = request.auth; // Access the authenticated group or user if needed

  const body = await request.json();
  const { isPublic, tripId } = body;

  const id = tripId;

  if (!id) {
    return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
  }

  if (typeof isPublic !== "boolean") {
    return NextResponse.json({ error: "isPublic must be a boolean" }, { status: 400 });
  }

  const { data, error } = await setVisibility(id, isPublic, groupId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Visibility updated", trip: data }, { status: 200 });
});

async function setVisibility(tripId, isPublic, groupId) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .update({ status: isPublic ? "active" : "private" })
    .eq("id", tripId)
    .eq("group_id", groupId) // Ensure the trip belongs to the authenticated group
    .select("status")
    .single();

  return { data, error };
}
