import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { AffiliateWithdraw } from "@/utils/affiliate_withdraw/affiliate_withdraw";
import { requireAffiliate } from "@/utils/middleware/requireAffiliate";



export async function POST(request) {

    try {
        const body = await request.json();
        const { withdraw_method_id } = body;

        const authResult = await requireAffiliate();
        if (!authResult.success) return authResult.response;
        const affiliate = authResult.affiliate;

        const withd = await AffiliateWithdraw(affiliate.id, withdraw_method_id, affiliate.ref_code);

        console.log("withdraw_method_id", withd)

        if (withd) {
            return NextResponse.json(
                { message: "success" },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {

        const authResult = await requireAffiliate();
        if (!authResult.success) return authResult.response;
        const affiliate = authResult.affiliate;

        const { data, error } = await supabaseAdmin
            .from("withdraws")
            .select("*, withdraw_methodes(*)")
            .eq("affiliate_id", affiliate.id);

        if (error) {
            throw error;
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
