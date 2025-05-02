import { addBooking, checkBookingAvailability } from "@/utils/booking_engine/booking_engine";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, group_id, tripId, date, phone, numberOfSeats } = await request.json();

    try {
        const result = await addBooking(name, group_id, tripId, date, phone, numberOfSeats, "user");

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result.data });
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

    try {
        const result = await checkBookingAvailability(tripId, date, numberOfSeats);

        return NextResponse.json(result.success
            ? { success: true }
            : { success: false, message: result.message }, 
            { status: result.success ? 200 : 400 }
        );
    } catch (error) {
        console.error("Error in checking availability:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while checking availability." }, { status: 500 });
    }
}
