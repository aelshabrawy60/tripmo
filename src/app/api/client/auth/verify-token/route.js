import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/client_auth/client_auth";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer "

    const user = await verifyToken(token);

    const client = {
        clientName: user.name,
        clientPhone: user.phone,
        clientId: user.id,
    }

    return NextResponse.json({ client, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false,  error: error.message }, { status: 401 });
  }
}
