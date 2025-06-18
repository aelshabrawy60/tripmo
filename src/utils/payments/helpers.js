import { supabaseAdmin } from "../supabase/service";
import NotificationService from "../notifications/NotificationService";

export function calculateNetAmount(amount, total_price){
    return amount - (total_price * 0.2)
}


export async function createDeposit(groupId, tripId, bookId, amount, url, paymentId , type, total_price= null) {

    const status = amount > 0 ? "pending": "confirmed"

    const {data, error} = await supabaseAdmin.from("deposits").insert([{
        group_id: groupId,
        trip_id: tripId,
        book_id: bookId,
        amount: amount,
        status: status,
        url: url,
        payment_id: paymentId,
        type: type,
        host_status: "pending",
        net_amount: calculateNetAmount(amount, total_price)
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
            .eq("id", bookId),
    ]);

    if (depositResult.error || bookingResult.error) {
        console.error("Update errors:", { 
            deposit: depositResult.error, 
            booking: bookingResult.error 
        });
        return null;
    }

    // Send notification asynchronously (don't await)
    const phone = booking?.clients?.phone;
    if (phone) {
        const notifications = new NotificationService();
        notifications.sendBookConfirmation("whatsapp", phone)
            .catch(err => console.error("Notification error:", err));
    }

    return { 
        depositData: depositResult.data, 
        bookingData: bookingResult.data 
    };
}

export async function AddRefund(bookId, status, amount){
    const { data, error } = await supabaseAdmin.from("refunds").insert([{
        book_id: bookId,
        amount: amount,
        status: status
    }]);

    if(status == "SUCCESS"){
        const {data, error} = await supabaseAdmin
            .from("deposits")
            .update({host_status: "refunded"})
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