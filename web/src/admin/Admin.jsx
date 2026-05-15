import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Importación de tus componentes de página
import CheckIn from "./pages/check-in";
import AdminVuelos from "./pages/admin-flight";
import AdminAeropuerto from "./pages/admin-aeropuerto";

const Admin = () => {
  // Estado para controlar qué sección se muestra
  const [vistaActiva, setVistaActiva] = useState('dashboard');

  const navigate = useNavigate();
  
  const cerrarSesion = () => {
    navigate('/'); 
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
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
            className={`nav-item ${vistaActiva === 'aeropuertos' ? 'active' : ''}`} 
            onClick={() => setVistaActiva('aeropuertos')}
          >
            <span>Aeropuertos</span>
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
        
        {/* Vista del Dashboard Principal */}
        {vistaActiva === 'dashboard' && (
          <>
            <header className="header-title">
              <h1>¡Bienvenida!</h1>
              <p>¿Qué gestión deseas realizar hoy en AIRTec?</p>
            </header>

            <div className="admin-cards">
              <div className="card" onClick={() => setVistaActiva('vuelos')}>
                <div className="card-icon">✈️</div>
                <h3>Gestión de Vuelos</h3>
                <p>Crea, edita o cancela rutas y horarios de vuelo.</p>
              </div>

              <div className="card" onClick={() => setVistaActiva('aeropuertos')}>
                <div className="card-icon">🏢</div>
                <h3>Aeropuertos</h3>
                <p>Administra las sedes y terminales de operación.</p>
              </div>

              <div className="card" onClick={() => setVistaActiva('checkin')}>
                <div className="card-icon">🆔</div>
                <h3>Check-in</h3>
                <p>Supervisa el estado de registro de los pasajeros.</p>
              </div>
            </div>
          </>
        )}

        {/* Renderizado condicional de componentes */}
        {vistaActiva === 'vuelos' && <AdminVuelos />}
        {vistaActiva === 'aeropuertos' && <AdminAeropuerto />}
        {vistaActiva === 'checkin' && <CheckIn />}
        
      </main>
    </div>
  );
};

export default Admin;