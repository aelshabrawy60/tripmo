import { requireAffiliate } from "@/utils/middleware/requireAffiliate";
import { NextResponse } from "next/server";
import { getAffiliateBookings } from "./helpers";


export async function GET() {
    // Authenticate admin
    const authResult = await requireAffiliate();
    if (!authResult.success) return authResult.response;
    const affiliate = authResult.affiliate;

    try{
        const bookings = await getAffiliateBookings(affiliate.ref_code)
        return NextResponse.json({ bookings: bookings }, { status: 200 });
    }catch(err){
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}