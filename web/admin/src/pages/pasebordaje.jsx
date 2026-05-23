import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlane, FaPrint, FaMobileAlt, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const PaseAbordar = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { reserva, asientosVuelo1, asientosVuelo2 } = location.state || {};

  const [pasajeroViendo, setPasajeroViendo] = useState(0);
  const [correo, setCorreo] = useState('');
  const [movil, setMovil] = useState('');

  // Estado de enviado 
  const [enviadoPorPasajero, setEnviadoPorPasajero] = useState({});

  const totalPasajeros = reserva.pasajeros?.length || 1;

  const obtenerNombre = (index) => {
    const p = reserva.pasajeros?.[index];
    if (!p) return `Pasajero ${index + 1}`;
    return p.nombreCompleto || `${p.nombre || ''} ${p.apellido || ''}`.trim() || `Pasajero ${index + 1}`;
  };

  const enviado = enviadoPorPasajero[pasajeroViendo] || { correo: false, movil: false, impresora: false };

  const handleEnviar = (tipo) => {
    if (tipo === 'correo' && !correo) { alert('Ingrese un correo electrónico.'); return; }
    if (tipo === 'movil' && !movil) { alert('Ingrese un número de teléfono.'); return; }

    setEnviadoPorPasajero(prev => ({
      ...prev,
      [pasajeroViendo]: { ...enviado, [tipo]: true }
    }));

    alert(
      tipo === 'correo' ? `Pase de ${obtenerNombre(pasajeroViendo)} enviado a ${correo}` :
      tipo === 'movil' ? `Pase de ${obtenerNombre(pasajeroViendo)} enviado al móvil ${movil}` :
      `Imprimiendo pase de ${obtenerNombre(pasajeroViendo)}...`
    );
    if (tipo === 'impresora') window.print();
  };

  // Al cambiar de pasajero, limpiar correo y móvil
  const handleCambiarPasajero = (index) => {
    setPasajeroViendo(index);
    setCorreo('');
    setMovil('');
  };

  const asientoTramo1 = asientosVuelo1?.[pasajeroViendo] || 'N/A';
  const asientoTramo2 = asientosVuelo2?.[pasajeroViendo] || null;

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '650px' }}>

        {/* Selector de pasajero */}
        {totalPasajeros > 1 && (
          <div className="mb-3">
            <select
              className="form-select fw-semibold border-primary"
              value={pasajeroViendo}
              onChange={(e) => handleCambiarPasajero(Number(e.target.value))}
            >
              {Array.from({ length: totalPasajeros }, (_, i) => (
                <option key={i} value={i}>
                  Pase de {obtenerNombre(i)} — Asiento {asientosVuelo1?.[i] || 'N/A'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Pase de abordar */}
        <div className="card shadow border-0 rounded-4 overflow-hidden mb-4">

          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold fs-5">✈️ AIR<strong>Tec</strong></div>
              <small className="opacity-75">Pase de Abordar / Boarding Pass</small>
            </div>
            <FaPlane size={32} className="opacity-75" />
          </div>

          {/* Ruta */}
          <div className="bg-primary bg-opacity-10 px-4 py-3 d-flex justify-content-between align-items-center border-bottom">
            <div className="text-center">
              <div className="fw-bold fs-3 text-primary">
                {reserva.origen?.match(/\(([^)]+)\)/)?.[1] || reserva.origen}
              </div>
              <small className="text-muted">{reserva.origen}</small>
            </div>
            <FaPlane className="text-primary mx-3" size={20} />
            <div className="text-center">
              <div className="fw-bold fs-3 text-primary">
                {reserva.destino?.match(/\(([^)]+)\)/)?.[1] || reserva.destino}
              </div>
              <small className="text-muted">{reserva.destino}</small>
            </div>
          </div>

          {/* Datos */}
          <div className="px-4 py-3">
            <div className="row g-3 mb-3">
              <div className="col-6">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Pasajero</small>
                <div className="fw-bold text-dark">{obtenerNombre(pasajeroViendo)}</div>
              </div>
              <div className="col-6">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Vuelo</small>
                <div className="fw-bold text-dark">{reserva.vuelo}</div>
              </div>
              <div className="col-3">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Asiento</small>
                <div className="fw-bold fs-4 text-primary">{asientoTramo1}</div>
              </div>
              <div className="col-3">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Puerta</small>
                <div className="fw-bold fs-4 text-primary">{reserva.puerta || 'TBD'}</div>
              </div>
              <div className="col-3">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Hora salida</small>
                <div className="fw-bold fs-4 text-primary">{reserva.horaSalida || '--:--'}</div>
              </div>
            </div>

            {/* Escala */}
            {reserva.tieneEscala && (
              <div className="alert alert-warning py-2 px-3 rounded-3 small mb-0">
                <strong>Escala en:</strong> {reserva.escalas}
                {asientoTramo2 && (
                  <span className="d-block mt-1">
                    <strong>Asiento tramo 2 ({reserva.escalas} ➔ {reserva.destino}):</strong> {asientoTramo2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Línea de corte */}
          <div className="border-top border-dashed mx-4" />

          {/* Código de barras simulado */}
          <div className="text-center py-3 px-4">
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', letterSpacing: '6px', color: '#003580' }}>
              ▐██▌▐█▌██▐█▌▐██▌
            </div>
            <small className="text-muted">
              {reserva.vuelo}-{asientoTramo1}-{obtenerNombre(pasajeroViendo).replace(/\s+/g, '').toUpperCase().slice(0, 6)}
            </small>
          </div>
        </div>

        {/* Opciones de envío */}
        <div className="card shadow-sm border-0 rounded-4 p-4 mb-3">
          <h6 className="fw-bold text-secondary text-uppercase mb-3" style={{ fontSize: '0.8rem' }}>
            Enviar pase de {obtenerNombre(pasajeroViendo).split(' ')[0]}
          </h6>

          {/* Correo */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Por correo electrónico:</label>
            <div className="input-group">
              <input type="email" className="form-control" placeholder="correo@ejemplo.com"
                value={correo} onChange={(e) => setCorreo(e.target.value)} />
              <button className={`btn ${enviado.correo ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={() => handleEnviar('correo')}>
                {enviado.correo ? <FaCheckCircle /> : <FaEnvelope />}
              </button>
            </div>
          </div>

          {/* Móvil */}
          <div className="mb-3">
            <label className="form-label small fw-semibold">Por dispositivo móvil (SMS):</label>
            <div className="input-group">
              <input type="tel" className="form-control" placeholder="+506 8888 8888"
                value={movil} onChange={(e) => setMovil(e.target.value)} />
              <button className={`btn ${enviado.movil ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={() => handleEnviar('movil')}>
                {enviado.movil ? <FaCheckCircle /> : <FaMobileAlt />}
              </button>
            </div>
          </div>

          {/* Imprimir */}
          <button
            className={`btn w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 ${enviado.impresora ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => handleEnviar('impresora')}>
            {enviado.impresora ? <FaCheckCircle /> : <FaPrint />}
            <span>{enviado.impresora ? 'Enviado a impresora' : 'Imprimir pase de abordar'}</span>
          </button>
        </div>

        <button onClick={() => navigate('/admin')}
          className="btn btn-primary w-100 py-2 fw-bold rounded-3">
          Finalizar
        </button>

      </div>
    </div>
  );
};

export default PaseAbordar;