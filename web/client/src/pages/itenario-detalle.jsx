import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUserPlus, FaUser } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';

const estadoInicialPasajero = {
    pasaporte: '',
    nombre: '',
    ap1: '',
    ap2: '',
    nacionalidad: '',
    fechaNacimiento: ''
};

const ItinerarioDetalle = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario } = useAuth();
    const { resultado, busqueda } = location.state || {};

    const cantPasajeros = busqueda?.pasajeros || 1;

    // Pre-rellenar pasajero 1 si está logueado
    const pasajerosIniciales = Array.from({ length: cantPasajeros }, (_, i) => {
        if (i === 0 && usuario) {
            return {
                pasaporte: '',
                nombre: usuario.nombre || '',
                ap1: usuario.ap1 || '',
                ap2: usuario.ap2 || '',
                nacionalidad: '',
                fechaNacimiento: ''
            };
        }
        return { ...estadoInicialPasajero };
    });

    const [pasajeros, setPasajeros] = useState(pasajerosIniciales);

    const handleChange = (index, campo, valor) => {
        const nuevos = [...pasajeros];
        nuevos[index][campo] = valor;
        setPasajeros(nuevos);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/pagar', {
            state: { resultado, busqueda, pasajeros }
        });
    };

    return (
        <div className="container-fluid p-0 bg-light min-vh-100">
            <Navbar paginaActiva="reserva" />

            <div className="container mt-5 mb-5" style={{ maxWidth: '700px' }}>

                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button className="btn btn-outline-primary rounded-pill" onClick={() => navigate(-1)}>
                        <FaArrowLeft className="me-2" />Volver
                    </button>
                    <div>
                        <h2 className="fw-bold mb-0">Datos de Pasajeros</h2>
                        <small className="text-muted">
                            {resultado?.ruta?.ciudadOrigen} → {resultado?.ruta?.ciudadDestino} · {cantPasajeros} pasajero(s)
                        </small>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {pasajeros.map((pasajero, index) => (
                        <div key={index} className="card border-0 shadow-sm rounded-4 mb-4 p-4">
                            <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                                {index === 0 ? <FaUser /> : <FaUserPlus />}
                                Pasajero {index + 1}
                                {index === 0 && <span className="badge bg-primary ms-2 fw-normal" style={{ fontSize: '0.75rem' }}>Titular</span>}
                            </h5>

                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Pasaporte</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: EXP12345"
                                        value={pasajero.pasaporte}
                                        onChange={e => handleChange(index, 'pasaporte', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Juan"
                                        value={pasajero.nombre}
                                        onChange={e => handleChange(index, 'nombre', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Primer Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Pérez"
                                        value={pasajero.ap1}
                                        onChange={e => handleChange(index, 'ap1', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Segundo Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Opcional"
                                        value={pasajero.ap2}
                                        onChange={e => handleChange(index, 'ap2', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Nacionalidad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Costarricense"
                                        value={pasajero.nacionalidad}
                                        onChange={e => handleChange(index, 'nacionalidad', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={pasajero.fechaNacimiento}
                                        onChange={e => handleChange(index, 'fechaNacimiento', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 fs-5">
                        Continuar al Pago
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ItinerarioDetalle;