// src/utils/money.js
export function formatMoney(cents) {
  if (cents == null) return "";
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
