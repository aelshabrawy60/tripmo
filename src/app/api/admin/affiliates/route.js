import { createAffiliate } from "@/utils/affiliate_auth/affiliate_auth";
import { requireAdmin } from "@/utils/middleware/requireAdmin";
import NotificationService from "@/utils/notifications/NotificationService";
import { NextResponse } from "next/server";


export async function POST(request){
    const {email, phone, name} = await request.json();

    // Authenticate admin
    const authResult = await requireAdmin();
    if (!authResult.success) return authResult.response;
    const admin = authResult.admin;

    try {
        const { affiliate, token } = await createAffiliate(email, name, phone);

        const notifications = new NotificationService();
            await notifications.sendAffiliateWelcome("email", affiliate)
                .catch(err => console.error("Notification error:", err));
                
        return NextResponse.json({ affiliate, token });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}