import { fetchAllBookings, fetchTripBookings, addBooking , cancelBooking, editBooking} from "@/utils/booking_engine/booking_engine";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function POST(request) {
    const { name, groupId, tripId, date, phone, numberOfSeats } = await request.json();

    try {
        const result = await addBooking(name, groupId, tripId, date, phone, numberOfSeats, "admin");

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error("Error in booking:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while booking." }, { status: 500 });
    }
}

export async function PUT(request) {
    const { bookingId, tripId, date, numberOfSeats } = await request.json();

    try {
        const result = await editBooking(bookingId, tripId, date, numberOfSeats, "admin");

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error("Error in editing booking:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while editing booking." }, { status: 500 });
    }
}


export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    try {
        const result = await cancelBooking(bookingId, "admin");

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error("Error in deleting booking:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while deleting booking." }, { status: 500 });
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    const filterStart = searchParams.get("filterStart");
    const filterEnd = searchParams.get("filterEnd");
    const tripId = searchParams.get("tripId");
    const tripDate = searchParams.get("tripDate");

    const supabase = await createClient()

    const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
    
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    if (tripDate && tripId) {
        const result = await fetchTripBookings(tripId, tripDate);
        return NextResponse.json(result
            ? { data: result.bookings, availableSeats: result.availableSeats, status: result.status, maxSeats: result.maxSeats}
            : { success: false}, 
            { status: result ? 200 : 400 }
        );
    }

    try {
        const result = await fetchAllBookings(groupId, filterStart, filterEnd);

        return NextResponse.json(result
            ? { data: result }
            : { success: false}, 
            { status: result ? 200 : 400 }
        );
    } catch (error) {
        console.error("Error in fetch bookings:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while fetch bookings." }, { status: 500 });
    }
}

