import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  itemIds: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      addItem: (productId) => {
        if (!get().itemIds.includes(productId)) {
          set((state) => ({ itemIds: [...state.itemIds, productId] }));
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          itemIds: state.itemIds.filter((id) => id !== productId),
        }));
      },
      toggleItem: (productId) => {
        if (get().isInWishlist(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },
      isInWishlist: (productId) => get().itemIds.includes(productId),
      clearWishlist: () => set({ itemIds: [] }),
    }),
    {
      name: "lumiere-wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
