import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUserFriends, FaSearch } from 'react-icons/fa';

const Cliente = () => {
    const navigate = useNavigate();
    
    // Para guardar los campos de búsqueda
    const [busqueda, setBusqueda] = useState({
        origen: '',
        destino: '',
        fecha: '',
        pasajeros: 1
    });

    // Manejar cambios en los campos de búsqueda    
    const handleChange = (e) => {
        setBusqueda({
            ...busqueda,
            [e.target.name]: e.target.value
        });
    };

    // Buscar vuelos
    const handleBuscar = (e) => {
        e.preventDefault();
    };

    return (
        <div className="container-fluid p-0 bg-light min-vh-100">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm py-3">
                <div
                    className="navbar-brand d-flex align-items-center"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="fw-bold tracking-wide"> ✈︎ AIRTec</span>
                </div>

                    <ul className="navbar-nav d-flex flex-row flex-wrap ms-lg-3 me-auto gap-3">
                    <li className="nav-item">
                        <Link className="nav-link active fw-bold d-flex align-items-center" to="/">
                            Reserva
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link fw-bold d-flex align-items-center" to="/promos">
                            Promociones
                        </Link>
                    </li>
                </ul>

                <Link
                    className="btn btn-light text-primary fw-bold px-4 rounded-pill d-flex align-items-center shadow-sm"
                    to="/login"
                >
                    Iniciar Sesión
                </Link>
            </nav>

            <section className="container-xl my-5 px-4">
                <div className="card border-0 shadow-lg p-5 rounded-4 bg-white">
                    <h1 className="text-secondary fw-bold mb-5 text-center text-md-start display-6">
                        ¿A dónde quieres volar hoy?
                    </h1>

                    <form onSubmit={handleBuscar}>
                        
                        <div className="row g-4 mb-4">
                            {/* Origen */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">Origen</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-end-0 text-muted">
                                        <FaPlaneDeparture />
                                    </span>
                                    <input
                                        type="text"
                                        name="origen"
                                        value={busqueda.origen}
                                        onChange={handleChange}
                                        className="form-control bg-light border-start-0 ps-2"
                                        placeholder="Ciudad de salida"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Destino */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">Destino</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-end-0 text-muted">
                                        <FaPlaneArrival />
                                    </span>
                                    <input
                                        type="text"
                                        name="destino"
                                        value={busqueda.destino}
                                        onChange={handleChange}
                                        className="form-control bg-light border-start-0 ps-2"
                                        placeholder="Ciudad de llegada"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Fecha */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">Fecha de Salida</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-end-0 text-muted">
                                        <FaCalendarAlt />
                                    </span>
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={busqueda.fecha}
                                        onChange={handleChange}
                                        className="form-control bg-light border-start-0 ps-2"
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="row g-4 align-items-end">

                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">Pasajeros</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-end-0 text-muted">
                                        <FaUserFriends />
                                    </span>
                                    <input
                                        type="number"
                                        name="pasajeros"
                                        value={busqueda.pasajeros}
                                        onChange={handleChange}
                                        className="form-control bg-light border-start-0 ps-2"
                                        min="1"
                                        max="10"
                                        placeholder="1"
                                        required
                                    />
                                </div>
                            </div>

                       
                            <div className="col-md-8">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-bold shadow fs-4 d-flex align-items-center justify-content-center gap-3"
                                >
                                    <FaSearch />
                                    Buscar Vuelos Disponibles
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </section>

        </div>
    );
};

export default Cliente;