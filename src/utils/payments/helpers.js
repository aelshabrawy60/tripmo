import { supabaseAdmin } from "../supabase/service";
import NotificationService from "../notifications/NotificationService";




// check for valid copuns
async function checkForActiveCoupons(groupId) {
    const {data, error} = await supabaseAdmin
        .from("coupons")
        .select("amount")
        .eq("status" , "used")
        .eq("group_id", groupId)
        .gte("end_date", new Date().toISOString())

    
    if(error){
        console.log(error)
        return null
    }

    if(data.length >= 1){
        return data[0].amount
    }

    return null
}

export async function calculateNetAmount(amount, total_price, group_id){
    let RehlaNowCommision = 0.2

    if(total_price >= 2000 && total_price <= 8000){
        RehlaNowCommision = 0.15
    }else if(total_price > 8000){
        RehlaNowCommision = 0.1
    }

    const coupon = await checkForActiveCoupons(group_id)

    console.log("coupun", coupon)
    if(coupon != null){
        const s = 1 - (coupon / 100)
        RehlaNowCommision = RehlaNowCommision * s
    }

    const commision = total_price * RehlaNowCommision

    return amount - commision
}

export function calculateAffiliateAmount(total_price){
    let affiliateCommissionRate = 0.08; // 8% affiliate commission

    if (total_price >= 2000 && total_price <= 8000){
        affiliateCommissionRate = 0.06
    }else if(total_price > 8000){
        affiliateCommissionRate = 0.04
    }
    return total_price * affiliateCommissionRate;
}



function calcualteMinDateToRelease(){
    const minDays = 3

    const minDate = new Date();
    minDate.setUTCDate(minDate.getUTCDate() + minDays); // Minimum date = now + 3 days

    return minDate;
}



export function calculateReleaseDate(bookDay) {
  // Parse the input date
  const date = new Date(bookDay + "T00:00:00Z");

  // Add one day (in milliseconds)
  date.setUTCDate(date.getUTCDate() + 1);

  // Return as ISO string in UTC
  return date.toISOString(); // Example: "2025-05-24T00:00:00.000Z"
}



export function calculateReleaseDateAggresive(cancelDeadlineDate) {
  const minDate = calcualteMinDateToRelease()

  if (!cancelDeadlineDate) {
    return minDate.toISOString();
  }

  const parsedCancelDate = new Date(cancelDeadlineDate);
  if (parsedCancelDate < minDate) {
    // cancelDeadlineDate is less than 3 days from now
    return minDate.toISOString();
  }

  // cancelDeadlineDate is valid and at least 3 days from now
  return parsedCancelDate.toISOString();
}



export async function createDeposit(bookData, url, paymentId, type, tracking_data = null, affiliate_ref = null) {

    const amount = bookData.deposite_price
    const status = amount > 0 ? "pending": "confirmed"

    // for octoboats host the release date is 3 days after book
    const releaseDate = bookData.group_id != 900 ?  calculateReleaseDate(bookData.day) : calculateReleaseDateAggresive(bookData.can_canceled_until)

    const {data, error} = await supabaseAdmin.from("deposits").insert([{
        group_id: bookData.group_id,
        trip_id: bookData.bookable_id,
        book_id: bookData.id,
        amount: bookData.deposite_price,
        status: status,
        url: url,
        payment_id: paymentId,
        type: type,
        net_amount: await calculateNetAmount(amount, bookData.total_price, bookData.group_id),
        release_date: releaseDate,
        tracking_data: tracking_data,
        referral_code: affiliate_ref,
        affiliate_amount: affiliate_ref? calculateAffiliateAmount(bookData.total_price) : 0
    }])

    if(error){
        return null
    }

    return true

}

/*
export async function createDeposit(bookData, url, paymentId, type, tracking_data = null) {
    try {
        const amount = bookData.deposite_price;
        const status = amount > 0 ? "pending" : "confirmed";

        const netAmount = await calculateNetAmount(amount, bookData.total_price, bookData.group_id);

        // 2. Determine the release schedule using business logic helper.
        const installments = calculateInstallments(bookData, netAmount);

        // 3. Call the RPC function with a single object containing all parameters.
        const { data: newDepositId, error } = await supabaseAdmin.rpc('create_deposit_with_installments', {
            p_group_id: bookData.group_id,
            p_trip_id: bookData.bookable_id,
            p_book_id: bookData.id,
            p_amount: amount,
            p_net_amount: netAmount,
            p_status: status,
            p_url: url,
            p_payment_id: paymentId,
            p_type: type,
            p_tracking_data: tracking_data,
            p_installments: installments
        });

        if (error) {
            // The RPC will raise an error if the installment sum doesn't match netAmount,
            // which will be caught here.
            console.error("Failed to create deposit with installments:", error);
            return null;
        }

        console.log("Successfully created deposit and its installments. New Deposit ID:", newDepositId);
        return true;

    } catch (e) {
        console.error("An unexpected error occurred in createDeposit:", e);
        return null;
    }
}
*/


export async function confirmDeposit(bookId) {
    // Single query to check status and get phone in one go
    const { data: booking, error: fetchError } = await supabaseAdmin
        .from("bookings")
        .select("Group(*), *, trips(name, id, dest_city (name, country)), deposits(payment_id, tracking_data), clients(phone)")
        .eq("id", bookId)
        .single();

    if (fetchError) {
        console.error("Error fetching booking:", fetchError);
        throw new fetchError
    }

    // Check if already confirmed
    if (booking?.status === "active") {
        return { 
            message: "Booking is already confirmed",
            bookingData: booking
         };
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
            .select("Group(*), *, trips(name, id, dest_city (name, country)), deposits(payment_id, tracking_data)")
            .single(),
    ]);

    if (depositResult.error || bookingResult.error) {
        console.error("Update errors:", { 
            deposit: depositResult.error, 
            booking: bookingResult.error 
        });
        throw new Error("Failed to update booking or deposit status");
    }

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

    if(status == "SUCCESS" || status == "PENDING"){
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

export function calcCancelationFees(totalPrice) {
    const cancelationFees = 0.0
    return totalPrice * cancelationFees
}



/**
 * Calculates the release schedule for a new deposit based on business rules.

function calculateInstallments(bookData, totalNetAmount) {
    const finalReleaseDate = calculateReleaseDate(bookData.can_canceled_until);

    const isPartialPayoutAllowed = bookData.cancellation_fees != 0 && bookData.cancellation_fees != null; 

    if (isPartialPayoutAllowed) {
        const initialAmount = bookData.cancellation_fees;
        const finalAmount = totalNetAmount - bookData.cancellation_fees;
        
        return [
            {
                amount: initialAmount,
                release_date: calcualteMinDateToRelease().toISOString()
            },
            {
                amount: finalAmount,
                release_date: finalReleaseDate
            }
        ];

    } else {
        return [
            {
                amount: totalNetAmount,
                release_date: finalReleaseDate
            }
        ];
    }
}

*/