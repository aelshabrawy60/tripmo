import { NextResponse } from "next/server";
import { getAllCities } from "./helpers";

// GET handler - Fetch all cities
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "ar"; // default to "ar" if not provided

    const cities = await getAllCities(locale);
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
