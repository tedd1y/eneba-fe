import { NuqsAdapter } from 'nuqs/adapters/react-router/v8'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router'

import { AddedToCartModal } from '@/components/cart/added-to-cart-modal'
import { Header } from '@/components/layout/header'
import { CART_LIMIT_MESSAGE, MAX_CART_ITEMS, MAX_QUANTITY, selectCartCount, useCartStore } from '@/stores/cart'

import { StyleguidePage } from '@/pages/styleguide'
import { Home } from '@/pages/home.tsx'
import { Store } from '@/pages/store.tsx'
import { Product } from '@/pages/product.tsx'
import { Cart } from '@/pages/cart.tsx'
import { Payment } from '@/pages/payment.tsx'
import { OrderAccepted } from '@/pages/order-accepted.tsx'
import { Login } from '@/pages/login.tsx'

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

/** `/store` → `/store/all`, keeping any query string (filters in a shared link survive). */
function StoreRedirect() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: '/store/all', search }} replace />
}

/** Shared shell for storefront pages: the header stays pinned to the top while the page scrolls. */
function SiteLayout() {
  // Start each new page at the top. Keyed on the path only, so store filter / sort changes keep their place.
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

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
      {/* nuqs keeps store filters in the URL; must sit inside the router. */}
      <NuqsAdapter>
        <CartAddedModalHost />
        <Routes>
          <Route path="/styleguide" element={<StyleguidePage />} />
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<StoreRedirect />} />
            {/* "all" = no category filter; other categories are accepted but not filtered yet (no API). */}
            <Route path="/store/:category" element={<Store />} />
            <Route path="/:slug" element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/accept/:uuid" element={<OrderAccepted />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </NuqsAdapter>
    </BrowserRouter>
  )
}

export default App
