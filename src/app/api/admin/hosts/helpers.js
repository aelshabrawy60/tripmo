import { supabaseAdmin } from "@/utils/supabase/service";

export async function fetchHosts({ page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'desc' }) {
    try {
        // Fetch hosts from database (replace with actual DB call)
        const { data, error } = await supabaseAdmin
        .from('Group')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * limit, page * limit - 1);
    
        if (error) {
        throw new Error(`Supabase error: ${error.message}`);
        }
    
        return {
        success: true,
        data,
        page,
        limit,
        total: data.length, // Replace with actual total count if available
        };
    } catch (error) {
        return {
        success: false,
        message: error.message,
        };
    }
}