import { supabaseAdmin } from "@/utils/supabase/service";



export async function getAffiliateBookings(affiliateCode) {
    const {data, error} = await supabaseAdmin
        .from("deposits")
        .select("id, created_at, trips(name, images), bookings(total_price, status), affiliate_amount, amount, status")
        .eq("referral_code", affiliateCode)
        .in("status", ["confirmed", "client_confirmed", "refunded"])
        .gt("amount", 0)
        .order("created_at", { ascending: false }); // sort by latest first
    
    if(error){
        throw new Error(`Error fetching bookings: ${error.message}`);
    }

    return data
}