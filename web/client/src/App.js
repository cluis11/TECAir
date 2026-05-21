import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Cliente from './pages/Cliente';
import Promo from './pages/promo';
import Vuelos from './pages/vista-vuelos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cliente />} />
        <Route path="/promos" element={<Promo />} />
        <Route path="/vuelos" element={<Vuelos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;