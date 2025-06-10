import { NextResponse } from "next/server";
import { canBookRefunded } from "@/utils/booking_engine/booking_engine";

export async function GET(request){
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");

    try {
        const result = await canBookRefunded(bookId);

        // calc trip price
        if(result){
            return NextResponse.json({status: true});
        }

        return NextResponse.json({status: false});
        
    } catch (error) {
        console.error("Error in checking refundability:", error);
        return NextResponse.json({ success: false, message: "Unexpected error occurred while checking refundability." }, { status: 500 });
    }
}