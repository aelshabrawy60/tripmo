import { NextResponse } from "next/server";
import { fetchTripsAffiliate } from './helpers';
import { requireAffiliate } from "@/utils/middleware/requireAffiliate";

export async function GET(request) {
  try {
    // Authenticate admin
    const authResult = await requireAffiliate();
    if (!authResult.success) return authResult.response;
    const affiliate = authResult.affiliate;

    // Extract query parameters
    const { searchParams } = new URL(request.url);

    
    const filters = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "50"), 100),
    };

    // Fetch data
    const result = await fetchTripsAffiliate(filters);

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
