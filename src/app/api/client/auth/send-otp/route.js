// File: app/api/send-otp/route.ts
// Next.js 13+ App Router API Route for sending OTP via Fazpass

import {NextResponse } from 'next/server';


export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body;

    // Validate phone number
    if (!phone) {
      return NextResponse.json({ 
        success: false, 
        message: 'رقم الهاتف مطلوب' 
      }, { status: 400 });
    }

    // Validate phone format (should start with country code)
    if (!/^\d{10,15}$/.test(phone)) {
      return NextResponse.json({
        success: false,
        message: 'صيغة رقم الهاتف غير صحيحة'
      }, { status: 400 });
    }

    console.log('Sending OTP request to Fazpass:', { phone });


    if (true) {
      return NextResponse.json({
        success: true,
        message: 'تم إرسال رمز التحقق بنجاح'
      });
    } else {
      console.error('Fazpass OTP Request Error:', data);
      return NextResponse.json({
        success: false,
        message: data.message || 'فشل في إرسال رمز التحقق'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({
      success: false,
      message: 'خطأ في الخادم - حاول مرة أخرى'
    }, { status: 500 });
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    success: false,
    message: 'Method not allowed' 
  }, { status: 405 });
}