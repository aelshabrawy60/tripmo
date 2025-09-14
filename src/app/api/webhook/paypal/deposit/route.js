// app/api/paypal-webhook/route.js
import crypto from "crypto";
import crc32 from "buffer-crc32";
import fs from "fs/promises";
import { confirmBookingDeposit } from '../../deposits/route';

// Next.js fetch is available globally
const {
  CACHE_DIR = ".",
  WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID, // set in .env.local
} = process.env;

async function downloadAndCache(url, cacheKey) {
  if (!cacheKey) {
    cacheKey = url.replace(/\W+/g, "-");
  }
  const filePath = `${CACHE_DIR}/${cacheKey}`;

  // Check if cached file exists
  const cachedData = await fs.readFile(filePath, "utf-8").catch(() => null);
  if (cachedData) {
    return cachedData;
  }

  // Download the file if not cached
  const response = await fetch(url);
  const data = await response.text();
  await fs.writeFile(filePath, data);

  return data;
}

async function verifySignature(rawBody, headers) {
  const transmissionId = headers.get("paypal-transmission-id");
  const timeStamp = headers.get("paypal-transmission-time");
  const certUrl = headers.get("paypal-cert-url");
  const signature = headers.get("paypal-transmission-sig");

  if (!transmissionId || !timeStamp || !certUrl || !signature) {
    console.error("Missing PayPal headers");
    return false;
  }

  // CRC32 of raw body
  const crc = parseInt("0x" + crc32(rawBody).toString("hex"));

  const message = `${transmissionId}|${timeStamp}|${WEBHOOK_ID}|${crc}`;
  console.log("Original signed message", message);

  // Download PayPal cert
  const certPem = await downloadAndCache(certUrl);

  // Create buffer from base64-encoded signature
  const signatureBuffer = Buffer.from(signature, "base64");

  // Create a verification object
  const verifier = crypto.createVerify("SHA256");
  verifier.update(message);

  return verifier.verify(certPem, signatureBuffer);
}

// Handle POST request (PayPal webhook)
export async function POST(req) {
  try {
    const rawBody = await req.text(); // Get raw body for signature verification
    const headers = req.headers;

    console.log("headers", Object.fromEntries(headers));
    console.log("raw event", rawBody);

    const data = JSON.parse(rawBody);
    console.log("parsed json", JSON.stringify(data, null, 2));

    const isValid = await verifySignature(rawBody, headers);

    if (isValid) {
      console.log("✅ Signature is valid");
      console.log("Received event", JSON.stringify(data, null, 2));
      // 👉 process event here (e.g., save to DB)
      const bookId = data.resource.custom_id;
      console.log("Booking ID from custom_id:", bookId);
      if (data.event_type === "PAYMENT.CAPTURE.COMPLETED") {
        await confirmBookingDeposit(bookId);
      }
    } else {
      console.error(
        `❌ Signature is NOT valid for ${data?.id} ${headers.get("correlation-id")}`
      );
    }

    return new Response(null, { status: 200 }); // Always 200 for PayPal
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Bad Request", { status: 400 });
  }
}
