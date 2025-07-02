import { NextResponse } from "next/server";
import { updateProfile } from "./helpers";
import { withAuth } from "@/lib/auth";

export const PUT = withAuth(async (request) => {
    const { groupId } = request.auth;
    const body = await request.json();
    const { profileId, ...updatedProfile } = body;

    if (!groupId) {
        return NextResponse.json(
            { error: "Profile ID is required" },
            { status: 400 }
        );
    }

    try {
        const updatedData = await updateProfile(groupId, updatedProfile);
        return NextResponse.json(updatedData);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
})