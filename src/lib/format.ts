/**
 * Display helpers.
 *
 * Each one has a defined answer for missing input, because "—" in a cell is
 * always better than a crash or the string "undefined".
 */

/** `0x86e3d7…dD68B`. Never throws on an absent address. */
export const shortAddress = (value?: string | null, front = 8, back = 6) => {
  if (!value) return "—";
  if (value.length <= front + back) return value;
  return `${value.slice(0, front)}…${value.slice(-back)}`;
};

/**
 * Fixed-decimal amount.
 *
 * Six places by default: enough to show a gas fee, few enough that a balance
 * column stays readable. Non-numeric input reads as "—" rather than "NaN".
 */
export const formatAmount = (value?: string | number | null, decimals = 6) => {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(decimals) : "—";
};

export const formatDateTime = (value?: string | number | null) =>
  value ? new Date(value).toLocaleString("vi-VN") : "—";
