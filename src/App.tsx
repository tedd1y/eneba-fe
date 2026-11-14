import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { StyleguidePage } from "@/pages/styleguide"
import {HomePage} from "@/pages/homepage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/styleguide" element={<StyleguidePage />} />
        <Route path="/homepage" element={<HomePage />} />
        {/* Homepage not built yet — send visitors to the styleguide for now. */}
        <Route path="*" element={<Navigate to="/styleguide" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
