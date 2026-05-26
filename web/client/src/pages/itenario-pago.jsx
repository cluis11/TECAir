import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaPlane, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';

const API_BASE = process.env.REACT_APP_API_URL;

// Tasa: 1 milla = $1, 100 millas = $1
const MILLAS_POR_DOLAR = 1;
const MILLAS_POR_DOLAR_REDIMIR = 100;

const ItinerarioPago = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario, login } = useAuth();
    const { resultado, busqueda, pasajeros } = location.state || {};

    const [metodoPago, setMetodoPago] = useState('tarjeta');
    const [cargando, setCargando] = useState(false);
    const [reservaExitosa, setReservaExitosa] = useState(null);

    const precioTotal = (resultado?.ruta?.precio || 0) * (busqueda?.pasajeros || 1);
    const millasUsuario = usuario?.estudiante?.millas || 0;
    const millasNecesarias = precioTotal * MILLAS_POR_DOLAR_REDIMIR;
    const puedeUsarMillas = usuario?.esEstudiante && millasUsuario >= millasNecesarias;

    const millasAGanar = Math.floor(precioTotal * MILLAS_POR_DOLAR);

    const handlePagar = async () => {
        if (!usuario) {
            alert('Debes iniciar sesión para realizar una reserva.');
            return;
        }

        if (metodoPago === 'millas' && !puedeUsarMillas) {
            alert(`No tienes suficientes millas. Necesitas ${millasNecesarias} millas y tienes ${millasUsuario}.`);
            return;
        }

        setCargando(true);

        try {
            // 1 - Construir body de reserva
            const idsPorTramo = resultado.vuelos.map(v => v.idItinerario);

            const body = {
                id_usuario: usuario.idUser,
                PasaporteTitular: pasajeros[0].pasaporte,
                Pasajeros: pasajeros.map(p => ({
                    Pasaporte: p.pasaporte,
                    Nombre: p.nombre,
                    Ap1: p.ap1,
                    Ap2: p.ap2 || null,
                    Nacionalidad: p.nacionalidad,
                    FechaNacimiento: p.fechaNacimiento,
                    Boletos: idsPorTramo.map(idItinerario => ({
                        id_itinerario: idItinerario,
                        id_asiento: null
                    }))
                }))
            };

            // 2 - POST /reserva
            const resReserva = await fetch(`${API_BASE}/reserva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!resReserva.ok) {
                alert('Error al crear la reserva. Intente de nuevo.');
                return;
            }

            const reserva = await resReserva.json();

            // 3 - PUT /reserva/{id}/pagar
            const resPago = await fetch(`${API_BASE}/reserva/${reserva.id_reserva}/pagar`, {
                method: 'PUT'
            });

            if (!resPago.ok) {
                alert('Error al procesar el pago. Intente de nuevo.');
                return;
            }

            // 4 - Millas
            if (metodoPago === 'millas') {
                // Descontar millas
                await fetch(`${API_BASE}/usuario/${usuario.idUser}/millas`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ millas: -millasNecesarias })
                });
                // Actualizar contexto
                login({
                    ...usuario,
                    estudiante: { ...usuario.estudiante, millas: millasUsuario - millasNecesarias }
                });
            } else if (usuario.esEstudiante) {
                // Acumular millas por pago con tarjeta
                await fetch(`${API_BASE}/usuario/${usuario.idUser}/millas`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ millas: millasAGanar })
                });
                // Actualizar contexto
                login({
                    ...usuario,
                    estudiante: { ...usuario.estudiante, millas: millasUsuario + millasAGanar }
                });
            }

            setReservaExitosa(reserva);

        } catch (error) {
            alert('No se pudo conectar con el servidor. Intente de nuevo.');
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    // Pantalla de éxito
    if (reservaExitosa) {
        return (
            <div className="container-fluid p-0 bg-light min-vh-100">
                <Navbar paginaActiva="reserva" />
                <div className="container mt-5 mb-5 text-center" style={{ maxWidth: '500px' }}>
                    <div className="card border-0 shadow-lg rounded-4 p-5">
                        <FaCheckCircle size={60} className="text-success mb-4 mx-auto" />
                        <h2 className="fw-bold mb-2">¡Reserva confirmada!</h2>
                        <p className="text-muted mb-1">Código de reserva:</p>
                        <h3 className="fw-bold text-primary mb-4">#{reservaExitosa.id_reserva}</h3>
                        <p className="text-muted mb-4">
                            {resultado?.ruta?.ciudadOrigen} → {resultado?.ruta?.ciudadDestino}
                        </p>
                        {metodoPago === 'tarjeta' && usuario?.esEstudiante && (
                            <div className="alert alert-success py-2 mb-4">
                                <FaPlane className="me-2" />
                                ¡Ganaste <strong>{millasAGanar} millas</strong> con esta compra!
                            </div>
                        )}
                        {metodoPago === 'millas' && (
                            <div className="alert alert-info py-2 mb-4">
                                <FaPlane className="me-2" />
                                Pagaste con <strong>{millasNecesarias} millas</strong>.
                            </div>
                        )}
                        <button
                            className="btn btn-primary w-100 py-2 fw-bold rounded-3"
                            onClick={() => navigate('/')}
                        >
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-0 bg-light min-vh-100">
            <Navbar paginaActiva="reserva" />

            <div className="container mt-5 mb-5" style={{ maxWidth: '600px' }}>

                {/* Header */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <button className="btn btn-outline-primary rounded-pill" onClick={() => navigate(-1)}>
                        <FaArrowLeft className="me-2" />Volver
                    </button>
                    <h2 className="fw-bold mb-0">Resumen y Pago</h2>
                </div>

                {/* Resumen del vuelo */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h5 className="fw-bold text-primary mb-3">
                        <FaPlane className="me-2" />
                        {resultado?.ruta?.ciudadOrigen} → {resultado?.ruta?.ciudadDestino}
                    </h5>
                    {resultado?.vuelos?.map((vuelo, i) => (
                        <div key={i} className="d-flex justify-content-between text-muted small py-1 border-bottom">
                            <span>Tramo {i + 1}: {vuelo.ciudadOrigen} → {vuelo.ciudadDestino}</span>
                            <span>{vuelo.salida?.substring(0, 5)} · Puerta {vuelo.puertaEmbarque}</span>
                        </div>
                    ))}
                    <div className="d-flex justify-content-between mt-3">
                        <span className="text-muted">{busqueda?.pasajeros} pasajero(s) × ${resultado?.ruta?.precio}</span>
                        <span className="fw-bold fs-5 text-primary">${precioTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* Método de pago */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h5 className="fw-bold mb-3">Método de pago</h5>

                    {/* Tarjeta */}
                    <div
                        className={`border rounded-3 p-3 mb-3 d-flex align-items-center gap-3 ${metodoPago === 'tarjeta' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setMetodoPago('tarjeta')}
                    >
                        <input type="radio" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                        <FaCreditCard className="text-primary" size={20} />
                        <div>
                            <div className="fw-semibold">Tarjeta de crédito</div>
                            {usuario?.esEstudiante && (
                                <small className="text-success">Ganás {millasAGanar} millas con esta compra</small>
                            )}
                        </div>
                    </div>

                    {/* Millas */}
                    {usuario?.esEstudiante && (
                        <div
                            className={`border rounded-3 p-3 d-flex align-items-center gap-3 ${!puedeUsarMillas ? 'opacity-50' : ''} ${metodoPago === 'millas' ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                            style={{ cursor: puedeUsarMillas ? 'pointer' : 'not-allowed' }}
                            onClick={() => puedeUsarMillas && setMetodoPago('millas')}
                        >
                            <input type="radio" checked={metodoPago === 'millas'} disabled={!puedeUsarMillas} onChange={() => puedeUsarMillas && setMetodoPago('millas')} />
                            <FaPlane className="text-primary" size={20} />
                            <div>
                                <div className="fw-semibold">Pagar con millas</div>
                                <small className={puedeUsarMillas ? 'text-success' : 'text-danger'}>
                                    {puedeUsarMillas
                                        ? `Usás ${millasNecesarias} millas (tenés ${millasUsuario})`
                                        : `Necesitás ${millasNecesarias} millas — tenés ${millasUsuario}`
                                    }
                                </small>
                            </div>
                        </div>
                    )}

                    {!usuario && (
                        <div className="alert alert-warning py-2 mt-3 small">
                            Iniciá sesión para ver las opciones de pago con millas.
                        </div>
                    )}
                </div>

                {/* Botón pagar */}
                <button
                    className="btn btn-primary w-100 py-3 fw-bold rounded-3 fs-5"
                    onClick={handlePagar}
                    disabled={cargando || !usuario}
                >
                    {cargando ? 'Procesando...' : `Confirmar y pagar $${precioTotal.toFixed(2)}`}
                </button>

                {!usuario && (
                    <p className="text-center text-muted mt-3 small">
                        Debes iniciar sesión para completar la reserva.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ItinerarioPago;