"use client";

import { useEffect } from "react";

export default function AffiliateTracker() {
  useEffect(() => {
    // Helper: set cookie
    const setCookie = (name, value, days) => {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    };

    // Get query param
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");

    if (refCode) {
      setCookie("affiliate_ref", refCode, 15); // store for 15 days
    }
  }, []);

  return null; // no UI
}
