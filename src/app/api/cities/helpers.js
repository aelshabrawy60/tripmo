import { supabaseAdmin } from "@/utils/supabase/service";

export async function getAllCities(locale = "ar") {
    const { data, error } = await supabaseAdmin
    .from("cities")
    .select("*")
    .order("score", { ascending: false }); // sort by highest score first

    if (error) {
        throw new Error(`Error fetching cities: ${error.message}`);
    }

    // Modify the return data if locale is 'en'
    if (locale === "en") {
        return data.map(city => ({
            ...city,
            name: city.name_en,
            country: city.country_en
        }));
    }

    return data;
}
