import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Asientos from './pages/asientos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/check-in/asientos" element={<Asientos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;