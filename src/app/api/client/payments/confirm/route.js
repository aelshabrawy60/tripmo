import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";

export async function POST(request) {
    const { paymentId, payment_methode } = await request.json();

    try {
        // Step 1: Update the deposit record
        const { data: updatedDeposits, error: depositError } = await supabaseAdmin
            .from("deposits")
            .update({ status: "client_confirmed", type: payment_methode })
            .eq("payment_id", paymentId)
            .select(); // Get the updated row(s)

        if (depositError || !updatedDeposits || updatedDeposits.length === 0) {
            return NextResponse.json({ success: false, message: depositError?.message || "Deposit not found" }, { status: 400 });
        }

        const updatedDeposit = updatedDeposits[0];

        // Step 2: Update the booking status using book_id
        if (updatedDeposit.book_id) {
            const { error: bookingError } = await supabaseAdmin
                .from("bookings")
                .update({ status: "client_confirmed" })
                .eq("id", updatedDeposit.book_id);

            if (bookingError) {
                return NextResponse.json({ success: false, message: bookingError.message }, { status: 400 });
            }
        }

        // Step 3: Return the updated deposit row
        return NextResponse.json({ success: true, data: updatedDeposit });

    } catch (error) {
        console.error("Error in confirming:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while confirming." }, { status: 500 });
    }
}
