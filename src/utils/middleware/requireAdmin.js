// utils/middleware/requireAdmin.js
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/admin_auth/admin_auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          message: "Admin token not found"
        },
        { status: 401 }
      )
    };
  }

  const admin = await verifyToken(token);

  if (!admin) {
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

  return { success: true, admin };
}
