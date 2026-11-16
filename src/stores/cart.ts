import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/** One cart line. Only the product id and quantity are stored; prices always come from the API. */
export type CartItem = {
  productId: number
  quantity: number
}

/** Most items (units, across all lines) the cart can hold. Also keeps pricing to one API request. */
export const MAX_CART_ITEMS = 40
/** Highest quantity a single line can reach. */
export const MAX_QUANTITY = 10

export const CART_LIMIT_MESSAGE = `Your cart is full. You can have up to ${MAX_CART_ITEMS} items.`

type CartState = {
  items: CartItem[]
  /**
   * Adds one product. Returns false (and adds nothing) if the line or the cart is already full.
   * Opens the "Added to cart" modal unless `notify: false` (e.g. "Buy now", which goes straight to the cart).
   */
  add: (productId: number, options?: { notify?: boolean }) => boolean
  remove: (productId: number) => void
  /** Sets a line's quantity, capped by the line and cart limits; 0 or less removes it. */
  setQuantity: (productId: number, quantity: number) => void
  clear: () => void
  /** Removes lines the API no longer returns (inactive / deleted). */
  prune: (missingIds: number[]) => void

  /** Delivery email from the cart page, sent with the order. Persisted only when `rememberEmail`. */
  email: string
  rememberEmail: boolean
  setEmail: (email: string, remember: boolean) => void

  /** "Added to cart" modal. UI only, never persisted. */
  addedOpen: boolean
  /** True when the last add was refused because a limit was hit. */
  addFailed: boolean
  setAddedOpen: (open: boolean) => void
}

const countOf = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0)

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (productId, { notify = true } = {}) => {
        const { items } = get()
        const existing = items.find(i => i.productId === productId)
        if (countOf(items) >= MAX_CART_ITEMS || (existing && existing.quantity >= MAX_QUANTITY)) {
          if (notify) set({ addedOpen: true, addFailed: true })
          return false
        }
        set({
          items: existing
            ? items.map(i => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i))
            : [...items, { productId, quantity: 1 }],
          ...(notify && { addedOpen: true, addFailed: false }),
        })
        return true
      },

      remove: productId => set(state => ({ items: state.items.filter(i => i.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) return { items: state.items.filter(i => i.productId !== productId) }
          const others = countOf(state.items.filter(i => i.productId !== productId))
          const capped = Math.min(Math.floor(quantity), MAX_QUANTITY, MAX_CART_ITEMS - others)
          return { items: state.items.map(i => (i.productId === productId ? { ...i, quantity: Math.max(1, capped) } : i)) }
        }),

      clear: () => set({ items: [] }),

      prune: (missingIds) => {
        const missing = new Set(missingIds)
        set(state => ({ items: state.items.filter(i => !missing.has(i.productId)) }))
      },

      email: '',
      rememberEmail: false,
      setEmail: (email, remember) => set({ email, rememberEmail: remember }),

      addedOpen: false,
      addFailed: false,
      setAddedOpen: open => set({ addedOpen: open }),
    }),
    {
      name: 'eneba-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist the lines (and the email only if "Remember me" was ticked); modal flags are per-visit UI state.
      partialize: state => ({
        items: state.items,
        ...(state.rememberEmail && { email: state.email, rememberEmail: true }),
      }),
    },
  ),
)

/** Total number of items in the cart (what the header bubble shows). */
export const selectCartCount = (state: CartState) => countOf(state.items)

/** Highest quantity a line can be set to right now (line limit, and what's left of the cart limit). */
export function maxQuantityFor(items: CartItem[], productId: number) {
  const line = items.find(i => i.productId === productId)
  const others = countOf(items) - (line?.quantity ?? 0)
  return Math.min(MAX_QUANTITY, MAX_CART_ITEMS - others)
}
