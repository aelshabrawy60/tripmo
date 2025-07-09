// app/api/payment/confirm/route.js
import { supabaseAdmin } from '@/utils/supabase/service';
export async function GET(request) {
    try {
        const { data: downPayments, error: fetchError } = await supabaseAdmin.from('deposits').select('*, bookings(day, created_at)').eq("host_status", "pending")
        if (fetchError) throw fetchError;
        // Process results and track operations

        const results = {
            processed: 0,
            deleted: 0,
            updated: 0,
            skipped: 0,
            errors: 0,
            details: []
        };

        // Process each row based on its status
        for (const payment of downPayments){
            try {
            if (payment.host_status == 'pending') {

                if(isDepositAvil(payment)){
                    const {data, error} = await supabaseAdmin
                        .from("deposits")
                        .update({host_status: "aval"})
                        .eq("id", payment.id)

                    if(error){
                        return error
                    }
                }
            
            }
            } catch (rowError) {}
        }
        // Return the results
        return new Response(JSON.stringify({
            success: true,
            message: `Processed ${results.processed} down payments (${results.deleted} deleted, ${results.updated} updated, ${results.skipped} skipped, ${results.errors} errors)`,
            results
        }), {
            headers: {
            'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message: 'An error occurred while processing down payments',
            error: error.message
        }), {
            headers: {
            'Content-Type': 'application/json'
            },
            status: 400
        });
    }
}


function isDepositAvil(deposit) {
    const bookDay = new Date(deposit.bookings.day); // parsed as local midnight
    const bookCreatedAt = new Date(deposit.bookings.created_at); // ISO string, parsed in UTC
    const currentDate = new Date(); // current time in local timezone

    const oneDayMs = 24 * 60 * 60 * 1000;

    const isAfterBookDay = currentDate - bookDay > oneDayMs;
    const isAfterCreatedAt = currentDate - bookCreatedAt > 3 * oneDayMs;

    return isAfterBookDay && isAfterCreatedAt;
}
