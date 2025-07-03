import crypto from 'crypto';

function hash(value) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function sendMetaEvent({ req, eventName, userData = {}, customData = {}, eventId}) {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  let fbp = userData.fbp || '';
  let fbc = userData.fbc || '';
  let ip = userData.client_ip_address || '';
  let ua = userData.client_user_agent || '';
  let referer = userData.referer || '';

  if (req) {
    const headers = req.headers;
    const cookie = headers.get('cookie') || '';
    const getCookie = (name) =>
      cookie.split(';').find((c) => c.trim().startsWith(`${name}=`))?.split('=')[1] || '';

    fbp = getCookie('_fbp');
    fbc = getCookie('_fbc');
    ip = headers.get('x-forwarded-for') || '';
    ua = headers.get('user-agent') || '';
    referer = headers.get('referer') || '';
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: referer,
        event_id: eventId || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user_data: {
          em: userData.em || [],
          ph: userData.ph || [],
          fbp,
          fbc,
          client_ip_address: ip,
          client_user_agent: ua
        },
        custom_data: customData
      }
    ],
    test_event_code: testEventCode || undefined
  };

  const res = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return res.json();
}

export function hashEmail(email) {
  return hash(email);
}

export function hashPhone(rawPhone) {
  return hash(rawPhone);
}


export async function sendMetaIntiateCheckout(request, result, phone, numberOfSeats){
    try {
        await sendMetaEvent({
            req: request,
            eventName: 'InitiateCheckout',
            eventId: `checkout-${result.data.id}`, // Use booking or payment ID
            userData: {
                ph: phone ? [hashPhone(phone)] : [],
            },
            customData: {
                value: result.data.total_price,
                currency: 'EGP', // or use EGP if your ads are set up for it
                num_items: numberOfSeats
            }
        });
    } catch (error) {
        console.error('Meta CAPI error:', error);
    }
}


export async function sendMetaPurchase(price, phone, numberOfSeats, trackingData){
    try {
        await sendMetaEvent({
            eventName: 'Purchase',
            eventId: `checkout-${result.data.id}`, // Use booking or payment ID
            userData: {
                ph: phone ? [hashPhone(phone)] : [],
                ...trackingData
            },
            customData: {
                value: price,
                currency: 'EGP', // or use EGP if your ads are set up for it
                num_items: numberOfSeats
            }
        });
    } catch (error) {
        console.error('Meta CAPI error:', error);
    }
}