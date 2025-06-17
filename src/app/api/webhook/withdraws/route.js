// app/api/webhook/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json(); // or .text(), depending on the webhook provider

    // Optional: validate signature here if the provider supports it

    // Do something with the webhook data
    console.log('Webhook received:', body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
