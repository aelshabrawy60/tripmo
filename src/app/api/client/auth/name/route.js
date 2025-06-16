import { NextResponse } from "next/server";
import { changeClientName } from "@/utils/client_auth/client_auth";

// Accepts JSON body: { name: string, token: string }
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, token } = body;

        if (!name || !token) {
            return NextResponse.json({ error: "Missing name or token" }, { status: 400 });
        }

        const updatedClient = await changeClientName(name, token);

        return NextResponse.json({
            message: "Name updated successfully",
            client: updatedClient,
        });
    } catch (err) {
        return NextResponse.json(
            { error: err.message || "Server error" },
            { status: 500 }
        );
    }
}
