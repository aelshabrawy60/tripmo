import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { translateTrip } from "@/utils/translation/translateTrip";

export async function GET(request) {
    try {
        const {data, error} = await supabaseAdmin.from("trips").select("*").eq("id", 55).single()

        const translation = await translateTrip(data)
        
        console.log("translation", translation)
        return NextResponse.json(translation);

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}