// app/api/withdraws/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { fetchRefunds} from './helpers'

export async function GET(request) {
  try {
    // Authenticate admin
    const authResult = await requireAdmin("refunds");
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      timeFilter: searchParams.get("timeFilter"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      status: searchParams.get("status"),
      bookId: searchParams.get("bookId"),
      transactionId: searchParams.get("transactionId"),
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "50"), 100),
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc"
    };

    // Fetch data
    const result = await fetchRefunds(filters);

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error("Error in withdraws API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch withdraws",
        message: error.message
      },
      { status: 500 }
    );
  }
}
