import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { confirmDeposit } from "@/utils/payments/helpers";

async function fetchPayments(groupId) {
    const { data, error } = await supabaseAdmin
        .from("deposits")
        .select("* , trips(id, name), bookings (id, client_name, client_phone)")
        .eq("group_id", groupId)
        .in("status", ["confirmed", "client_confirmed"])
        .gt("amount", 0)
        .order("created_at", { ascending: false }); // sort by latest first

    if (error) {
        console.log("error", error);
        return null;
    }

    console.log("payments", data)
    return data;
}


export async function POST(request) {
    const { bookId } = await request.json();

    try {
        const result = await confirmDeposit(bookId);

        if (!result) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }
        
        return NextResponse.json({ success: true, data: result});

    } catch (error) {
        console.error("Error in confirming:", error);
        return NextResponse.json({ success: false, message: "Unexpected error confirming." }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    try {
        const result = await fetchPayments(groupId);

        return NextResponse.json(result
            ? { success: true, data: result }
            : { success: false, message: result }, 
            { status: result ? 200 : 400 }
        );
    } catch (error) {
        console.error("Error in fetching payments:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while fetching payments." }, { status: 500 });
    }
}
