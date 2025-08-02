'use client';

import { useEffect } from 'react';

export default function MetaPixelTripEvent({ trip }) {
  useEffect(() => {
    if (!window.fbq) return;

    window.fbq('track', 'ViewContent', {
      content_type: 'destination',
      content_ids: [trip.id],
      city: trip.dest_city?.name,
      region: trip.dest_city?.name,
      country: trip.dest_city?.country || 'Egypt',
    });
  }, [trip]);

  return null; // No UI needed
}
