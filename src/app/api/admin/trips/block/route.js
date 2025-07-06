import { NextResponse } from 'next/server';
import { requireAdmin } from '@/utils/middleware/requireAdmin';
import { supabaseAdmin } from '@/utils/supabase/service';

async function blockTrip(id, action) {
  const status = action === 'block' ? 'blocked' : 'active';
  const { data, error } = await supabaseAdmin.from("trips").update({ status }).eq("id", id);

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  return data;
}

export async function POST(request) {
  try {
    const authResult = await requireAdmin();
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;

    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");
    const action = searchParams.get("action");

    if (!tripId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing tripId or action parameter" },
        { status: 400 }
      );
    }

    await blockTrip(tripId, action);

    return NextResponse.json({
      success: true,
      message: `Trip ${tripId} successfully ${action === 'block' ? 'blocked' : 'unblocked'}`,
    });

  } catch (error) {
    console.error("Error in blockTrip API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to change trip status",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
