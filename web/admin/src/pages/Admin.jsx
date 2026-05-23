import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

import CheckIn from "./check-in";
import AdminVuelos from "./admin-flight";
import Promo from "./admin-promo";
import Clientes from "./admin-clientes";
import AdminRutas from './admin-rutas';

const Admin = () => {
  // Estado para controlar qué sección se muestra
  const [vistaActiva, setVistaActiva] = useState('dashboard');

  const navigate = useNavigate();
  
  const cerrarSesion = () => {
    navigate('/'); 
  };

  return (
    <div className="admin-layout">

      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>AIR<strong>Tec</strong></h2>
          <small>ADMIN PANEL</small>
        </div>

        <nav className="nav-menu">
          <div 
            className={`nav-item ${vistaActiva === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('dashboard')}
          >
            <span>Dashboard</span>
          </div>
          
          <div 
            className={`nav-item ${vistaActiva === 'vuelos' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('vuelos')}
          >
            <span>Vuelos</span>
          </div>

          <div 
            className={`nav-item ${vistaActiva === 'rutas' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('rutas')}
          >
            <span>Rutas</span>
          </div>

          <div 
            className={`nav-item ${vistaActiva === 'promo' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('promo')}
          >
            <span>Promociones</span>
          </div>
          <div 
            className={`nav-item ${vistaActiva === 'clientes' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('clientes')}
          >
            <span>Clientes</span>
          </div>

          <div 
            className={`nav-item ${vistaActiva === 'checkin' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('checkin')}
          >
            <span>Check-in</span>
          </div>
        </nav>

        <div className="nav-item logout" onClick={cerrarSesion}>
          Cerrar Sesión
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        
        {/* Vista Dashboard */}
        {vistaActiva === 'dashboard' && (
          <>
            <header className="header-title">
              <h1>¡Bienvenido!</h1>
              <p>¿Qué gestión deseas realizar hoy en AIRTec?</p>
            </header>

            <div className="admin-cards">
              <div className="card" onClick={() => setVistaActiva('vuelos')}>
                <h3>Gestión de Vuelos</h3>
                <p>Crea, edita o cancela rutas y horarios de vuelo.</p>
              </div>

              <div className="card" onClick={() => setVistaActiva('rutas')}>
                <h3>Gestión de Rutas</h3>
                <p>Crea, edita y elimina rutas con sus tramos.</p>
              </div>

              <div className="card" onClick={() => setVistaActiva('promo')}>
                <h3>Promociones</h3>
                <p>Administra ofertas de vuelos.</p>
              </div>

              <div className="card" onClick={() => setVistaActiva('checkin')}>
                <h3>Check-in</h3>
                <p>Supervisa el estado de registro de los pasajeros.</p>
              </div>

              <div className="card" onClick={() => setVistaActiva('clientes')}>
                <h3>Clientes</h3>
                <p>Gestiona los clientes registrados.</p>
              </div>
              
            </div>
          </>
        )}

        {vistaActiva === 'vuelos' && <AdminVuelos />}
        {vistaActiva === 'rutas' && <AdminRutas />}
        {vistaActiva === 'promo' && <Promo />}
        {vistaActiva === 'clientes' && <Clientes />}
        {vistaActiva === 'checkin' && <CheckIn />}
        
      </main>
    </div>
  );
};

export default Admin;