import { supabaseAdmin } from "../supabase/service";
export async function filterTripsByLocation(depatureLoctionId, destLocationId) {
    try {
        // Start building the query
        let query = supabaseAdmin
            .from("trips")
            .select("*");

        // Apply filters only if the parameter is not null/undefined
        if (depatureLoctionId != null) {
            query = query.eq("depature_city", depatureLoctionId);
        }

        if (destLocationId != null) {
            query = query.eq("dest_city", destLocationId);
        }

        // Execute the query
        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error("Error filtering trips by location:", error);
        throw error;
    }
}