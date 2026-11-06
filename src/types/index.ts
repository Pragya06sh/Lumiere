export interface ScentNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface VariantType {
  id: string;
  name: string;
  sku: string;
  price: number; // paise
  compareAt?: number | null; // paise
  stock: number;
  isDefault: boolean;
}

export interface ProductImageType {
  id: string;
  url: string;
  alt?: string | null;
  position: number;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description: string;
  scentNotes: ScentNotes;
  burnTime?: string | null;
  waxType?: string | null;
  wickType?: string | null;
  weight?: string | null;
  howToUse?: string | null;
  safetyTips?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  variants: VariantType[];
  images: ProductImageType[];
  categories?: { category: { id: string; name: string; slug: string } }[];
  collections?: { collection: { id: string; name: string; slug: string } }[];
  reviews?: ReviewType[];
  averageRating?: number;
  reviewsCount?: number;
}

export interface ReviewType {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  isVerified: boolean;
  createdAt: string | Date;
  user?: {
    name?: string | null;
  };
}

export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentMethod = "RAZORPAY" | "COD" | "UPI_DIRECT";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItemType {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  shippingAddress: ShippingAddress;
  items: OrderItemType[];
  subtotal: number;
  shippingFee: number;
  codFee: number;
  discount: number;
  gstAmount: number;
  total: number;
  couponCode?: string | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingNumber?: string | null;
  giftMessage?: string | null;
  giftWrap: boolean;
  createdAt: string | Date;
}
