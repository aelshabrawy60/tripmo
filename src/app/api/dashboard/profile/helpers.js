import { supabaseAdmin } from "@/utils/supabase/service";

export async function updateProfile(profileId, updatedProfile){
    const {data, error} = await supabaseAdmin
        .from('Group')
        .update(updatedProfile)
        .eq('id', profileId)
        .select('*')
        .single();
    if (error) {
        throw new Error(`Error updating profile: ${error.message}`);
    }
    return data;
}