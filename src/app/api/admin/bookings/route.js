import { NextResponse } from "next/server";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import { fetchBookings, getBookingStats } from "./helpers";
import { addBooking } from "@/utils/booking_engine/booking_engine";
import { initDepositPayment, initManualDepositPayment } from "@/utils/payments/payments";
import { confirmDeposit } from "@/utils/payments/helpers";

export async function GET(request) {
  try {
    // Authenticate admin
    const authResult = await requireAdmin("bookings");
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      timeFilter: searchParams.get("timeFilter"),
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      status: searchParams.get("status"),
      tripId: searchParams.get("tripId"),
      clientId: searchParams.get("clientId"),
      bookId: searchParams.get("bookId"),
      minAmount: searchParams.get("minAmount"),
      maxAmount: searchParams.get("maxAmount"),
      page: parseInt(searchParams.get("page") || "1"),
      limit: Math.min(parseInt(searchParams.get("limit") || "50"), 100),
      sortBy: searchParams.get("sortBy") || "created_at",
      sortOrder: searchParams.get("sortOrder") || "desc"
    };

    // Fetch data
    const result = await fetchBookings(filters);
    const includeStats = searchParams.get("includeStats") === "true";
    const stats = includeStats ? await getBookingStats(filters) : null;

    return NextResponse.json({
      success: true,
      ...result,
      stats,
    });

  } catch (error) {
    console.error("Error in bookings API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
        message: error.message
      },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  // Authenticate admin
  const authResult = await requireAdmin("bookings");
  if (!authResult.success) return authResult.response;
  const admin = authResult.admin;

  const { name, tripId, date, phone, numberOfSeats, time, numberOfChildren, numberOfInfants} = await request.json();
  if (!name || !tripId || !date || !phone || !numberOfSeats || !time) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing required fields",
      },
      { status: 400 }
    );
  }
  
  try {
    const result = await addBooking(name, tripId, date, phone, numberOfSeats, "user", time, null, null, 'en', numberOfChildren, numberOfInfants);

    if (!result.success) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    const currency = 'USD'
    // if the booking need deposits
    if(result.data.deposite_price > 0){
        const type = "auto"

        if(type == "auto"){
            const payment = await initDepositPayment(result.data, null, 'en', currency, null)

            const bookingData = await confirmDeposit(result.data.id)
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