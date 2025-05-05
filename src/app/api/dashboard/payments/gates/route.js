import { supabaseAdmin } from "@/utils/supabase/service";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

async function addPaymentGate(name, groupId, type, key_1, key_2, key_3, status, mode, deposit_message){
    const {data, error} = await supabaseAdmin.from("payment_gates").insert([{name, group_id: groupId, type, key_1, key_2, key_3, status, mode, deposit_message}])

    if(error){
        console.log("error", error)
        return null
    }

    return data
}

async function fetchAllPaymentGates(groupId) {
    const {data, error} = await supabaseAdmin.from("payment_gates").select("*").eq("group_id", groupId)

    if(error){
        return null
    }

    return data
}


export async function POST(request) {
    const { name, groupId, type, key_1, key_2, key_3, status, mode, deposit_message  } = await request.json();

    try {
        const result = await addPaymentGate(name, groupId, type, key_1, key_2, key_3, status, mode, deposit_message);

        

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Error in booking:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while booking." }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    const supabase = await createClient()

    const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
    
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    try {
        const result = await fetchAllPaymentGates(groupId);

        console.log("gates", result)
        return NextResponse.json(result
            ? { data: result }
            : { success: false}, 
            { status: result ? 200 : 400 }
        );
    } catch (error) {
        console.error("Error in fetch gates:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while fetch gates." }, { status: 500 });
    }
}

