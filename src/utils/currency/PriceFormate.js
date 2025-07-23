import { exchangeRates } from "./exhangeRates";

export default function formatPrice(amount, currency = "EGP") {
  // Validate currency, fallback to EGP
  if (currency !== "EGP" && currency !== "USD") {
    currency = "EGP";
  }

  // Convert amount using exchange rate and round it
  const priceInCurrency = Math.round(amount * (exchangeRates[currency] || 1));

  // Format the currency string
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-EG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInCurrency);
}
