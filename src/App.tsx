import { BrowserRouter, Outlet, Route, Routes } from 'react-router'

import { Header } from '@/components/layout/header'

import { StyleguidePage } from '@/pages/styleguide'
import { Home } from '@/pages/home.tsx'
import {Store} from "@/pages/store.tsx";
import {Product} from "@/pages/product.tsx";
import {Cart} from "@/pages/cart.tsx";

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
