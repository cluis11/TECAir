import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './pages/AuthContext';
import Cliente from './pages/Cliente';
import Promo from './pages/promo';
import Vuelos from './pages/vista-vuelos';
import Detalle from './pages/itenario-detalle';
import Pago from './pages/itenario-pago';
import Registrar from './pages/registro-cliente';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cliente />} />
          <Route path="/promos" element={<Promo />} />
          <Route path="/vuelos" element={<Vuelos />} />
          <Route path="/registro" element={<Registrar />} />
          <Route path="/reservar" element={<Detalle />} />
          <Route path="/pagar" element={<Pago />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;