// utils/middleware/requireAdmin.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../client_auth/client_auth";

export async function requireClient() {
  const cookieStore = cookies();
  const token = cookieStore.get("client_token")?.value;

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          message: "client token not found"
        },
        { status: 401 }
      )
    };
  }

  const client = await verifyToken(token);

  if (!client) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Invalid or expired token"
        },
        { status: 401 }
      )
    };
  }

  return { success: true, client };
}
