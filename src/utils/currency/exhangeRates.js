// utils/exchangeRates.js

const API_URL =
  "https://v6.exchangerate-api.com/v6/65f0f1a4f5360dd14682df49/latest/EGP";

let cachedRates = { EGP: 1, USD: 0.0208, GBP: 0.015 }; // fallback
let lastFetched = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day

async function fetchExchangeRates() {
  try {
    const response = await fetch(API_URL, { cache: "no-store" });
    const data = await response.json();

    if (data.result !== "success" || !data.conversion_rates) {
      throw new Error("Invalid API response");
    }

    cachedRates = {
      EGP: 1,
      USD: data.conversion_rates.USD,
      GBP: data.conversion_rates.GBP,
    };

    lastFetched = Date.now();
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
  }
}

// Call this once on app startup
export async function initExchangeRates() {
  if (Date.now() - lastFetched > CACHE_DURATION) {
    await fetchExchangeRates();
  }
}

// Now a **sync** function
export function currencyConversion(amountInEGP, targetCurrency) {
  const rate = cachedRates[targetCurrency] || 1;
  return Math.round(amountInEGP * rate);
}
