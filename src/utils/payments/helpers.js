import { supabaseAdmin } from "../supabase/service";


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

    const [depositData, depositError] = [depositResult.data, depositResult.error];
    const [bookingData, bookingError] = [bookingResult.data, bookingResult.error];

    if (depositError || bookingError) {
        return null;
    }

    return { depositData, bookingData };
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