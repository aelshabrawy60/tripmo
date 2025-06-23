import { NextResponse } from "next/server";
import { withdraw } from "@/utils/withdraw/withdraw";
import { supabaseAdmin } from "@/utils/supabase/service";
import { withAuth } from "@/lib/auth";

export const POST = withAuth(async (request) => {
    const {groupId} = request.auth

    try {
        const body = await request.json();
        const { withdraw_method_id } = body;

        const withd = await withdraw(groupId, withdraw_method_id);

        if (withd) {
            return NextResponse.json(
                { message: "success" },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
})

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get("group_id");

        if (!groupId) {
            return NextResponse.json(
                { error: "Missing group_id parameter" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("withdraws")
            .select("*, withdraw_methodes(*)")
            .eq("group_id", groupId);

        if (error) {
            throw error;
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
