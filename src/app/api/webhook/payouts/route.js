import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Secret key from your dashboard
const TRANSFER_API_KEY = "31978aa5-1378-464a-b34f-6bb4653ba2ec";

const verifySignature = (payload, signature, secret) => {
  try {
    const { signatureKeys } = payload;
    const concatenated = signatureKeys.map(key => payload[key]).join('');
    const hash = crypto
      .createHmac('sha256', secret)
      .update(concatenated)
      .digest('hex');
    return hash === signature;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

export async function POST(request) {
  try {
    const signature = request.headers.get('x-kashier-signature');
    const payload = await request.json();

    if (!signature || !payload?.signatureKeys) {
      return NextResponse.json({ error: 'Missing signature or keys' }, { status: 400 });
    }

    const isValid = verifySignature(payload, signature, TRANSFER_API_KEY);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // ✅ Webhook is verified
    console.log('✅ Verified Kashier webhook:', payload);

    // Here you can handle logic for INITIATED / COMPLETED / FAILED
    // Example:
    // if (payload.status === 'COMPLETED') await updateDatabase(payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
