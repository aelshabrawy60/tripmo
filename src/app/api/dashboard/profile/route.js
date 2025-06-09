import { NextResponse } from "next/server";
import { updateProfile } from "./helpers";

export async function PUT(request) {
    const body = await request.json();
    const { profileId, ...updatedProfile } = body;

    if (!profileId) {
        return NextResponse.json(
            { error: "Profile ID is required" },
            { status: 400 }
        );
    }

    try {
        const updatedData = await updateProfile(profileId, updatedProfile);
        return NextResponse.json(updatedData);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}