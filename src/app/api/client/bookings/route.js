import { addBooking, checkBookingAvailability, getBookingPrice, cancelBooking, canBookRefunded } from "@/utils/booking_engine/booking_engine";
import { initDepositPayment, initManualDepositPayment, initRefund } from "@/utils/payments/payments";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, tripId, date, phone, numberOfSeats, offset } = await request.json();

    try {
        const result = await addBooking(name, tripId, date, phone, numberOfSeats, "user", offset);

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

    try {
        const result = await checkBookingAvailability(tripId, date, numberOfSeats);

        // calc trip price

        const price = await getBookingPrice(tripId, date, numberOfSeats)
        return NextResponse.json(result.success
            ? { success: true , pricing: price}
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
        }
        // If the booking cancellation was successful
        if (result.success) {
            return NextResponse.json({ success: true, message: "Booking cancelled successfully." }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }
    } catch (error) {
        console.error("Error in cancelling booking:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while cancelling booking." }, { status: 500 });
    }
}