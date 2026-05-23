import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlane, FaClock, FaDoorOpen, FaChair, FaArrowLeft } from 'react-icons/fa';
import Navbar from './Navbar';
import '../App.css';

const VistaVuelos = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resultados, busqueda } = location.state || { resultados: [], busqueda: {} };

    const formatHora = (timeSpan) => {
        if (!timeSpan) return '--:--';
        return timeSpan.substring(0, 5);
    };

    const handleSeleccionar = (resultado) => {
        navigate('/reservar', {
            state: { resultado, busqueda }
        });
    };

    return (
        <div className="container-fluid p-0 bg-light min-vh-100">

            <Navbar paginaActiva="reserva" />

            <div className="container mt-5 mb-5">

                <div className="d-flex align-items-center gap-3 mb-4">
                    <button
                        className="btn btn-outline-primary rounded-pill"
                        onClick={() => navigate('/')}
                    >
                        <FaArrowLeft className="me-2" />Volver
                    </button>
                    <div>
                        <h2 className="fw-bold mb-0">Vuelos disponibles</h2>
                        <small className="text-muted">
                            {resultados.length} resultado(s) · {busqueda.pasajeros} pasajero(s) · {busqueda.fecha}
                        </small>
                    </div>
                </div>

                <div className="d-flex flex-column gap-4">
                    {resultados.map((resultado, index) => (
                        <div key={index} className="card border-0 shadow-sm rounded-4 overflow-hidden">

                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3 px-4">
                                <div className="d-flex align-items-center gap-2">
                                    <FaPlane />
                                    <span className="fw-bold fs-5">
                                        {resultado.ruta.ciudadOrigen} → {resultado.ruta.ciudadDestino}
                                    </span>
                                    <span className="badge bg-white text-primary ms-2">
                                        {resultado.vuelos.length === 1 ? 'Directo' : `${resultado.vuelos.length} tramos`}
                                    </span>
                                </div>
                                <span className="fw-bold fs-4">${resultado.ruta.precio}</span>
                            </div>

                            <div className="card-body px-4 py-3">
                                {resultado.vuelos.map((vuelo, i) => (
                                    <div key={i} className={`d-flex align-items-center gap-4 py-3 ${i < resultado.vuelos.length - 1 ? 'border-bottom' : ''}`}>

                                        <div className="text-center" style={{ minWidth: '120px' }}>
                                            <div className="fw-bold fs-5 text-primary">{formatHora(vuelo.salida)}</div>
                                            <div className="fw-semibold">{vuelo.ciudadOrigen}</div>
                                        </div>

                                        <div className="flex-grow-1 text-center text-muted">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="flex-grow-1 border-top border-2"></div>
                                                <FaPlane className="text-primary" />
                                                <div className="flex-grow-1 border-top border-2"></div>
                                            </div>
                                            {resultado.vuelos.length > 1 && (
                                                <small className="text-muted">Tramo {i + 1}</small>
                                            )}
                                        </div>

                                        <div className="text-center" style={{ minWidth: '120px' }}>
                                            <div className="fw-bold fs-5 text-primary">{formatHora(vuelo.llegada)}</div>
                                            <div className="fw-semibold">{vuelo.ciudadDestino}</div>
                                        </div>

                                        <div className="d-none d-md-flex flex-column gap-1 text-muted small" style={{ minWidth: '140px' }}>
                                            <span><FaDoorOpen className="me-1 text-primary" />Puerta: {vuelo.puertaEmbarque}</span>
                                            <span><FaChair className="me-1 text-primary" />{vuelo.asientosLibres} asientos libres</span>
                                            <span><FaClock className="me-1 text-primary" />{vuelo.fecha}</span>
                                        </div>

                                    </div>
                                ))}

                                <div className="d-flex justify-content-end mt-3">
                                    <button
                                        className="btn btn-primary px-5 py-2 fw-bold rounded-3"
                                        onClick={() => handleSeleccionar(resultado)}
                                    >
                                        Seleccionar vuelo
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VistaVuelos;