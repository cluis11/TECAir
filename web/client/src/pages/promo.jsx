import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { FaPlaneDeparture, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa'; 
import '../App.css';

const Promo = () => {
    const navigate = useNavigate();

    // Promociones Prueba
    const [listPromo] = useState([
        {
            id: 1,
            origen: "San José",
            destino: "Madrid",
            fechaDisponible: "15 Mayo 2026 - 22 Junio 2026",
            precioOriginal: "$600",
            precio: "$450",
            imagen: "../imagen/costarica.png" // RUTA DONDE SE ALMACENA IMAGEN, ESTA EN LA CARPETA PUBLIC
        },
        {
            id: 2,
            origen: "San José",
            destino: "México",
            fechaDisponible: "18 Mayo 2026 - 25 Junio 2026",
            precioOriginal: "$500",
            precio: "$320",
            imagen: "../imagen/costarica.png"
        }
    ]);

    return (
        <div className="container-fluid  p-0 bg-light min-vh-100">

            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm py-3 mb-5">
                <div
                    className="navbar-brand d-flex align-items-center"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="fw-bold tracking-wide">✈︎ AIRTec</span>
                </div>
                    <ul className="navbar-nav d-flex flex-row flex-wrap ms-lg-3 me-auto gap-3">
                         <li className="nav-item">
                            <Link className="nav-link fw-bold d-flex align-items-center text-white-50" to="/">
                                Reserva
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active fw-bold d-flex align-items-center" to="/promos">
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

            <section className="container mb-5">
                <div className="text-center mb-5">
                    <h1 className="fw-extrabold text-dark display-5 mb-2">
                         Promociones 
                    </h1>
                    <p className="text-muted fs-5 built-subtitle">
                       Reserva tu viaje con nuestras promociones más recientes
                    </p>
                </div>

                <div className="row">
                    {listPromo.map((vuelo) => (
                        <div className="col-md-6 mb-4" key={vuelo.id}>
                            <div
                                className="card border-0 shadow-lg h-100 rounded-4 bg-white custom-card overflow-hidden"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/reservar/${vuelo.id}`)}
                            >
                                <div className="row g-0 h-100 align-items-stretch">
                                    
                                    <div className="col-5 position-relative">
                                        <img 
                                            src={vuelo.imagen} 
                                            alt={`Vuelo a ${vuelo.destino}`} 
                                            className="w-100 h-100 position-absolute top-0 start-0"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>

                                    <div className="col-7">
                                        <div className="card-body p-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                                <p className="text-decoration-line-through text-muted mb-0 fs-5">
                                                    {vuelo.precioOriginal}
                                                </p>
                                                <span className="badge bg-success fs-6 px-3 py-2 rounded-pill shadow-sm">
                                                    desde {vuelo.precio}
                                                </span>
                                            </div>

                                            <h3 className="fw-bold text-dark mb-3 fs-4">
                                                {vuelo.origen} a {vuelo.destino}
                                            </h3>

                                            <p className="text-muted d-flex align-items-center gap-2 mb-0 small">
                                                <FaCalendarAlt className="text-primary flex-shrink-0" />
                                                <span>{vuelo.fechaDisponible}</span>
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Promo;