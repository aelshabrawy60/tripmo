import { NextResponse } from "next/server";
import { confirmWithdraw } from "@/utils/withdraw/withdraw";

export async function POST(request) {
  try {
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
