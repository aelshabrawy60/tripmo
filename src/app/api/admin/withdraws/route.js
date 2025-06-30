// app/api/withdraws/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { fetchWithdraws, getWithdrawStats } from "./helpers";

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
      methodId: searchParams.get("methodId"),
      groupId: searchParams.get("groupId"),
      minAmount: searchParams.get("minAmount"),
      maxAmount: searchParams.get("maxAmount"),
      userId: searchParams.get("userId"),
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "50"), 100),
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc"
    };

    // Fetch data
    const result = await fetchWithdraws(filters);
    const includeStats = searchParams.get("includeStats") === "true";
    const stats = includeStats ? await getWithdrawStats(filters) : null;

    return NextResponse.json({
      success: true,
      ...result,
      stats,
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
