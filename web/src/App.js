import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom"

import Admin from "./admin/Admin"
import Cliente from "./client/Cliente"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/cliente" element={<Cliente />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App