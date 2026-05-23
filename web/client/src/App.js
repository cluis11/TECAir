import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './pages/AuthContext';
import Cliente from './pages/Cliente';
import Promo from './pages/promo';
import Vuelos from './pages/vista-vuelos';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cliente />} />
          <Route path="/promos" element={<Promo />} />
          <Route path="/vuelos" element={<Vuelos />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;