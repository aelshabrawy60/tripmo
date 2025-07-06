import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { fetchHosts } from './helpers';

export async function GET(request) {
    // Authenticate admin
    const authResult = await requireAdmin();
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;
    
    // fetch all hosts
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const sortBy = searchParams.get("sortBy") || "created_at";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        // Fetch hosts from database (replace with actual DB call)
        const hostsData = await fetchHosts({ page, limit, sortBy, sortOrder });

        if (!hostsData.success) {
            return NextResponse.json({
                success: false,
                message: hostsData.message,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: hostsData.data,
            page: hostsData.page,
            limit: hostsData.limit,
            total: hostsData.total,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}
