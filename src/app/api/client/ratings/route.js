import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

async function addRate(tripId, sender_name, value, comment) {
    const {data, error} = await supabaseAdmin.from('ratings').insert([{"trip_id": tripId, sender_name, value, comment}])

    if(error){
        console.log(error)
        return null
    }
    
    return data
}

export async function POST(request) {
    const { tripId, sender_name, value, comment } = await request.json();

    try {
        

        const rate = await addRate(tripId, sender_name, value, comment)
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error in adding rate:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while adding rate." }, { status: 500 });
    }
}
