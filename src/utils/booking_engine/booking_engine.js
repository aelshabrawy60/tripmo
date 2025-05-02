
// add booking
// check booking avlibility
// cancel booking
import { createClient } from "../supabase/server";
import { supabaseAdmin } from "../supabase/service";
import { isDayBetween, isSeatsAvaliable, isDayinWeeklyDays, isDayInPast } from "./helpers";

export async function getBookingPrice(tripId, numberOfSeats, TripData = null){
    if(!TripData){
        TripData = await fetchTripData(tripId);
    }
}


export async function checkBookingAvailability(tripId, date, numberOfSeats, TripData = null) {
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

    const seatsAvailable = await isSeatsAvaliable(tripId, date, numberOfSeats, maxSeats);
    if (!seatsAvailable) {
        return { success: false, message: "Not enough seats available." };
    }

    return { success: true };
}


export async function addBooking(name, group_id, tripId, date, phone, numberOfSeats, user_role) {   
    const TripData = await fetchTripData(tripId);
    
    const availability = await checkBookingAvailability(tripId, date, numberOfSeats, TripData);
    
    if(isDayInPast(date)){
        return { success: false, message: "Cannot book a trip in the past." };

    }
    
    if (!availability.success) {
        console.error("Booking not available:", availability.message);
        return { success: false, message: availability.message };
    }

    const { data, error } = await supabaseAdmin
        .from('bookings')
        .insert([{
            client_name: name,
            group_id: group_id,
            bookable_id: tripId,
            day: date,
            client_phone: phone,
            persons: numberOfSeats,
            status: "active",
        }])
        .select('*')
        .single();

    if (error) {
        console.error("Error adding booking:", error);
        return { success: false, message: "Database error occurred while adding booking." };
    }

    return { success: true, data };
}



export async function editBooking(booking_id, name, group_id, tripId, date, phone, numberOfSeats, user_role) {
    const {data, error} = await supabaseAdmin
        .from('bookings')
        .update({
            name: name,
            group_id: group_id,
            trip_id: tripId,
            date: date,
            phone: phone,
            number_of_seats: numberOfSeats,
        })
        .eq('id', booking_id)
        .select('*')
        .single()

    if (error) {
        console.error("Error updating booking:", error);
        return null;
    }
    return data;
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
    return data;
}

export async function fetchAllBookings(groupId, startFilter = null, endFilter = null) {
    let query = supabaseAdmin
        .from('bookings')
        .select('*')
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