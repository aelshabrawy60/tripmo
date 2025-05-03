import { supabaseAdmin } from "../supabase/service";


export function isDayBetween(startDate, endDate, date) {
    const target = new Date(date);

    const isAfterStart = !startDate || target >= new Date(startDate);
    const isBeforeEnd = !endDate || target <= new Date(endDate);

    return isAfterStart && isBeforeEnd;
}


export function isDayinWeeklyDays(weeklyDays, date) {
    const dayOfWeek = new Date(date).getDay(); // 0 (Sunday) to 6 (Saturday)
    return weeklyDays.includes(dayOfWeek);
}

export function isDayInPast(date) {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract one day from today
    const targetDate = new Date(date);
    return targetDate < today;
}

export async function isSeatsAvaliable(tripId, date, numberOfSeats, maxSeats, edit = false, editingBookingId = null) {
    let { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('bookable_id', tripId)
        .eq('day', date)
        .eq('status', 'active')

    if (error) {
        console.error("Error fetching booking data:", error);
        return false;
    }

    if (data) {

        // If edit is true, we need to exclude the current booking from the count
        if (edit && editingBookingId) {
            data = data.filter(booking => booking.id !== editingBookingId);
        }

        console.log("maxSeats", maxSeats);

        let bookedSeats = 0;
        // Calculate the total booked seats
        for(let i = 0; i < data.length; i++) {
            if (data[i].persons) {
                bookedSeats += parseInt(data[i].persons);
            }
        }
        console.log("bookedSeats", bookedSeats);
        console.log("numberOfSeats", parseInt(numberOfSeats));
        
        return bookedSeats + parseInt(numberOfSeats) <= maxSeats;
    } else {
        return true; // No bookings found, so it's available
    }
}