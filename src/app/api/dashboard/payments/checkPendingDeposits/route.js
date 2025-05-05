// app/api/payment/confirm/route.js
import { NextResponse } from 'next/server';
import {PaymentRedirectFlow} from '../../../../../utils/payments/payments'
import { fetchPaymentsOptions } from "@/utils/group/group";
import { supabaseAdmin } from '@/utils/supabase/service';

export async function GET(request) {
    try {
        // Calculate the timestamp for 24 hours ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const twentyFourHoursAgoISOString = twentyFourHoursAgo.toISOString();
        // Query the DownPayments table for all entries from the past 24 hours
        const { data: downPayments, error: fetchError } = await supabaseAdmin.from('deposits').select('*').gte('created_at', twentyFourHoursAgoISOString);
        if (fetchError) throw fetchError;
        // Process results and track operations

        console.log(downPayments)
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
            if (payment.status == 'pending') {

                if(checkLinkExpiration(payment)){
                    const result = await checkPaymentStatus(payment.payment_id, payment.group_id)


                    console.log("result", result)
                    if(!result){
                        // Delete the corresponding slot if status is pending
                        const { error: deleteError } = await supabase.from('bookings').delete().eq('id', payment.slot_id);
                        console.log("delete error",deleteError)
                        if (deleteError) throw deleteError;
                    }
                }
            
            } else if (payment.status === 'confirmed') {
                // Update the slot status to confirmed
                const { error: updateError } = await supabase.from('bookings').update({
                status: 'confirmed'
                }).eq('id', payment.slot_id);
                if (updateError) throw updateError;
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

async function checkPaymentStatus(paymentId, groupId) {
    const paymentConfig = await fetchPaymentsOptions(groupId);
    const paymentService = new PaymentRedirectFlow(paymentConfig);

    const status = await paymentService.getPaymentStatus(paymentId)

    return status
}

// Function to check if the payment link is expired
function checkLinkExpiration(data) {
    const validDuration = 10    
    const createdDate = new Date(data.created_at).getTime();
    // Convert minutes to milliseconds (1 minute = 60,000 milliseconds)
    const expirationDate = createdDate + (validDuration * 60 * 1000);
    const currentDate = new Date().getTime();
    
    return currentDate > expirationDate;
};