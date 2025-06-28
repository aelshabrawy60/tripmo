import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/admin_auth/admin_auth";

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 401 }
      );
    }

    const admin = await verifyToken(token);

    return NextResponse.json({ admin }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
