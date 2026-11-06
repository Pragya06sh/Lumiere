import { z } from "zod";

/** Address form validation */
export const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  line1: z.string().min(5, "Address line 1 is required").max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
});

/** Checkout form validation */
export const checkoutSchema = z.object({
  address: addressSchema,
  paymentMethod: z.enum(["RAZORPAY", "COD", "UPI_DIRECT"]),
  giftMessage: z.string().max(500).optional(),
  giftWrap: z.boolean().optional(),
  couponCode: z.string().max(20).optional(),
});

/** Cart item validation */
export const cartItemSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10),
});

/** Coupon validation */
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20)
    .transform((v) => v.toUpperCase().trim()),
});

/** Newsletter signup */
export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

/** Contact form */
export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

/** Review form */
export const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100).optional(),
  comment: z.string().min(10).max(1000).optional(),
});

/** Pincode check */
export const pincodeSchema = z.object({
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
});

/** Admin product form */
export const productSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  tagline: z.string().max(200).optional(),
  description: z.string().min(20),
  scentNotes: z.object({
    top: z.array(z.string()),
    middle: z.array(z.string()),
    base: z.array(z.string()),
  }),
  burnTime: z.string().optional(),
  waxType: z.string().optional(),
  wickType: z.string().optional(),
  weight: z.string().optional(),
  howToUse: z.string().optional(),
  safetyTips: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  isBestseller: z.boolean(),
});

/** Admin coupon form */
export const adminCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .transform((v) => v.toUpperCase().trim()),
  type: z.enum(["PERCENTAGE", "FLAT"]),
  value: z.number().positive(),
  minOrder: z.number().int().nonnegative().optional(),
  maxDiscount: z.number().int().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

/** Order status update */
export const orderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum([
    "PLACED",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ]),
  trackingNumber: z.string().max(100).optional(),
  note: z.string().max(500).optional(),
});

/** Corporate gifting enquiry */
export const corporateGiftingSchema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  quantity: z.number().int().min(10),
  budget: z.string().optional(),
  message: z.string().min(10).max(2000),
});
