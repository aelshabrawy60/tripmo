import { NextResponse } from "next/server";
import { calculateAffiliateTotalBalance, calculateAffiliateAvalBalance } from "./helper";
import { requireAffiliate } from "@/utils/middleware/requireAffiliate";

export async function GET() {

    // Authenticate AFFILIATE
    const authResult = await requireAffiliate();
    if (!authResult.success) return authResult.response;
    const affiliate = authResult.affiliate;

    try {
                
        // Validate groupId parameter
        if (!affiliate) {
            return NextResponse.json(
                { error: "affiliate ref code is required" },
                { status: 400 }
            );
        }
        
        // Calculate both balances concurrently
        const [total_balance, aval_balance] = await Promise.all([
            calculateAffiliateTotalBalance(affiliate.ref_code),
            calculateAffiliateAvalBalance(affiliate.ref_code)
        ]);
        
        // Return the response
        return NextResponse.json({
            total_balance,
            aval_balance
        });
        
    } catch (error) {
        console.error("Error calculating balances:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}