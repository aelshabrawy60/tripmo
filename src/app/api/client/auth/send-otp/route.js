import { NextRequest, NextResponse } from 'next/server';
import verifyService from '@/lib/messagebird';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, options = {} } = body;

    // Validate required fields
    if (!phone) {
      return NextResponse.json({
        success: false,
        error: 'Phone number is required'
      }, { status: 400 });
    }


    // Set default options
    const verifyOptions = {
      locale: options.locale || 'en-US',
      maxAttempts: options.maxAttempts || 3,
      timeout: options.timeout || 600, // 10 minutes
      codeLength: options.codeLength || 6,
      ...options
    };

    // Send verification code
    const result = await verifyService.sendVerification(phone, verifyOptions);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully',
        verificationId: result.verificationId,
        expiresAt: result.data.expiresAt
      }, { status: 200 });
    } else {
      console.error('MessageBird verification failed:', result.error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to send verification code',
        details: process.env.NODE_ENV === 'development' ? result.error : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Send verification error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}