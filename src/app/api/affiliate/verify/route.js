import { verifyToken } from "@/utils/affiliate_auth/affiliate_auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("affiliate_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 401 }
      );
    }

    const affiliate = await verifyToken(token);

    return NextResponse.json({ affiliate }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
