import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Cliente = () => {
    const navigate = useNavigate();

    // Para guardar los campos de búsqueda
    const [busqueda, setBusqueda] = useState({
        origen: '',
        destino: '',
        fecha: ''
    });
    // Promociones Prueba
    const [listPromo] = useState([
    {
      id: 1,
      origen: "San José",
      destino: "Madrid",
      fechaDisponible: "15 Mayo 2026 - 22 Junio 2026",
      precioOriginal: "$600",
      precio: "$450"
    },
    {

      id: 2,
      origen: "San José",
      destino: "México",
      fechaDisponible: "18 Mayo 2026 - 25 Junio 2026",
      precioOriginal: "$500",
      precio: "$320"
    }
  ]);

  return (
    <div className="busqueda-container">
         {/*Barra de Navegación*/}
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => navigate('/')}>

                    <span className="logo-icon">✈️</span>
                    <span className="logo-text">AIR<strong>Tec</strong></span>
                </div>
                {/*Para cambiar de página*/}
                <ul className="navbar-links">
                    <li><Link to="/cliente">Reservar</Link></li>
                    <li><Link to="/check-in">Check-in</Link></li>
                </ul>
            </nav>
            {/* Cuadro de Busqueda */}
            <section className="busqueda-section">
                <div className="busqueda-container">
                    <h1>¿A dónde quieres volar?</h1>
                    <div className="form-busqueda">
                        <div className="input-group">
                            <label>Origen</label>
                            <input 
                                type="text" 
                                name="origen" 
                                placeholder="Ciudad de salida" 
                            />
                        </div>
                        <div className="input-group">
                            <label>Destino</label>
                            <input 
                                type="text" 
                                name="destino" 
                                placeholder="Ciudad de llegada" 
                            />
                        </div>
                        <div className="input-group">
                            <label>Fecha</label>
                            <input 
                                type="date" 
                                name="fecha" 
                            />
                        </div>
                        <button className="btn-buscar">Buscar Vuelos</button>
                    </div>
                </div>
            </section>
            {/*Sección de Promociones*/}
            <div className="vuelos-container">
                <header className="contenido">
                    <h2>Promociones</h2>
                </header>
                
                {/*Proyeccion de vuelos*/}
                <main className="main-content">
                    {listPromo.map((vuelo) => (
                        <div className="vuelo-card" key={vuelo.id}
                        onClick={() => navigate(`/reservar/${vuelo.id}`)}> {/*Redirigir a la página de reserva */}
                            <div className="vuelo-info">
                                <div className="card-header">
                                    <div className="precio-container">
                                        <p className="precio-original">{vuelo.precioOriginal}</p>
                                        <span className="precio-tag">{vuelo.precio}</span>
                                    </div>
                                </div>
                                <h3>{vuelo.origen} a {vuelo.destino}</h3>
                                <div className="detalles-vuelo">
                                    <p> {vuelo.fechaDisponible}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
};

export default Cliente;
