import { supabaseAdmin } from "@/utils/supabase/service";

export async function calculateTotalBalance(groupId) {
    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("net_amount")
        .eq("group_id", groupId)
        .in("host_status", ["pending", "aval"])
        .eq("status", "confirmed");
    
    if (error) {
        console.error("Error fetching deposits:", error);
        return 0;
    }
    
    // Sum all net_amount values
    const total = data.reduce((sum, deposit) => sum + (deposit.net_amount || 0), 0);
    return total;
}

export async function calculateAvalBalance(groupId) {
    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("net_amount")
        .eq("group_id", groupId)
        .eq("host_status", "aval")
        .eq("status", "confirmed");
    
    if (error) {
        console.error("Error fetching aval deposits:", error);
        return 0;
    }
    
    // Sum all net_amount values for aval status
    const total = data.reduce((sum, deposit) => sum + (deposit.net_amount || 0), 0);
    return total;
}

export async function resetBalance(groupId) {
    const {data, error} = await supabaseAdmin
        .from("deposits")
        .update({host_status: "processing"})
        .eq("group_id", groupId)
        .eq("host_status", "aval")
        .eq("status", "confirmed")
        .select("*");

    if(error){
        console.log(error)
    }

    return data
}