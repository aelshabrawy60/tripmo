import { addBooking, checkBookingAvailability, getBookingPrice, cancelBooking, canBookRefunded, reactivateBooking } from "@/utils/booking_engine/booking_engine";
import { initDepositPayment, initManualDepositPayment, initRefund, initManualRefund } from "@/utils/payments/payments";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/service";
import { getTrip } from "../../dashboard/trips/helpers";
import NotificationService from "@/utils/notifications/NotificationService";
import { calculateNetAmount , calculateAffiliateAmount} from "@/utils/payments/helpers";
import { requireClient } from "@/utils/middleware/requireClient";
import { sendMetaIntiateCheckout } from "@/lib/metaCapi";
import { calcCancelationFees } from "@/utils/payments/helpers";
import { cookies } from 'next/headers';

export async function POST(request) {
    const { name, tripId, date, phone, numberOfSeats, time, offset, client_id, lang, numberOfChildren, numberOfInfants} = await request.json();

    const cookieStore = cookies();
    const currency = cookieStore.get('currency')?.value;
    const refCode = cookieStore.get('affiliate_ref')?.value || null;

    //
    try {
        const result = await addBooking(name, tripId, date, phone, numberOfSeats, "user", time , offset, client_id, lang, numberOfChildren, numberOfInfants);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

        // if the booking need deposits
        if(result.data.deposite_price > 0){
            const type = "auto"

            if(type == "auto"){
                const payment = await initDepositPayment(result.data, getTrackingData(request), lang || 'ar', currency, refCode)

                // 🟢 Send Meta Conversions API Event (InitiateCheckout)
                await sendMetaIntiateCheckout(request, result, phone, numberOfSeats)

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
    const time = searchParams.get("time");
    const fetchTrip = searchParams.get("getTrip");
    const numberOfChildren = searchParams.get("numberOfChildren") || 0;
    const numberOfInfants = searchParams.get("numberOfInfants") || 0;

    try {

        let tripData = null

        if(fetchTrip == 'true'){
            tripData = await getTrip(tripId)
        }

        const result = await checkBookingAvailability(tripId, date, parseInt(numberOfSeats) + parseInt(numberOfChildren) + parseInt(numberOfInfants), time);

        console.log("Booking availability result:", result);
        // calc trip price

        const price = await getBookingPrice(tripId, date, numberOfSeats, null, numberOfChildren, numberOfInfants)
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


export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    // Authenticate client
    const authResult = await requireClient();
    if (!authResult.success) return authResult.response;
    const client = authResult.client;

    // Input validation
    if (!bookingId) {
        return NextResponse.json({ 
            success: false, 
            message: "Booking ID is required." 
        }, { status: 400 });
    }

    // Validate bookingId format (integer)
    const bookingIdInt = parseInt(bookingId);
    if (isNaN(bookingIdInt) || bookingIdInt <= 0) {
        return NextResponse.json({ 
            success: false, 
            message: "Invalid booking ID format." 
        }, { status: 400 });
    }

    try {
        // Check if the booking belongs to the client
        const { data: booking, error: fetchError } = await supabaseAdmin
            .from("bookings")
            .select("id, client_id, status, deposite_price")
            .eq("id", bookingIdInt)
            .single();

        if (fetchError) {
            console.error("Error fetching booking:", fetchError);
            return NextResponse.json({ 
                success: false, 
                message: "Error fetching booking." 
            }, { status: 500 });
        }

        if (!booking) {
            return NextResponse.json({ 
                success: false, 
                message: "Booking not found." 
            }, { status: 404 });
        }

        // Check if the booking belongs to the authenticated client
        if (booking.client_id !== client.id) {
            return NextResponse.json({ 
                success: false, 
                message: "You are not authorized to cancel this booking." 
            }, { status: 403 });
        }

        // Step 1: Cancel the booking first
        const cancelResult = await cancelBooking(bookingIdInt, 'client');
        if (!cancelResult.success) {
            console.error("Failed to cancel booking:", cancelResult.error);
            return NextResponse.json({ 
                success: false, 
                message: "Failed to cancel booking." 
            }, { status: 500 });
        }

        try {

            // Step 2: Check if refund is possible
            const { refundable: canRefund, deposit_price } = await canBookRefunded(bookingIdInt);

            if (canRefund) {
                // Attempt refund process
                let refundAmount = booking.deposite_price - calcCancelationFees(booking.deposite_price)

                if(refundAmount == booking.deposite_price){
                    // the refund amount is the same as deposite price /// we will refund the full order
                    refundAmount = null
                }

                try {
                    await initRefund(bookingIdInt, refundAmount);
                } catch (refundError) {
                    console.error("Auto refund failed, attempting manual refund:", refundError);
                    try {
                        await initManualRefund(bookingIdInt, refundAmount);
                    } catch (manualRefundError) {
                        console.error("Manual refund also failed:", manualRefundError);
                        // Rollback: Reactivate the booking
                        await reactivateBooking(bookingIdInt);
                        return NextResponse.json({ 
                            success: false, 
                            message: "Refund failed. Booking has been restored." 
                        }, { status: 500 });
                    }
                }
            } else {
                // Adjust host fees if the booking is not refundable
                try {
                    await editFees(bookingIdInt);
                } catch (feeError) {
                    console.error("Fee adjustment failed:", feeError);
                    // Rollback: Reactivate the booking
                    await reactivateBooking(bookingIdInt);
                    return NextResponse.json({ 
                        success: false, 
                        message: "Fee adjustment failed. Booking has been restored." 
                    }, { status: 500 });
                }
            }

            // Success - send notification (fire and forget)
            const notifications = new NotificationService();
            notifications.sendBookCancellation("whatsapp", bookingIdInt, canRefund)
                .catch(err => console.error("Notification error:", err));

            return NextResponse.json({ 
                success: true, 
                message: "Booking cancelled successfully." 
            }, { status: 200 });

        } catch (error) {
            console.error("Unexpected error during refund/fee processing:", error);
            // Rollback: Reactivate the booking
            await reactivateBooking(bookingIdInt);
            return NextResponse.json({ 
                success: false, 
                message: "An error occurred. Booking has been restored." 
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Unexpected error in DELETE booking endpoint:", error);
        return NextResponse.json({ 
            success: false, 
            message: "An unexpected error occurred." 
        }, { status: 500 });
    }
}


//
async function editFees(bookId) {
    
    // Get the current deposit and related booking
    const { data: deposit, error: fetchError } = await supabaseAdmin
        .from("deposits")
        .select("id, amount, group_id, referral_code")
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

    const affiliateAmount = deposit.referral_code ? calculateAffiliateAmount(deposit.amount) : 0;

    // Update the single deposit
    const { data: updatedDeposit, error: updateError } = await supabaseAdmin
        .from("deposits")
        .update({ net_amount: newAmount, affiliate_amount: affiliateAmount })
        .eq("id", deposit.id)
        .select()
        .single();

    if (updateError) {
        console.error("Error updating deposit:", updateError);
        throw updateError;
    }

    return updatedDeposit;
}



function getTrackingData(req){
    const headers = req.headers;
    const cookie = headers.get('cookie') || '';
    const getCookie = (name) =>
        cookie.split(';').find((c) => c.trim().startsWith(`${name}=`))?.split('=')[1] || '';

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');
    const ip = headers.get('x-forwarded-for') || '';
    const ua = headers.get('user-agent') || '';
    const referer = headers.get('referer') || '';
    
    return {
        fbp,
        fbc,
        client_ip_address: ip,
        client_user_agent: ua,
        referer
    }
}