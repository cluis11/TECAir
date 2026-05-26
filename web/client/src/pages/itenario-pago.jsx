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

    const [usarMillas, setUsarMillas] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [reservaExitosa, setReservaExitosa] = useState(null);

    // Datos de tarjeta
    const [tarjeta, setTarjeta] = useState({
        numero: '',
        nombre: '',
        vencimiento: '',
        cvv: ''
    });

    // Cálculos de precio y millas
    const precioTotal = (resultado?.ruta?.precio || 0) * (busqueda?.pasajeros || 1);
    const millasUsuario = usuario?.estudiante?.millas || 0;
    const millasMaximas = Math.min(millasUsuario, precioTotal * MILLAS_POR_DOLAR_REDIMIR);
    const descuentoMillas = usarMillas ? millasMaximas / MILLAS_POR_DOLAR_REDIMIR : 0;
    const totalConTarjeta = Math.max(0, precioTotal - descuentoMillas);
    const millasAGanar = Math.floor(totalConTarjeta * MILLAS_POR_DOLAR);

    // Formato de inputs de tarjeta
    const handleTarjetaChange = (e) => {
        const { name, value } = e.target;
        // Formatear número de tarjeta con espacios
        if (name === 'numero') {
            const limpio = value.replace(/\D/g, '').slice(0, 16);
            const formateado = limpio.replace(/(.{4})/g, '$1 ').trim();
            setTarjeta(prev => ({ ...prev, numero: formateado }));
            return;
        }
        // Formatear vencimiento MM/AA
        if (name === 'vencimiento') {
            const limpio = value.replace(/\D/g, '').slice(0, 4);
            const formateado = limpio.length > 2 ? limpio.slice(0, 2) + '/' + limpio.slice(2) : limpio;
            setTarjeta(prev => ({ ...prev, vencimiento: formateado }));
            return;
        }
        setTarjeta(prev => ({ ...prev, [name]: value }));
    };

    // Validar tarjeta
    const validarTarjeta = () => {
        if (tarjeta.numero.replace(/\s/g, '').length !== 16) {
            alert('Número de tarjeta inválido.'); return false;
        }
        if (!tarjeta.nombre.trim()) {
            alert('Ingrese el nombre del titular.'); return false;
        }
        if (tarjeta.vencimiento.length !== 5) {
            alert('Fecha de vencimiento inválida.'); return false;
        }

        // Verificar que la tarjeta no esté vencida
        const [mes, ano] = tarjeta.vencimiento.split('/').map(Number);
        const hoy = new Date();
        const anoCompleto = 2000 + ano;
        const vencimiento = new Date(anoCompleto, mes, 1); 
        if (vencimiento <= hoy) {
            alert('La tarjeta está vencida.'); return false;
        }

        if (tarjeta.cvv.length < 3) {
            alert('CVV inválido.'); return false;
        }
        return true;
    };

    const handlePagar = async () => {
        if (!usuario) {
            alert('Debes iniciar sesión para realizar una reserva.');
            return;
        }
        if (!validarTarjeta()) return;
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
            if (!resReserva.ok) { alert('Error al crear la reserva. Intente de nuevo.'); return; }
            const reserva = await resReserva.json();

            // 3 - PUT /reserva/{id}/pagar
            const resPago = await fetch(`${API_BASE}/reserva/${reserva.id_reserva}/pagar`, {
                method: 'PUT'
            });
            if (!resPago.ok) { alert('Error al procesar el pago. Intente de nuevo.'); return; }

            // 4 - Descontar millas si se usaron
            if (usarMillas && usuario.esEstudiante && millasMaximas > 0) {
                await fetch(`${API_BASE}/usuario/${usuario.idUser}/millas`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ millas: -millasMaximas })
                });
            }

            // 5 - Acumular millas por pago con tarjeta
            if (usuario.esEstudiante && millasAGanar > 0) {
                await fetch(`${API_BASE}/usuario/${usuario.idUser}/millas`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ millas: millasAGanar })
                });
            }

            // 6 - Actualizar contexto una sola vez
            if (usuario.esEstudiante) {
                const nuevasMillas = (millasUsuario - (usarMillas ? millasMaximas : 0)) + millasAGanar;
                login({ ...usuario, estudiante: { ...usuario.estudiante, millas: nuevasMillas } });
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
                        {/* Millas usadas como descuento */}
                        {usarMillas && (
                            <div className="alert alert-info py-2 mb-3">
                                <FaPlane className="me-2" />
                                Usaste <strong>{millasMaximas} millas</strong> — descuento de <strong>${descuentoMillas.toFixed(2)}</strong>
                            </div>
                        )}
                        {/* Millas ganadas por pago con tarjeta */}
                        {usuario?.esEstudiante && millasAGanar > 0 && (
                            <div className="alert alert-success py-2 mb-4">
                                <FaPlane className="me-2" />
                                ¡Ganaste <strong>{millasAGanar} millas</strong> con esta compra!
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

                {/* Datos de tarjeta */}
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                    <h5 className="fw-bold mb-3">
                        <FaCreditCard className="me-2 text-primary" />
                        Datos de tarjeta
                    </h5>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Número de tarjeta</label>
                        <input
                            type="text"
                            name="numero"
                            className="form-control"
                            placeholder="1234 5678 9012 3456"
                            value={tarjeta.numero}
                            onChange={handleTarjetaChange}
                            maxLength={19}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-semibold">Nombre del titular</label>
                        <input
                            type="text"
                            name="nombre"
                            className="form-control"
                            placeholder="Como aparece en la tarjeta"
                            value={tarjeta.nombre}
                            onChange={handleTarjetaChange}
                        />
                    </div>
                    <div className="row g-3">
                        <div className="col-6">
                            <label className="form-label small fw-semibold">Vencimiento</label>
                            <input
                                type="text"
                                name="vencimiento"
                                className="form-control"
                                placeholder="MM/AA"
                                value={tarjeta.vencimiento}
                                onChange={handleTarjetaChange}
                                maxLength={5}
                            />
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-semibold">CVV</label>
                            <input
                                type="password"
                                name="cvv"
                                className="form-control"
                                placeholder="•••"
                                value={tarjeta.cvv}
                                onChange={handleTarjetaChange}
                                maxLength={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Millas — solo si es estudiante */}
                {usuario?.esEstudiante && (
                    <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${usarMillas ? 'border border-primary' : ''}`}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-bold mb-1">
                                    <FaPlane className="me-2 text-primary" />
                                    Usar millas
                                </h5>
                                <small className="text-muted">
                                    Tienes <strong>{millasUsuario} millas</strong>
                                    {usarMillas && ` — descuento de $${descuentoMillas.toFixed(2)}`}
                                </small>
                            </div>
                            <div className="form-check form-switch mb-0">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={usarMillas}
                                    onChange={(e) => setUsarMillas(e.target.checked)}
                                    disabled={millasUsuario === 0}
                                    style={{ width: '48px', height: '24px', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                        {usarMillas && (
                            <div className="alert alert-primary border-0 rounded-3 py-2 px-3 mt-3 mb-0 small">
                                Se usarán <strong>{millasMaximas} millas</strong> como descuento.
                                Pagarás <strong>${totalConTarjeta.toFixed(2)}</strong> con tarjeta.
                            </div>
                        )}
                    </div>
                )}

                {/* Aviso si no está logueado */}
                {!usuario && (
                    <div className="alert alert-warning py-2 mb-4 small">
                        Iniciá sesión para ver las opciones de pago con millas.
                    </div>
                )}

                {/* Total a pagar */}
                <div className="card border-0 bg-primary bg-opacity-10 rounded-4 p-3 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-dark">Total a pagar</span>
                        <h4 className="fw-bold text-primary mb-0">${totalConTarjeta.toFixed(2)}</h4>
                    </div>
                    {usarMillas && (
                        <small className="text-success mt-1 d-block">
                            Ahorraste ${descuentoMillas.toFixed(2)} con tus millas
                        </small>
                    )}
                    {usuario?.esEstudiante && millasAGanar > 0 && (
                        <small className="text-primary mt-1 d-block">
                            Ganarás {millasAGanar} millas con esta compra
                        </small>
                    )}
                </div>

                {/* Botón pagar */}
                <button
                    className="btn btn-primary w-100 py-3 fw-bold rounded-3 fs-5"
                    onClick={handlePagar}
                    disabled={cargando || !usuario}
                >
                    {cargando ? 'Procesando...' : `Confirmar y pagar $${totalConTarjeta.toFixed(2)}`}
                </button>

                {/* Aviso login */}
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