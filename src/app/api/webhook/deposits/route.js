// app/api/kashier/webhook/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { confirmDeposit } from '@/utils/payments/helpers';

const PAYMENT_API_KEY = "be73f1e6187aee67e47f5aa2eab6f6c6$a88c240bebf4b5802b26759dcb552125cea354a93c52ccf1f91e02106587cb3537ce8f60738d50d6bb9248e996423a94";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const parsedBody = JSON.parse(rawBody);
    const { data, event, hash } = parsedBody;

    console.log('Webhook received:', { event, data });

    if (!data || !data.signatureKeys || !Array.isArray(data.signatureKeys)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Get signature from header or hash field in payload
    const signatureHeader = request.headers.get('x-kashier-signature') || hash;
    
    if (!signatureHeader) {
      console.warn('No signature found in header or payload');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Sort the signatureKeys alphabetically
    const sortedKeys = [...data.signatureKeys].sort();
    console.log('Sorted signature keys:', sortedKeys);

    // Create signature payload by concatenating key=value pairs
    const signaturePayload = sortedKeys
      .map(key => {
        const value = data[key];
        // URL encode only the value, not the key
        const encodedValue = encodeURIComponent(String(value));
        return `${key}=${encodedValue}`;
      })
      .join('&');

    console.log('Signature payload:', signaturePayload);

    // Generate HMAC SHA256 signature
    const calculatedSignature = crypto
      .createHmac('sha256', PAYMENT_API_KEY)
      .update(signaturePayload)
      .digest('hex');

    console.log('Calculated signature:', calculatedSignature);
    console.log('Received signature:', signatureHeader);

    if (calculatedSignature !== signatureHeader) {
      console.warn('Invalid signature');
      console.log('Expected:', calculatedSignature);
      console.log('Received:', signatureHeader);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // ✅ Signature is valid. Process the event
    console.log('✅ Valid webhook received:', event, data);

    // Handle different event types
    switch (event) {
      case 'pay':
        if (data.status === 'SUCCESS') {
          const merchantOrderId = data.merchantOrderId;
          const transactionId = data.transactionId;
          const amount = data.amount;
          
          console.log(`[Payment Success] Order: ${merchantOrderId}, TX: ${transactionId}, Amount: ${amount}`);
          await confirmDeposit(merchantOrderId);
        }
        break;
        
      case 'refund':
        // Handle refund event
        console.log('Refund event received:', data);
        break;
        
      case 'authorize':
        // Handle authorize event
        console.log('Authorize event received:', data);
        break;
        
      case 'void':
        // Handle void event
        console.log('Void event received:', data);
        break;
        
      case 'capture':
        // Handle capture event
        console.log('Capture event received:', data);
        break;
        
      default:
        console.log('Unknown event type:', event);
    }

    // Always respond with 200 OK to acknowledge receipt
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}