import { NextResponse } from "next/server";
import {getAllCities} from './helpers'


// GET handler - Fetch all cities
export async function GET(request) {
  try {
    const cities = await getAllCities();
    return NextResponse.json(cities);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}