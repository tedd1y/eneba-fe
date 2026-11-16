import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/** One cart line. Only the product id and quantity are stored; prices always come from the API. */
export type CartItem = {
  productId: number
  quantity: number
}

/** Highest quantity a single line can reach. */
export const MAX_QUANTITY = 10

type CartState = {
  items: CartItem[]
  /** Adds `quantity` of a product (stacking onto an existing line, capped at MAX_QUANTITY). */
  add: (productId: number, quantity?: number) => void
  remove: (productId: number) => void
  /** Sets a line's quantity; 0 or less removes it. */
  setQuantity: (productId: number, quantity: number) => void
  clear: () => void
  /** Drops lines whose product the API no longer returns (inactive / deleted). */
  prune: (validIds: number[]) => void

  /** "Added to cart" modal. UI only, never persisted. */
  addedOpen: boolean
  setAddedOpen: (open: boolean) => void
}

const clamp = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)))

export const useCartStore = create<CartState>()(
  persist(
    set => ({
      items: [],

      add: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(i => i.productId === productId)
          const items = existing
            ? state.items.map(i => (i.productId === productId ? { ...i, quantity: clamp(i.quantity + quantity) } : i))
            : [...state.items, { productId, quantity: clamp(quantity) }]
          return { items, addedOpen: true }
        }),

      remove: productId => set(state => ({ items: state.items.filter(i => i.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set(state => ({
          items: quantity <= 0
            ? state.items.filter(i => i.productId !== productId)
            : state.items.map(i => (i.productId === productId ? { ...i, quantity: clamp(quantity) } : i)),
        })),

      clear: () => set({ items: [] }),

      prune: (validIds) => {
        const valid = new Set(validIds)
        set(state => (state.items.every(i => valid.has(i.productId)) ? state : { items: state.items.filter(i => valid.has(i.productId)) }))
      },

      addedOpen: false,
      setAddedOpen: open => set({ addedOpen: open }),
    }),
    {
      name: 'eneba-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist the lines only; the modal flag is per-visit UI state.
      partialize: state => ({ items: state.items }),
    },
  ),
)

/** Total number of units in the cart (what the header bubble shows). */
export const selectCartCount = (state: CartState) => state.items.reduce((n, i) => n + i.quantity, 0)
