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

export async function isSeatsAvaliable(tripId, date, numberOfSeats, maxSeats, edit = false, editingBookingId = null, time = null) {
    // Calculate the timestamp for 10 minutes ago
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    let { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('bookable_id', tripId)
        .eq('day', date)
        .or(`status.eq.active,and(status.eq.pending,created_at.gte.${tenMinutesAgo})`) // active booking and holded spots in the payment process yet

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

export function calculateCancelDeadline(bookDay, cancellationPolicy, timeZone) {

    const [year, month, day] = bookDay.split('-').map(Number);
    const utcBookDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // the booking date in the UTC time


    // if the booking is refundable all time
    if(cancellationPolicy.type == "refund"){
        // return the booking start date
        const utcBookDate_ = utcBookDate
        utcBookDate_.setUTCHours(utcBookDate_.getUTCHours() - timeZone) // remove the diffrence of time between the UTC and the user timezone
        return utcBookDate_
    }

    // if the booking is not refundable all the tme
    if(cancellationPolicy.type == "no_refund"){
        return null
    }

    // if the booking is refundable untile X hours before the booking day

    if(cancellationPolicy.type == "refund_until"){
        const amount = cancellationPolicy.until + timeZone; // amount in hours
        utcBookDate.setUTCHours(utcBookDate.getUTCHours() - amount);
        
        return utcBookDate;
    }

    return null
}
