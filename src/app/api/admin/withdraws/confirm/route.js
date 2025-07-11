import { NextResponse } from "next/server";
import { confirmWithdraw } from "@/utils/withdraw/withdraw";
import { requireAdmin } from "@/utils/middleware/requireAdmin";

export async function POST(request) {
  try {

    // Authenticate admin
    const authResult = await requireAdmin("withdraws");
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;

    
    const body = await request.json();
    const withdrawId = body.withdrawId;

    if (!withdrawId) {
      return NextResponse.json({ error: "Missing withdrawId" }, { status: 400 });
    }

    const result = await confirmWithdraw(withdrawId);

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error("Error confirming withdrawal:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
