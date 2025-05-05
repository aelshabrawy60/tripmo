import { supabaseAdmin } from "../supabase/service";


export async function createDeposit(groupId, tripId, bookId, amount, url, paymentId , type) {

    const {data, error} = await supabaseAdmin.from("deposits").insert([{
        group_id: groupId,
        trip_id: tripId,
        book_id: bookId,
        amount: amount,
        status: "pending",
        url: url,
        payment_id: paymentId,
        type: type
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
