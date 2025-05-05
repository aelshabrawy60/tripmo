import { supabaseAdmin } from "../supabase/service";


export async function fetchPaymentsOptions(groupId) {
    const {data, error} = await supabaseAdmin.from("payment_gates").select("*").eq("id", groupId, "status", "active").single()

    if(error){
        console.log(error)
        return null
    }
    return data
}