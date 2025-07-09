import { supabaseAdmin } from "@/utils/supabase/service";

export async function calculateTotalBalance(groupId) {
    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("net_amount")
        .eq("group_id", groupId)
        .eq("withdrawn", false)
        .eq("status", "confirmed");
    
    if (error) {
        console.error("Error fetching deposits:", error);
        return 0;
    }
    
    // Sum all net_amount values
    const total = data.reduce((sum, deposit) => sum + (deposit.net_amount || 0), 0);
    return total;
}

export async function calculateAvalBalance(groupId, currentDate = new Date().toISOString()) {

    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("net_amount")
        .eq("group_id", groupId)
        .lte("release_date", currentDate)
        .eq("withdrawn", false)
        .eq("status", "confirmed");
    
    if (error) {
        console.error("Error fetching aval deposits:", error);
        return 0;
    }
    
    // Sum all net_amount values for aval status
    const total = data.reduce((sum, deposit) => sum + (deposit.net_amount || 0), 0);
    return total;
}

export async function resetBalance(groupId, currentDate = new Date().toISOString()) {
    const {data, error} = await supabaseAdmin
        .from("deposits")
        .update({withdrawn: true})
        .eq("group_id", groupId)
        .eq("withdrawn", false)
        .lte("release_date", currentDate)
        .eq("status", "confirmed")
        .select("*");

    if(error){
        console.log(error)
    }

    return data
}


export async function calculateAllHostsBalance() {
    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("net_amount")
        .eq("withdrawn", false)
        .eq("status", "confirmed");
    
    if (error) {
        console.error("Error fetching deposits:", error);
        return 0;
    }
    
    // Sum all net_amount values
    const total = data.reduce((sum, deposit) => sum + (deposit.net_amount || 0), 0);
    return total;
}
