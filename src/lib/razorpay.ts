import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.RAZORPAY_KEY_ID || "";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "";

export const razorpayInstance =
  key_id && key_secret
    ? new Razorpay({
        key_id,
        key_secret,
      })
    : null;

export interface CreateRazorpayOrderParams {
  amount: number; // in paise (minimum 100 paise = 1 INR)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt,
  notes,
}: CreateRazorpayOrderParams) {
  if (!key_id || !key_secret) {
    const error: any = new Error("Razorpay credentials not found");
    error.statusCode = 401;
    throw error;
  }

  const instance = new Razorpay({
    key_id,
    key_secret,
  });

  const order = await instance.orders.create({
    amount,
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
    notes,
  });

  return order;
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  if (!key_secret) {
    return false;
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf-8"),
      Buffer.from(razorpaySignature, "utf-8")
    );
  } catch {
    return false;
  }
}
