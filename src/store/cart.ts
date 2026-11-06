import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { siteConfig } from "@/config/site";

export interface CartItem {
  id: string; // unique key: `${productId}-${variantId}-${giftAudience || "default"}`
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  variantName: string;
  price: number; // in paise
  compareAt?: number; // in paise
  image: string;
  quantity: number;
  stock: number;
  giftAudience?: "Her" | "Him" | "Anyone";
}

export interface AppliedCoupon {
  code: string;
  type: "PERCENTAGE" | "FLAT";
  value: number; // percentage (e.g. 20) or flat amount in paise
  discountAmount: number; // calculated in paise
  minOrder?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  coupon: AppliedCoupon | null;
  giftWrap: boolean;
  giftMessage: string;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  setGiftWrap: (giftWrap: boolean) => void;
  setGiftMessage: (message: string) => void;

  // Getters
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getTotalItemsCount: () => number;
  getFreeShippingRemaining: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,
      giftWrap: false,
      giftMessage: "",

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (newItem) => {
        set((state) => {
          const id = `${newItem.productId}-${newItem.variantId}-${newItem.giftAudience || "default"}`;
          const existingIndex = state.items.findIndex((item) => item.id === id);

          if (existingIndex > -1) {
            const updated = [...state.items];
            const currentItem = updated[existingIndex];
            const newQty = Math.min(currentItem.quantity + newItem.quantity, currentItem.stock);
            updated[existingIndex] = { ...currentItem, quantity: newQty };
            return { items: updated, isOpen: true };
          }

          return {
            items: [...state.items, { ...newItem, id }],
            isOpen: true,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => set({ items: [], coupon: null, giftWrap: false, giftMessage: "" }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      setGiftWrap: (giftWrap) => set({ giftWrap }),
      setGiftMessage: (giftMessage) => set({ giftMessage }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon || subtotal === 0) return 0;

        if (coupon.minOrder && subtotal < coupon.minOrder) {
          return 0;
        }

        if (coupon.type === "PERCENTAGE") {
          const calculated = Math.round((subtotal * coupon.value) / 100);
          return coupon.discountAmount
            ? Math.min(calculated, coupon.discountAmount)
            : calculated;
        } else {
          return Math.min(coupon.value, subtotal);
        }
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= siteConfig.shipping.freeShippingThreshold) {
          return 0;
        }
        return siteConfig.shipping.standardShippingFee;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const shipping = get().getShippingFee();
        const wrapFee = get().giftWrap ? 9900 : 0; // ₹99 for premium gift wrap
        return Math.max(0, subtotal - discount + shipping + wrapFee);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getFreeShippingRemaining: () => {
        const subtotal = get().getSubtotal();
        const threshold = siteConfig.shipping.freeShippingThreshold;
        return Math.max(0, threshold - subtotal);
      },
    }),
    {
      name: "lumiere-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
        giftWrap: state.giftWrap,
        giftMessage: state.giftMessage,
      }),
    }
  )
);
