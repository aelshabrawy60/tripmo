import { signin } from "@/utils/affiliate_auth/affiliate_auth";
import { NextResponse } from "next/server";

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
    let token = null
    try {
      token = await signin(username, password);
    }catch(e){
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

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
