import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { fetchTrips } from './helpers';

export async function GET(request) {
  try {
    // Authenticate admin
    const authResult = await requireAdmin();
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;

    // Extract query parameters
    const { searchParams } = new URL(request.url);

    
    const filters = {
      group_id: searchParams.get("group_id"),
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "50"), 100),
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc"
    };

    // Fetch data
    const result = await fetchTrips(filters);

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error("Error in trips API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch trips",
        message: error.message
      },
      { status: 500 }
    );
  }
}
