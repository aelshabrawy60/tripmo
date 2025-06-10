import { NextResponse } from "next/server";
import { calculateAvalBalance, calculateTotalBalance } from "./helper";

export async function GET(request) {
    try {
        // Extract groupId from URL search params
        const { searchParams } = new URL(request.url);
        const groupId = searchParams.get('groupId');
        
        // Validate groupId parameter
        if (!groupId) {
            return NextResponse.json(
                { error: "groupId parameter is required" },
                { status: 400 }
            );
        }
        
        // Calculate both balances concurrently
        const [total_balance, aval_balance] = await Promise.all([
            calculateTotalBalance(groupId),
            calculateAvalBalance(groupId)
        ]);
        
        // Return the response
        return NextResponse.json({
            total_balance,
            aval_balance
        });
        
    } catch (error) {
        console.error("Error calculating balances:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}