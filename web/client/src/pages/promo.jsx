import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import Navbar from './Navbar';
import '../App.css';

const API_BASE = process.env.REACT_APP_API_URL;
const IMAGEN_FIJA = '../imagen/costarica.png';

const Promo = () => {
    const navigate = useNavigate();
    const [promociones, setPromociones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchPromociones = async () => {
            try {
                const res = await fetch(`${API_BASE}/promocion/activas`);
                const data = await res.json();
                setPromociones(data);
            } catch (error) {
                console.error('Error al cargar promociones:', error);
            } finally {
                setCargando(false);
            }
        };
        fetchPromociones();
    }, []);

    const formatFecha = (fechaStr) => {
        if (!fechaStr) return '';
        return fechaStr.split('T')[0];
    };

    return (
        <div className="container-fluid p-0 bg-light min-vh-100">

            <Navbar paginaActiva="promos" />

            <section className="container mt-5 mb-5">
                <div className="text-center mb-5">
                    <h1 className="fw-extrabold text-dark display-5 mb-2">
                        Promociones
                    </h1>
                    <p className="text-muted fs-5 built-subtitle">
                        Reserva tu viaje con nuestras promociones más recientes
                    </p>
                </div>

                {cargando ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-3 text-muted">Cargando promociones...</p>
                    </div>
                ) : promociones.length === 0 ? (
                    <div className="alert alert-info text-center">
                        No hay promociones activas en este momento.
                    </div>
                ) : (
                    <div className="row">
                        {promociones.map((promo) => (
                            <div className="col-md-6 mb-4" key={promo.idPromo}>
                                <div
                                    className="card border-0 shadow-lg h-100 rounded-4 bg-white custom-card overflow-hidden"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate('/', { state: { idRuta: promo.idRuta } })}
                                >
                                    <div className="row g-0 h-100 align-items-stretch">
                                        <div className="col-5 position-relative">
                                        {/* Imagen fija */}
                                            <img
                                                src={promo.imagen || '../imagen/costarica.png'}
                                                alt={`Vuelo a ${promo.ciudadDestino}`}
                                                className="w-100 h-100 position-absolute top-0 start-0"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="col-7">
                                            <div className="card-body p-4">
                                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                                    <p className="text-decoration-line-through text-muted mb-0 fs-5">
                                                        ${promo.precioOriginal}
                                                    </p>
                                                    <span className="badge bg-success fs-6 px-3 py-2 rounded-pill shadow-sm">
                                                        desde ${promo.precioPromocion}
                                                    </span>
                                                </div>

                                                <h3 className="fw-bold text-dark mb-3 fs-4">
                                                    {promo.ciudadOrigen} a {promo.ciudadDestino}
                                                </h3>

                                                <p className="text-muted d-flex align-items-center gap-2 mb-0 small">
                                                    <FaCalendarAlt className="text-primary flex-shrink-0" />
                                                    <span>{formatFecha(promo.inicio)} — {formatFecha(promo.fin)}</span>
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Promo;