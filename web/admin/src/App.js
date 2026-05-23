import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Asientos from './pages/asientos';
import Maletas from './pages/maletas';
import Resumen from './pages/resumencobro';
import PaseBordaje from './pages/pasebordaje';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/check-in/asientos" element={<Asientos />} />
        <Route path="/check-in/maleta" element={<Maletas />} />
        <Route path="/check-in/resumen" element={<Resumen />} />
        <Route path="/check-in/pase" element={<PaseBordaje />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;