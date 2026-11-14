import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { StyleguidePage } from '@/pages/styleguide'
import { Home } from '@/pages/home.tsx'
import {Store} from "@/pages/store.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/styleguide" element={<StyleguidePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="*" element={<Navigate to="/styleguide" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
