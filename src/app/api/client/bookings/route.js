import { addBooking, checkBookingAvailability, getBookingPrice, cancelBooking } from "@/utils/booking_engine/booking_engine";
import { fetchPaymentsOptions } from "@/utils/group/group";
import { redirect } from "next/dist/server/api-utils";
import { initDepositPayment, initManualDepositPayment } from "@/utils/payments/payments";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, tripId, date, phone, numberOfSeats, offset } = await request.json();

    console.log("offset", offset)
    try {
        const result = await addBooking(name, tripId, date, phone, numberOfSeats, "user", offset);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }


        // if the booking need deposits
        if(result.data.deposite_price > 0){
            const paymentOptions = await fetchPaymentsOptions(result.groupId)

            if(paymentOptions.type == "auto"){

                const payment = await initDepositPayment(result.data, paymentOptions.name, paymentOptions)
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

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");
    const date = searchParams.get("date");
    const numberOfSeats = searchParams.get("numberOfSeats");

    console.log()
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

}