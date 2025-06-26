import { supabaseAdmin } from "../supabase/service";
import NotificationService from "../notifications/NotificationService";

export function calculateNetAmount(amount, total_price){
    return amount - (total_price * 0.2)
}

export function calculateReleaseDate(bookDay) {
  // Parse the input date
  const date = new Date(bookDay + "T00:00:00Z");

  // Add one day (in milliseconds)
  date.setUTCDate(date.getUTCDate() + 1);

  // Return as ISO string in UTC
  return date.toISOString(); // Example: "2025-05-24T00:00:00.000Z"
}


export async function createDeposit(bookData, url, paymentId, type) {

    const amount = bookData.deposite_price
    const status = amount > 0 ? "pending": "confirmed"

    const {data, error} = await supabaseAdmin.from("deposits").insert([{
        group_id: bookData.group_id,
        trip_id: bookData.bookable_id,
        book_id: bookData.id,
        amount: bookData.deposite_price,
        status: status,
        url: url,
        payment_id: paymentId,
        type: type,
        net_amount: calculateNetAmount(amount, bookData.total_price),
        release_date: calculateReleaseDate(bookData.day)
    }])

    if(error){
        return null
    }

    return true

}


export async function confirmDeposit(bookId) {
    // Single query to check status and get phone in one go
    const { data: booking, error: fetchError } = await supabaseAdmin
        .from("bookings")
        .select("status, clients(phone)")
        .eq("id", bookId)
        .single();

    if (fetchError) {
        console.error("Error fetching booking:", fetchError);
        return null;
    }

    // Check if already confirmed
    if (booking?.status === "active") {
        return { message: "Booking is already confirmed" };
    }

    // Update both tables in parallel
    const [depositResult, bookingResult] = await Promise.all([
        supabaseAdmin
            .from("deposits")
            .update({ status: "confirmed" })
            .eq("book_id", bookId),
        supabaseAdmin
            .from("bookings")
            .update({ status: "active" })
            .eq("id", bookId)
            .select("Group(*), *, trips(name), deposits(payment_id)")
            .single(),
    ]);

    if (depositResult.error || bookingResult.error) {
        console.error("Update errors:", { 
            deposit: depositResult.error, 
            booking: bookingResult.error 
        });
        return null;
    }

    console.log("booking result", bookingResult.data)
    // Send notification asynchronously (don't await)
    const phone = booking?.clients?.phone;
    if (phone) {
        const notifications = new NotificationService();
        await notifications.sendBookConfirmation("whatsapp", phone, bookingResult.data, bookingResult.data.Group.notifications_number)
            .catch(err => console.error("Notification error:", err));
    }

    return { 
        depositData: depositResult.data, 
        bookingData: bookingResult.data 
    };
}

export async function AddRefund(bookId, status, amount, transactionId){
    const { data, error } = await supabaseAdmin.from("refunds").insert([{
        book_id: bookId,
        amount: amount,
        status: status,
        transactionId: transactionId
    }]);

    if(status == "SUCCESS"){
        const {data, error} = await supabaseAdmin
            .from("deposits")
            .update({status: "refunded"})
            .eq("book_id", bookId)

        if(error){
            console.error("Error adding refund:", error);
            console.log("error", error)
            return null;
        }
    }

    if (error) {
        console.error("Error adding refund:", error);
        console.log("error", error)
        return null;
    }

    return true;
}


export async function fetchPaymentId(bookId){
    const {data,error} = await supabaseAdmin
        .from("deposits")
        .select("payment_id")
        .eq("book_id", bookId)
        .single()

    
    if(error){
        console.log("error")
    }
    return data
}