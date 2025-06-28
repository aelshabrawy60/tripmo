import { addBooking, checkBookingAvailability, getBookingPrice, cancelBooking, canBookRefunded } from "@/utils/booking_engine/booking_engine";
import { initDepositPayment, initManualDepositPayment, initRefund } from "@/utils/payments/payments";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { getTrip } from "../../dashboard/trips/helpers";
import { updateTripScore } from "@/utils/trips_engine/trips_scoring";
import NotificationService from "@/utils/notifications/NotificationService";
import { calculateNetAmount } from "@/utils/payments/helpers";


export async function POST(request) {
    const { name, tripId, date, phone, numberOfSeats, offset, client_id} = await request.json();

    //
    try {
        const result = await addBooking(name, tripId, date, phone, numberOfSeats, "user", offset, client_id);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }


        // if the booking need deposits
        if(result.data.deposite_price > 0){
            const type = "auto"

            if(type == "auto"){
                const payment = await initDepositPayment(result.data)
                return NextResponse.json({ success: true, data: result.data, redirectUrl: payment.redirectUrl });

            }else{
                const payment = await initManualDepositPayment(result.data)
                return NextResponse.json({ success: true, data: result.data, redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/manual_payment/${payment}` });
            }
        }

        // deposit with 0$
        const payment = await initManualDepositPayment(result.data)
                
        return NextResponse.json({ success: true, data: result.data, redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/booking?paymentId=${payment}` });

    } catch (error) {
        console.error("Error in booking:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while booking." }, { status: 500 });
    }
}


// check if the book is aval
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");
    const date = searchParams.get("date");
    const numberOfSeats = searchParams.get("numberOfSeats");
    const fetchTrip = searchParams.get("getTrip");

    try {

        let tripData = null

        if(fetchTrip == 'true'){
            tripData = await getTrip(tripId)
            console.log("data", tripData)
        }

        const result = await checkBookingAvailability(tripId, date, numberOfSeats);

        // calc trip price

        const price = await getBookingPrice(tripId, date, numberOfSeats)
        return NextResponse.json(result.success
            ? { success: true , pricing: price, tripData: tripData}
            : { success: false, message: result.message, pricing: price }, 
            { status: result.success ? 200 : 400 }
        );
    } catch (error) {
        console.error("Error in checking availability:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while checking availability." }, { status: 500 });
    }
}


export async function DELETE(request){
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
        return NextResponse.json({ success: false, message: "Booking ID is required." }, { status: 400 });
    }
    
    try {
        const result = await cancelBooking(bookingId);
        const canRefund = await canBookRefunded(bookingId);

        if (canRefund) {
            // If the booking can be refunded, initiate the refund process
            await initRefund(bookingId);
        }else{
            // downgrade fees from total price to the deposit amount
            await editFees(bookingId);
        }

        // If the booking cancellation was successful
        if (result.success) {

            const notifications = new NotificationService();
                notifications.sendBookCancellation("whatsapp", bookingId, canRefund)
                    .catch(err => console.error("Notification error:", err));

            return NextResponse.json({ success: true, message: "Booking cancelled successfully." }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

    } catch (error) {
        console.error("Error in cancelling booking:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while cancelling booking." }, { status: 500 });
    }
}



//
async function editFees(bookId) {

    // Get the current deposit and related booking
    const { data: deposit, error: fetchError } = await supabaseAdmin
        .from("deposits")
        .select("id, amount, group_id")
        .eq("book_id", bookId)
        .single();

    if (fetchError) {
        console.error("Error fetching deposit:", fetchError);
        throw fetchError;
    }

    const newAmount = await calculateNetAmount(
        deposit.amount,
        deposit.amount,
        deposit.group_id
    );


    // Update the single deposit
    const { data: updatedDeposit, error: updateError } = await supabaseAdmin
        .from("deposits")
        .update({ net_amount: newAmount })
        .eq("id", deposit.id)
        .select()
        .single();

    if (updateError) {
        console.error("Error updating deposit:", updateError);
        throw updateError;
    }

    return updatedDeposit;
}
