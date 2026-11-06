import { type ClassValue, clsx } from "clsx";

/** Merge class names */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Format paise to INR display string: 79900 → "₹799" */
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/** Calculate discount percentage: (compare - price) / compare * 100 */
export function calcDiscount(price: number, compareAt: number | null): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** Generate a human-readable order number: SC-20261102-001 */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100).toString();
  return `SC-${dateStr}-${rand}`;
}

/** Slugify a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Validate Indian pincode format */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

/** Truncate text to maxLength and add ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Get estimated delivery date range from today */
export function getDeliveryDateRange(
  minDays: number,
  maxDays: number
): { from: string; to: string } {
  const from = new Date();
  from.setDate(from.getDate() + minDays);
  const to = new Date();
  to.setDate(to.getDate() + maxDays);

  const fmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  });

  return { from: fmt.format(from), to: fmt.format(to) };
}
