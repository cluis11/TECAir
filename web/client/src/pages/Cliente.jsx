import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaUserFriends, FaSearch } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL;

const Cliente = () => {
    const navigate = useNavigate();

    const [busqueda, setBusqueda] = useState({
        idOrigen: '',
        idDestino: '',
        fecha: '',
        pasajeros: 1
    });

    const [aeropuertos, setAeropuertos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [sinResultados, setSinResultados] = useState(false);

    useEffect(() => {
        const fetchAeropuertos = async () => {
            try {
                const res = await fetch(`${API_BASE}/aeropuerto`);
                const data = await res.json();
                setAeropuertos(data);
            } catch (error) {
                console.error('Error al cargar aeropuertos:', error);
            }
        };
        fetchAeropuertos();
    }, []);

    const handleChange = (e) => {
        setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
        setSinResultados(false);
    };

    const handleBuscar = async (e) => {
        e.preventDefault();

        if (busqueda.idOrigen === busqueda.idDestino) {
            alert('El origen y el destino no pueden ser iguales.');
            return;
        }

        setCargando(true);
        setSinResultados(false);

        try {
            const res = await fetch(
                `${API_BASE}/itinerario/buscar?idOrigen=${busqueda.idOrigen}&idDestino=${busqueda.idDestino}&fecha=${busqueda.fecha}&pasajeros=${busqueda.pasajeros}`
            );
            const data = await res.json();

            if (!data || data.length === 0) {
                setSinResultados(true);
            } else {
                navigate('/vuelos', {
                    state: {
                        resultados: data,
                        busqueda: {
                            idOrigen: parseInt(busqueda.idOrigen),
                            idDestino: parseInt(busqueda.idDestino),
                            fecha: busqueda.fecha,
                            pasajeros: parseInt(busqueda.pasajeros)
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error al buscar vuelos:', error);
            alert('No se pudo conectar con el servidor. Intente de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container-fluid p-0 bg-light min-vh-100">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm py-3 mb-5">
                <div
                    className="navbar-brand d-flex align-items-center"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="fw-bold">✈︎ AIRTec</span>
                </div>

                <ul className="navbar-nav d-flex flex-row flex-wrap ms-lg-3 me-auto gap-3">
                    <li className="nav-item">
                        <Link className="nav-link active fw-bold" to="/">
                            Reserva
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link fw-bold text-white-50" to="/promos">
                            Promociones
                        </Link>
                    </li>
                </ul>

                <Link
                    className="btn btn-light text-primary fw-bold px-4 rounded-pill shadow-sm"
                    to="/login"
                >
                    Iniciar Sesión
                </Link>
            </nav>

            <section className="container-xl px-4 mb-5">
                <div className="card border-0 shadow-lg p-5 rounded-4 bg-white">
                    <h1 className="text-secondary fw-bold mb-5 text-center text-md-start display-6">
                        ¿A dónde quieres volar hoy?
                    </h1>

                    <form onSubmit={handleBuscar}>

                        <div className="row g-4 mb-4">

                            {/* Origen */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">
                                    <FaPlaneDeparture className="me-2" />Origen
                                </label>
                                <select
                                    name="idOrigen"
                                    value={busqueda.idOrigen}
                                    onChange={handleChange}
                                    className="form-select form-select-lg bg-light"
                                    required
                                >
                                    <option value="">-- Ciudad de salida --</option>
                                    {aeropuertos.map(a => (
                                        <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                                            {a.ciudad} ({a.codigo})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Destino */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">
                                    <FaPlaneArrival className="me-2" />Destino
                                </label>
                                <select
                                    name="idDestino"
                                    value={busqueda.idDestino}
                                    onChange={handleChange}
                                    className="form-select form-select-lg bg-light"
                                    required
                                >
                                    <option value="">-- Ciudad de llegada --</option>
                                    {aeropuertos
                                        .filter(a => a.id_aeropuerto !== parseInt(busqueda.idOrigen))
                                        .map(a => (
                                            <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                                                {a.ciudad} ({a.codigo})
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Fecha */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">
                                    <FaCalendarAlt className="me-2" />Fecha de Salida
                                </label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={busqueda.fecha}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light"
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row g-4 align-items-end">

                            {/* Pasajeros */}
                            <div className="col-md-4">
                                <label className="form-label fw-semibold text-muted fs-5">
                                    <FaUserFriends className="me-2" />Pasajeros
                                </label>
                                <input
                                    type="number"
                                    name="pasajeros"
                                    value={busqueda.pasajeros}
                                    onChange={handleChange}
                                    className="form-control form-control-lg bg-light"
                                    min="1"
                                    max="10"
                                    required
                                />
                            </div>

                            {/* Botón */}
                            <div className="col-md-8">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 py-3 rounded-3 fw-bold shadow fs-4 d-flex align-items-center justify-content-center gap-3"
                                    disabled={cargando}
                                >
                                    <FaSearch />
                                    {cargando ? 'Buscando...' : 'Buscar Vuelos Disponibles'}
                                </button>
                            </div>
                        </div>

                    </form>

                    {/* Sin resultados */}
                    {sinResultados && (
                        <div className="alert alert-warning d-flex align-items-center gap-3 mt-4 rounded-3" role="alert">
                            <FaSearch size={20} />
                            <div>
                                <strong>No encontramos vuelos disponibles</strong> para esa ruta y fecha.
                                Intente con otra fecha u otro destino.
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </div>
    );
};

export default Cliente;