import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

// POST /api/trips/:id/visibility
export async function POST(request, { params }) {


  const body = await request.json();
  const { isPublic, tripId } = body;

  const id = tripId;

  if (!id) {
    return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
  }

  if (typeof isPublic !== "boolean") {
    return NextResponse.json({ error: "isPublic must be a boolean" }, { status: 400 });
  }

  const { data, error } = await setVisibility(id, isPublic);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Visibility updated", trip: data }, { status: 200 });
}

async function setVisibility(tripId, isPublic) {
  const { data, error } = await supabaseAdmin
    .from("trips")
    .update({ status: isPublic ? "active" : "private" })
    .eq("id", tripId)
    .select("status")
    .single();

  return { data, error };
}
