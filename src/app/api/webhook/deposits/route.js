// app/api/kashier/webhook/route.js

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import queryString from 'query-string';
import _ from 'lodash';
import { confirmDeposit } from '@/utils/payments/helpers';
import { updateTripScore } from '@/utils/trips_engine/trips_scoring';
import { sendMetaPurchase } from '@/lib/metaCapi';

const PAYMENT_API_KEY = process.env.KASHIER_PAYMENT_KEY;

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('x-kashier-signature');

    // Re-parse the rawBody as JSON
    const parsedBody = JSON.parse(rawBody);
    const { data, event } = parsedBody;

    if (!data || !data.signatureKeys || !Array.isArray(data.signatureKeys)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Sort the signatureKeys alphabetically
    const sortedKeys = [...data.signatureKeys].sort();

    // Pick values from the `data` object using the sorted keys
    const payloadData = _.pick(data, sortedKeys);

    // URL-encode only the values and create the signature string
    const signaturePayload = queryString.stringify(payloadData, {
      encode: true,
      sort: false,
    });

    // Generate HMAC SHA256 signature
    const calculatedSignature = crypto
      .createHmac('sha256', PAYMENT_API_KEY)
      .update(signaturePayload)
      .digest('hex');

    if (calculatedSignature !== signatureHeader) {
      console.warn('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // ✅ Signature is valid. Process the event
    console.log('✅ Valid webhook received:', event, data);

    // Example: Handle "pay" event
    if (event === 'pay' && data.status === 'SUCCESS') {
      const merchantOrderId = data.merchantOrderId;
      const transactionId = data.transactionId;
      const amount = data.amount;

      // TODO: update DB or perform business logic
      console.log(`[Payment Success] Order: ${merchantOrderId}, TX: ${transactionId}, Amount: ${amount}`);
      const bookingData = await confirmDeposit(merchantOrderId)
      
      // 🟢 Send Meta Conversions API Event (Purchase)
      await sendMetaPurchase(bookingData.bookingData.total_price, bookingData.bookingData.client_phone, bookingData.bookingData.persons, bookingData.bookingData.id , bookingData.bookingData.deposits.tracking_data)

      await updateTripScore(bookingData.bookingData.bookable_id)
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
