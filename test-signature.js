// test-signature.js
const crypto = require('crypto');

const PAYMENT_API_KEY = "31978aa5-1378-464a-b34f-6bb4653ba2ec";

// Your actual data from the webhook
const testData = {
  amount: 3200,
  channel: 'online | e-commerce',
  creationDate: '2025-06-18T15:19:10.732Z',
  currency: 'EGP',
  kashierOrderId: 'd1753037-e96e-4efb-bb0b-80d05f6f2d59',
  merchantOrderId: '204',
  method: 'card',
  orderReference: 'TEST-ORD-193396456',
  status: 'SUCCESS',
  transactionId: 'TX-34194211255',
  transactionResponseCode: '00'
};

const signatureKeys = [
  'amount', 'channel', 'creationDate', 'currency', 'kashierOrderId', 
  'merchantOrderId', 'method', 'orderReference', 'status', 
  'transactionId', 'transactionResponseCode'
];

const expectedSignature = '7997196dac35aa783b3e3c3429f976482d8e89dd333ba6fbc8614eb0566f6632';

console.log('=== Testing Different Signature Generation Methods ===\n');

// Method 1: Current approach (URL encoding values)
const sortedKeys = [...signatureKeys].sort();
const payload1 = sortedKeys
  .map(key => `${key}=${encodeURIComponent(String(testData[key]))}`)
  .join('&');
const signature1 = crypto.createHmac('sha256', PAYMENT_API_KEY).update(payload1).digest('hex');

console.log('Method 1 (URL encode values):');
console.log('Payload:', payload1);
console.log('Signature:', signature1);
console.log('Match:', signature1 === expectedSignature ? '✅ YES' : '❌ NO', '\n');

// Method 2: No URL encoding
const payload2 = sortedKeys
  .map(key => `${key}=${testData[key]}`)
  .join('&');
const signature2 = crypto.createHmac('sha256', PAYMENT_API_KEY).update(payload2).digest('hex');

console.log('Method 2 (No URL encoding):');
console.log('Payload:', payload2);
console.log('Signature:', signature2);
console.log('Match:', signature2 === expectedSignature ? '✅ YES' : '❌ NO', '\n');

// Method 3: Using only API key part before $
const apiKeyPart = PAYMENT_API_KEY.split('$')[0];
const signature3 = crypto.createHmac('sha256', apiKeyPart).update(payload1).digest('hex');

console.log('Method 3 (First part of API key):');
console.log('API Key part:', apiKeyPart);
console.log('Signature:', signature3);
console.log('Match:', signature3 === expectedSignature ? '✅ YES' : '❌ NO', '\n');

// Method 4: Using only API key part after $
const apiKeyPart2 = PAYMENT_API_KEY.split('$')[1];
const signature4 = crypto.createHmac('sha256', apiKeyPart2).update(payload1).digest('hex');

console.log('Method 4 (Second part of API key):');
console.log('API Key part:', apiKeyPart2.substring(0, 20) + '...');
console.log('Signature:', signature4);
console.log('Match:', signature4 === expectedSignature ? '✅ YES' : '❌ NO', '\n');

// Method 5: Try with second part of API key and no encoding
const signature5 = crypto.createHmac('sha256', apiKeyPart2).update(payload2).digest('hex');

console.log('Method 5 (Second part of API key, no encoding):');
console.log('Signature:', signature5);
console.log('Match:', signature5 === expectedSignature ? '✅ YES' : '❌ NO', '\n');

// Method 6: Different encoding approach
const payload6 = sortedKeys
  .map(key => {
    const value = String(testData[key]);
    // Try encoding spaces and special chars differently
    const encodedValue = value.replace(/ /g, '%20').replace(/\|/g, '%7C');
    return `${key}=${encodedValue}`;
  })
  .join('&');
const signature6 = crypto.createHmac('sha256', PAYMENT_API_KEY).update(payload6).digest('hex');

console.log('Method 6 (Manual encoding):');
console.log('Payload:', payload6);
console.log('Signature:', signature6);
console.log('Match:', signature6 === expectedSignature ? '✅ YES' : '❌ NO', '\n');

console.log('Expected signature:', expectedSignature);
console.log('\n=== Summary ===');
console.log('If any method shows ✅ YES, that\'s the correct approach to use in your webhook!');