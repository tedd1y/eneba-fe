import { BrowserRouter, Outlet, Route, Routes } from 'react-router'

import { AddedToCartModal } from '@/components/cart/added-to-cart-modal'
import { Header } from '@/components/layout/header'
import { CART_LIMIT_MESSAGE, MAX_CART_ITEMS, MAX_QUANTITY, selectCartCount, useCartStore } from '@/stores/cart'

import { StyleguidePage } from '@/pages/styleguide'
import { Home } from '@/pages/home.tsx'
import { Store } from '@/pages/store.tsx'
import { Product } from '@/pages/product.tsx'
import { Cart } from '@/pages/cart.tsx'

/** Why an add was refused: the whole cart is full, or that one product is at its per-line limit. */
const limitMessage = (count: number) =>
  count >= MAX_CART_ITEMS ? CART_LIMIT_MESSAGE : `You can add up to ${MAX_QUANTITY} of the same product.`

/** "Added to cart" modal, opened by the cart store's add(). One instance for the whole app. */
function CartAddedModalHost() {
  const open = useCartStore(s => s.addedOpen)
  const failed = useCartStore(s => s.addFailed)
  const setOpen = useCartStore(s => s.setAddedOpen)
  const count = useCartStore(selectCartCount)
  return <AddedToCartModal open={open} onOpenChange={setOpen} count={count} failed={failed} failedMessage={limitMessage(count)} />
}

/** Shared shell for storefront pages: the header stays pinned to the top while the page scrolls. */
function SiteLayout() {
  return (
    <>
      <Header className="sticky top-0 z-40" />
      <Outlet />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartAddedModalHost />
      <Routes>
        <Route path="/styleguide" element={<StyleguidePage />} />
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/:slug" element={<Product />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
