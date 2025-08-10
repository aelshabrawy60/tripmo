// utils/middleware/requireAdmin.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../affiliate_auth/affiliate_auth";

export async function requireAffiliate() {
  const cookieStore = cookies();
  const token = cookieStore.get("affiliate_token")?.value;

  if (!token) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Authentication required",
          message: "affiliate token not found"
        },
        { status: 401 }
      )
    };
  }

  const affiliate = await verifyToken(token);

  if (!affiliate) {
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

  return { success: true, affiliate };
}
