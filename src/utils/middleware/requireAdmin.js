// utils/middleware/requireAdmin.js
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/admin_auth/admin_auth";
import { NextResponse } from "next/server";
import { roles } from "./AdminRoles";

export async function requireAdmin(pathname) {
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

  const adminRole = admin.role;

  // Find the role definition
  const roleDefinition = roles.find(role => role.name === adminRole);

  if (roleDefinition) {
    // Check if any disallowed path is part of the current pathname
    const isPathDisallowed = roleDefinition.disallowedPaths.some(disallowed =>
      pathname.includes(disallowed)
    );

    if (isPathDisallowed) {
      return {
        success: false,
        response: NextResponse.json(
          {
            success: false,
            error: "Forbidden",
            message: `Access to '${pathname}' is not allowed for role '${adminRole}'`
          },
          { status: 403 }
        )
      };
    }
  }

  return { success: true, admin };
}
