import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { activateCoupon, getCoupounStatus } from "./helpers";

export const POST = withAuth(async (request) => {
    const {groupId} = request.auth

    try {
        const body = await request.json();
        const { coupon } = body;

        const result = await activateCoupon(coupon, groupId);

        if (result.status == "success") {
            return NextResponse.json(
                { message: "success", data : result.coupon},
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "error"},
            { error: "كود خطأ" },
            { status: 400 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
})


export const GET = withAuth(async (request) => {
    const {groupId} = request.auth

    try {
        const result = await getCoupounStatus(groupId);

        if (result != null) {
            return NextResponse.json(
                { message: "success", data : result}, // data.amount, data.end_date
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "no"}, // data.amount, data.end_date
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
})