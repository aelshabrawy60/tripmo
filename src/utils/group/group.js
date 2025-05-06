import { supabaseAdmin } from "../supabase/service";


export async function fetchPaymentsOptions(groupId) {
    const {data, error} = await supabaseAdmin.from("payment_gates").select("*").eq("group_id", groupId).eq("status", "active").single()

    if(error){
        console.log(error)
        return null
    }
    return data
}