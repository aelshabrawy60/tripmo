import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

// Helper function to update the onboarding step
async function finishOnboarding(groupId) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ onboarding_step: null })
    .eq("group_id", groupId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// GET handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");

  if (!groupId) {
    return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
  }

  try {
    const result = await finishOnboarding(groupId);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
