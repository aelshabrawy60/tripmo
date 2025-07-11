import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { initPayout } from "@/utils/payments/payments"

export async function GET() {
  try {
    const { data: events, error } = await supabaseAdmin
      .from("outbox")
      .select("*")
      .eq("processed", false)
      .eq("event_type", "payout_request")
      .limit(10); // limit per request

    if (error) {
      console.error("Outbox fetch error:", error.message);
      return NextResponse.json({ error: "Failed to load outbox events" }, { status: 500 });
    }

    if (!events || events.length === 0) {
      return NextResponse.json({ message: "No events to process." });
    }

    const results = [];

    for (const event of events) {
      const { id: outbox_id, payload } = event;

      try {
        // 🧠 Always use the outbox_id as idempotency key
        const payoutResponse = await initPayout({
          ...payload,
          merchantTransferId: outbox_id, // enforce idempotency
        });

        
        const gatewayTransferId = payoutResponse.data[0]?.transferId || null;

        // ✅ Update withdraw status to completed
        const { error: updateError } = await supabaseAdmin
          .from("withdraws")
          .update({
            status: "completed",
            transfer_id: gatewayTransferId,
          })
          .eq("outbox_id", outbox_id);

        if (updateError) {
          console.error("Failed to update withdraws record:", updateError.message);
          continue; // Skip marking outbox processed — it will retry
        }

        // ✅ Mark event as processed
        await supabaseAdmin
          .from("outbox")
          .update({ processed: true })
          .eq("id", outbox_id);

        results.push({ outbox_id, status: "success", transfer_id: gatewayTransferId });

      } catch (err) {
        console.error(`Payout failed for outbox ${outbox_id}:`, err.message);

        // Optionally mark withdraw as failed (or leave pending)
        await supabaseAdmin
          .from("withdraws")
          .update({ status: "failed" })
          .eq("id", payload.withdrawal_id);

        results.push({ outbox_id, status: "failed", error: err.message });
      }
    }

    return NextResponse.json({ message: "Processing complete", results });

  } catch (err) {
    console.error("Fatal error:", err.message);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
