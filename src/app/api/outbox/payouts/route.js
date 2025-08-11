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
        let payoutResponse;
        let gatewayTransferId = null;
        let isDuplicate = false;

        try {
          // Always use the outbox_id as idempotency key
          payoutResponse = await initPayout({
            ...payload,
            merchantTransferId: outbox_id, // enforce idempotency
          });
          
          gatewayTransferId = payoutResponse.data[0]?.transferId || null;
        } catch (err) {
          console.log("errrr", err.message)
          if (err.message === "Transfer failed: Merchant transfer id is duplicated") {
            // This is expected for idempotency - the payout already exists
            isDuplicate = true;
            console.log(`Duplicate payout detected for outbox ${outbox_id} - already processed`);
            
            // Try to retrieve the existing transfer ID if available
            // This depends on your payment gateway's API - you might need to query by merchantTransferId
            // For now, we'll proceed without the gateway transfer ID
          } else {
            // Re-throw other errors
            throw err;
          }
        }

        // Update withdraw status to completed (regardless of duplicate)
        const updateData = {
          status: "INITIATED",
          ...(gatewayTransferId && { transfer_id: gatewayTransferId })
        };

        const { error: updateError } = await supabaseAdmin
          .from("withdraws")
          .update(updateData)
          .eq("outbox_id", outbox_id);

        if (updateError) {
          console.error("Failed to update withdraws record:", updateError.message);
          // Don't mark as processed - let it retry
          results.push({ 
            outbox_id, 
            status: "failed", 
            error: "Failed to update withdraw record" 
          });
          continue;
        }

        // Mark event as processed
        const { error: outboxUpdateError } = await supabaseAdmin
          .from("outbox")
          .update({ processed: true })
          .eq("id", outbox_id);

        if (outboxUpdateError) {
          console.error("Failed to mark outbox as processed:", outboxUpdateError.message);
          // This is concerning but the payout was successful
          results.push({ 
            outbox_id, 
            status: "warning", 
            error: "Payout succeeded but failed to mark as processed",
            transfer_id: gatewayTransferId 
          });
          continue;
        }

        results.push({ 
          outbox_id, 
          status: "success", 
          transfer_id: gatewayTransferId,
          ...(isDuplicate && { note: "Duplicate request - idempotency applied" })
        });

      } catch (err) {
        console.error(`Payout failed for outbox ${outbox_id}:`, err.message);
        
        // Mark withdraw as failed
        const { error: failUpdateError } = await supabaseAdmin
          .from("withdraws")
          .update({ transfer_id: "manual" })
          .eq("outbox_id", outbox_id); // Use outbox_id instead of payload.withdrawal_id for consistency


        
        if (failUpdateError) {
          console.error("Failed to mark withdraw as failed:", failUpdateError.message);
        }else{
          // Mark event as processed
          const { error: outboxUpdateError } = await supabaseAdmin
            .from("outbox")
            .update({ processed: true })
            .eq("id", outbox_id);
        }

        results.push({ outbox_id, status: "failed", error: err.message });
      }
    }

    return NextResponse.json({ message: "Processing complete", results });

  } catch (err) {
    console.error("Fatal error:", err.message);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}