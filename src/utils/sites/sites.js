import { supabaseAdmin } from "../supabase/service";
import { getAllTrips } from "@/app/api/dashboard/trips/helpers";



export async function fetchSiteData(domain) {
    const {data, error} = await supabaseAdmin.from('websites').select('data, template, group_id').eq('domain', domain).single()

    
    if(error){
        console.log(error)
        return null
    }

    
    data.tripsData = await getAllTrips(data.group_id)

    return data
}