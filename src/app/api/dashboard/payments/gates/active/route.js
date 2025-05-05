import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

export async function PUT(request) {
    const { gateId, activate } = await request.json();

    if (activate === true) {
        // Step 1: Get the group_id for the given gateId
        const { data: gateData, error: gateError } = await supabaseAdmin
            .from("payment_gates")
            .select("group_id")
            .eq("id", gateId)
            .single();

        if (gateError || !gateData) {
            return NextResponse.json({ error: "Failed to fetch group_id" }, { status: 500 });
        }

        const groupId = gateData.group_id;

        // Step 2: Set all gates in that group to 'off'
        await supabaseAdmin
            .from("payment_gates")
            .update({ status: "off" })
            .eq("group_id", groupId);

        // Step 3: Activate the selected gate
        await supabaseAdmin
            .from("payment_gates")
            .update({ status: "active" })
            .eq("id", gateId);
    } else {
        // Just set this gate to 'off'
        await supabaseAdmin
            .from("payment_gates")
            .update({ status: "off" })
            .eq("id", gateId);
    }

    return NextResponse.json({ success: true });
}
