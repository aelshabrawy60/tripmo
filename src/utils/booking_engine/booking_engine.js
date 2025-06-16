
// add booking
// check booking avlibility
// cancel booking
import { createClient } from "../supabase/server";
import { supabaseAdmin } from "../supabase/service";
import { isDayBetween, isSeatsAvaliable, isDayinWeeklyDays, isDayInPast, calculateCancelDeadline } from "./helpers";

function getDay(dateString) {
    // Force the date to be interpreted exactly as provided
    // By adding 'T00:00:00Z' we explicitly say this is UTC time
    const date = new Date(`${dateString}T00:00:00Z`);
    
    // Get the day of week (0 = Sunday, 1 = Monday, etc.)
    return date.getUTCDay();
}

export async function getBookingPrice(tripId, date, numberOfSeats, TripData = null){
    if(!TripData){
        TripData = await fetchTripData(tripId);
    }

    let DeafultTripPrice = TripData.pricing.PersonPrice;

    console.log("TripData.pricing", TripData.pricing);

    if(TripData.pricing.PricePerWeeklyDays?.length > 0){
        console.log("date", date);
        const currentDay = getDay(date);
        const weeklyPrice = TripData.pricing.PricePerWeeklyDays.find((price) => price.weekly_day === currentDay);
        console.log("currentDay", currentDay);
        console.log("TripData.pricing.PricePerWeeklyDays", TripData.pricing.PricePerWeeklyDays);
        console.log("weeklyPrice", weeklyPrice);
        if(weeklyPrice){
            DeafultTripPrice *= weeklyPrice.price / 100;
        }
    }

    if(TripData.pricing.PricePerPersons?.length > 0){
        const personPrice = TripData.pricing.PricePerPersons.find((price) => price.personsCount === numberOfSeats);
        if(personPrice){
            DeafultTripPrice *= personPrice.price / 100;
        }
    }

    DeafultTripPrice *= numberOfSeats;
    let depositPrice = DeafultTripPrice * (TripData.pricing.AdvancePaymentPercentage / 100);
    return {
        price: DeafultTripPrice,
        deposit: depositPrice,
    };
}

export async function checkBookingAvailability(tripId, date, numberOfSeats, TripData = null, edit = false, editingBookingId = null) {
    if (!TripData) {
        TripData = await fetchTripData(tripId);
    }

    if (!TripData) {
        return { success: false, message: "Trip not found." };
    }

    const maxSeats = TripData.max_clients;
    const avlibilityType = TripData.availability_type;

    if (avlibilityType === "fixed") {
        if (TripData.available_day !== date) {
            return { success: false, message: "Trip is not available on this fixed date." };
        }
    } else if (avlibilityType === "daily" || avlibilityType === "weekly") {
        if (!isDayBetween(TripData.start_date, TripData.end_date, date)) {
            return { success: false, message: "Trip date is outside of allowed range." };
        }

        if (avlibilityType === "weekly" && !isDayinWeeklyDays(TripData.weekly_days, date)) {
            return { success: false, message: "Trip is not available on this weekly day." };
        }
    }

    const seatsAvailable = await isSeatsAvaliable(tripId, date, numberOfSeats, maxSeats, edit, editingBookingId);
    if (!seatsAvailable) {
        return { success: false, message: "Not enough seats available." };
    }

    return { success: true };
}


export async function addBooking(name, tripId, date, phone, numberOfSeats, user_role, timeZone = 0, client_id = null) {   
    const TripData = await fetchTripData(tripId);
    
    const availability = await checkBookingAvailability(tripId, date, numberOfSeats, TripData);
    
    if(isDayInPast(date)){
        return { success: false, message: "Cannot book a trip in the past." };

    }
    
    if (!availability.success) {
        console.error("Booking not available:", availability.message);
        return { success: false, message: availability.message };
    }

    const {price, deposit} = await getBookingPrice(tripId, date, numberOfSeats, TripData);

    const cancel_deadline = calculateCancelDeadline(date, TripData.cancellation_policy.until, timeZone);
    
    const { data, error } = await supabaseAdmin
        .from('bookings')
        .insert([{
            client_name: name,
            group_id: TripData.group_id,
            bookable_id: tripId,
            day: date,
            client_phone: phone,
            persons: numberOfSeats,
            total_price: price,
            deposite_price: deposit,
            can_canceled_until: cancel_deadline,
            status: deposit > 0 && user_role != "admin" ? "pending" : "active",
            client_id: client_id
        }])
        .select('*')
        .single();

    if (error) {
        console.error("Error adding booking:", error);
        return { success: false, message: "Database error occurred while adding booking." };
    }

    return { success: true, data, groupId: TripData.group_id };
}



export async function editBooking(booking_id, tripId, date, numberOfSeats, user_role) {
    // check avalibility first
    const availability = await checkBookingAvailability(tripId, date, numberOfSeats, null , true, booking_id);

    if (!availability.success) {
        console.error("Booking not available:", availability.message);
        return { success: false, message: availability.message };
    }

    const {data, error} = await supabaseAdmin
        .from('bookings')
        .update({
            day: date,
            persons: numberOfSeats,
        })
        .eq('id', booking_id)
        .select('*')
        .single()

    if (error) {
        console.error("Error updating booking:", error);
        return null;
    }
    return { success: true, data };
}

export async function cancelBooking(booking_id, user_role){
    const {data, error} = await supabaseAdmin
        .from('bookings')
        .update({
            status: "canceled",
        })
        .eq('id', booking_id)
        .select('*')
        .single()

    if (error) {
        console.error("Error deleting booking:", error);
        return null;
    }
    return {"success": true, data};
}

export async function fetchAllBookings(groupId, startFilter = null, endFilter = null) {
    let query = supabaseAdmin
        .from('bookings')
        .select('* , trips (id, name)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

    if (startFilter) {
        query = query.gte('created_at', startFilter);
    }

    if (endFilter) {
        query = query.lte('created_at', endFilter);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching bookings:", error);
        return null;
    }

    return data;
}

export async function fetchTripBookings(tripId, date) {
    const bookingsQuery = supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('bookable_id', tripId)
        .eq('day', date)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    const tripDataQuery = fetchTripData(tripId);

    const [{ data, error }, tripData] = await Promise.all([
        bookingsQuery,
        tripDataQuery
    ]);

    if (error) {
        console.error("Error fetching trip bookings:", error);
        return null;
    }

    if (!tripData) {
        return null;
    }    


    const maxSeats = tripData.max_clients;
    const bookedSeats = data.reduce((acc, booking) => acc + booking.persons, 0);
    const availableSeats = maxSeats - bookedSeats;
    const bookingStatus = availableSeats >= 0 ? "available" : "full";

    return {
        bookings: data,
        availableSeats,
        status: bookingStatus,
        maxSeats
    };
}


async function fetchTripData(tripId){

    const {data, error} = await supabaseAdmin
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()

    if (error) {
        console.error("Error fetching trip data:", error);
        return null;
    }

    return data;
}


export async function canBookRefunded(bookId){
    const {data, error} = await supabaseAdmin
        .from('bookings')
        .select('can_canceled_until, trips (cancellation_policy)')
        .eq('id', bookId)
        .single()

    if (error) {
        console.error("Error fetching booking data:", error);
        return false;
    }

    if (data.trips.cancellation_policy.type == "refund"){
        return true; // Booking can be refunded without any conditions
    }

    if (data.trips.cancellation_policy.type == "no_refund"){
        return false; // Booking cannot be refunded
    }

    const canCanceledUntil = new Date(data.can_canceled_until);
    // get the GMT+0 date

    const nowUTC = new Date(); // This is in local time, but internally stores UTC
    const utcTimestamp = nowUTC.getTime(); // This is a UTC timestamp in milliseconds

    if (canCanceledUntil.getTime() > utcTimestamp) {
        return true; // Booking can be refunded
    }

    return false; // Booking cannot be refunded
}