
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";


async function addCategorie(name, groupId) {
    const {data, error} = await supabaseAdmin.from("categories").insert([{"name": name, "group_id": groupId}])

    if(error){
        console.log(error)
        return null
    }
    return true
}

export async function POST(request) {
    const { name, groupId } = await request.json();

    try {
        const result = await addCategorie(name, groupId);

        if (!result) {
            return NextResponse.json({ success: false, message: result }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error("Error in adding Category:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while adding Category." }, { status: 500 });
    }
}