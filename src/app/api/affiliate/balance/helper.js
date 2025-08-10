import { supabaseAdmin } from "@/utils/supabase/service";

export async function calculateAffiliateTotalBalance(refCode) {
    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("affiliate_amount")
        .eq("referral_code", refCode)
        .eq("affiliate_withdrawn", false)
        .eq("status", "confirmed");
    
    if (error) {
        console.error("Error fetching deposits:", error);
        return 0;
    }

    // Sum all affiliate_amount values
    const total = data.reduce((sum, deposit) => sum + (deposit.affiliate_amount || 0), 0);
    return total;
}

export async function calculateAffiliateAvalBalance(refCode, currentDate = new Date().toISOString()) {

    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("affiliate_amount")
        .eq("referral_code", refCode)
        .lte("release_date", currentDate)
        .eq("affiliate_withdrawn", false)
        .eq("status", "confirmed");
    
    if (error) {
        console.error("Error fetching aval deposits:", error);
        return 0;
    }

    // Sum all affiliate_amount values for aval status
    const total = data.reduce((sum, deposit) => sum + (deposit.affiliate_amount || 0), 0);
    return total;
}