import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { StyleguidePage } from "@/pages/styleguide"
import {Home} from "@/pages/home.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/styleguide" element={<StyleguidePage />} />
        <Route path="/homepage" element={<Home />} />
        {/* Homepage not built yet — send visitors to the styleguide for now. */}
        <Route path="*" element={<Navigate to="/styleguide" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
