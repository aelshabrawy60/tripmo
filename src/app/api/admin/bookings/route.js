import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { fetchBookings, getBookingStats } from "./helpers";

export async function GET(request) {
  try {
    // Authenticate admin
    const authResult = await requireAdmin();
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      timeFilter: searchParams.get("timeFilter"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      status: searchParams.get("status"),
      tripId: searchParams.get("tripId"),
      clientId: searchParams.get("clientId"),
      bookId: searchParams.get("bookId"),
      minAmount: searchParams.get("minAmount"),
      maxAmount: searchParams.get("maxAmount"),
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "50"), 100),
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc"
    };

    // Fetch data
    const result = await fetchBookings(filters);
    const includeStats = searchParams.get("includeStats") === "true";
    const stats = includeStats ? await getBookingStats(filters) : null;

    return NextResponse.json({
      success: true,
      ...result,
      stats,
    });

  } catch (error) {
    console.error("Error in bookings API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
        message: error.message
      },
      { status: 500 }
    );
  }
}
