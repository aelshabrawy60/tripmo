import NotificationService from "@/utils/notifications/NotificationService";
import { supabaseAdmin } from "@/utils/supabase/service";

async function fetchReadyToSendBookings(limit = 10) {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]; // Also in YYYY-MM-DD format

    const { data, error } = await supabaseAdmin
        .from("bookings")
        .select("id, client_phone, deposits(payment_id)")
        .eq("rate_notification_sent", false)
        .lt("day", today) // Trip day is before today
        .gte("day", fiveDaysAgo) // Only trips within the last 5 days
        .limit(limit);

    if (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }

    return data;
}


export async function GET(request) {
    const notifications = new NotificationService();
    const limit = 10;

    const bookings = await fetchReadyToSendBookings(limit);

    if (bookings.length === 0) {
        return Response.json({ message: "No bookings to notify." });
    }

    // Parallel processing
    const results = await Promise.allSettled(
        bookings.map(async (booking) => {
            const { id, client_phone } = booking;

            try {
                await notifications.sendTripRating("whatsapp", client_phone, booking);

                // Update the booking as sent
                await supabaseAdmin
                    .from("bookings")
                    .update({ rate_notification_sent: true })
                    .eq("id", id);

                return { id, status: "success" };
            } catch (err) {
                console.error(`Error for ${client_phone}:`, err);
                return { id, status: "error", error: err.message };
            }
        })
    );

    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failureCount = results.length - successCount;

    return Response.json({
        message: `Processed ${results.length} notifications.`,
        success: successCount,
        failed: failureCount,
    });
}
