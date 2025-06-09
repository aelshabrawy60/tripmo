import { supabaseAdmin } from "@/utils/supabase/service";


export async function getAllCities(){
    const {data, error} = await supabaseAdmin.from("cities").select("*");

    if (error) {
        throw new Error(`Error fetching cities: ${error.message}`);
    }
    return data;
}