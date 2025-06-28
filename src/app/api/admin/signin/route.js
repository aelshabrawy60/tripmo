import { NextResponse } from "next/server";
import { signin } from "../../../../utils/admin_auth/admin_auth";

export async function POST(request) {
  try {
    // Parse the JSON body
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    // Attempt to sign in
    const token = await signin(username, password);

    if (!token) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Return the JWT token
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Signin error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
