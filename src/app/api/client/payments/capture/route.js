// app/api/orders/[orderID]/capture/route.js
import { NextResponse } from "next/server";
import {initPaypalCapture} from "@/utils/payments/payments";

export async function POST(request) {
  try {
    const { orderID } = await request.json();
    const { jsonResponse, httpStatusCode } = await initPaypalCapture(orderID);



    console.log("Capture result:", jsonResponse);
    return NextResponse.json(jsonResponse, { status: httpStatusCode });
  } catch (error) {
    console.error("Failed to capture order:", error);
    return NextResponse.json(
      { error: "Failed to capture order." },
      { status: 500 }
    );
  }
}
