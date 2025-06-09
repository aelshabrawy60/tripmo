import { NextResponse } from "next/server";
import { getHostData } from "./helpers";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            { error: "Host ID is required" },
            { status: 400 }
        );
    }

    try {
        const hostData = await getHostData(id);
        return NextResponse.json(hostData);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}