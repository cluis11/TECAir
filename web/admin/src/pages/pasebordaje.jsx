import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlane, FaPrint, FaMobileAlt, FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL;

const PaseAbordar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reserva, seleccionPorTramo, tramoIndex = 0 } = location.state || {};

  const [pasajeroViendo, setPasajeroViendo] = useState(0);
  const [correo, setCorreo] = useState('');
  const [movil, setMovil] = useState('');
  const [enviadoPorPasajero, setEnviadoPorPasajero] = useState({});
  const [checkinConfirmado, setCheckinConfirmado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const totalPasajeros = reserva?.pasajeros?.length || 1;

  const tramos = [...(reserva?.pasajeros?.[0]?.boletos || [])]
    .sort((a, b) => a.salida > b.salida ? 1 : -1);

  const tramoInfo = tramos[tramoIndex];
  const seleccion = seleccionPorTramo?.[tramoInfo?.idItinerario] || {};

  const obtenerNombre = (index) => {
    const p = reserva?.pasajeros?.[index];
    if (!p) return `Pasajero ${index + 1}`;
    return p.nombreCompleto || `Pasajero ${index + 1}`;
  };

  const getAsientoLabel = (pasajeroIndex) => {
    const pasajero = reserva?.pasajeros?.[pasajeroIndex];
    if (!pasajero) return 'N/A';
    const asientoData = seleccion[pasajero.pasaporte];
    if (!asientoData) return 'N/A';
    // asientoData tiene { idAsiento, fila, columna } desde asientos.jsx
    if (asientoData.fila && asientoData.columna) return `${asientoData.fila}${asientoData.columna}`;
    return 'N/A';
  };

  const getPuerta = () => tramoInfo?.puertaEmbarque || 'TBD';
  const getHoraSalida = () => tramoInfo?.salida?.toString().substring(0, 5) || '--:--';

  const asientoActual = getAsientoLabel(pasajeroViendo);

  const enviado = enviadoPorPasajero[pasajeroViendo] || { correo: false, movil: false, impresora: false };

  // Confirmar check-in — llama PUT /checkin/{idBoleto} para cada pasajero
  const handleConfirmarCheckin = async () => {
    const confirmar = window.confirm(
      `¿Confirmar check-in para el tramo ${tramoInfo?.ciudadOrigen} → ${tramoInfo?.ciudadDestino}?`
    );
    if (!confirmar) return;

    setCargando(true);
    try {
      for (const pasajero of reserva.pasajeros) {
        const asientoData = seleccion[pasajero.pasaporte];
        const boleto = pasajero.boletos.find(b => b.idItinerario === tramoInfo.idItinerario);
        if (!boleto || !asientoData) continue;

        const res = await fetch(`${API_BASE}/checkin/${boleto.idBoleto}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ IdAsiento: asientoData.idAsiento })
        });

        if (!res.ok) {
          alert('Error al procesar el check-in. Intente de nuevo.');
          return;
        }
      }
      setCheckinConfirmado(true);
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

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

  const handleCambiarPasajero = (index) => {
    setPasajeroViendo(index);
    setCorreo('');
    setMovil('');
  };

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '650px' }}>

        {/* Botón volver */}
        <button
          className="btn btn-outline-secondary mb-3 d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Volver a asientos
        </button>

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
                  Pase de {obtenerNombre(i)} — Asiento {getAsientoLabel(i)}
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
              <div className="fw-bold fs-3 text-primary">{tramoInfo?.ciudadOrigen}</div>
              <small className="text-muted">{tramoInfo?.ciudadOrigen}</small>
            </div>
            <FaPlane className="text-primary mx-3" size={20} />
            <div className="text-center">
              <div className="fw-bold fs-3 text-primary">{tramoInfo?.ciudadDestino}</div>
              <small className="text-muted">{tramoInfo?.ciudadDestino}</small>
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
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Reserva</small>
                <div className="fw-bold text-dark">#{reserva?.idReserva}</div>
              </div>
              <div className="col-3">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Asiento</small>
                <div className="fw-bold fs-4 text-primary">{asientoActual}</div>
              </div>
              <div className="col-3">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Puerta</small>
                <div className="fw-bold fs-4 text-primary">{getPuerta()}</div>
              </div>
              <div className="col-3">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>Hora salida</small>
                <div className="fw-bold fs-4 text-primary">{getHoraSalida()}</div>
              </div>
            </div>
          </div>

          {/* Línea de corte */}
          <div className="border-top border-dashed mx-4" />

          {/* Código de barras simulado */}
          <div className="text-center py-3 px-4">
            <div style={{ fontFamily: 'monospace', fontSize: '2rem', letterSpacing: '6px', color: '#003580' }}>
              ▐██▌▐█▌██▐█▌▐██▌
            </div>
            <small className="text-muted">
              {reserva?.idReserva}-{asientoActual}-{obtenerNombre(pasajeroViendo).replace(/\s+/g, '').toUpperCase().slice(0, 6)}
            </small>
          </div>
        </div>

        {/* Confirmar check-in */}
        {!checkinConfirmado ? (
          <button
            className="btn btn-success w-100 py-3 fw-bold rounded-3 mb-3 fs-5"
            onClick={handleConfirmarCheckin}
            disabled={cargando}
          >
            {cargando ? 'Procesando...' : '✓ Confirmar Check-in'}
          </button>
        ) : (
          <>
            {/* Opciones de envío */}
            <div className="card shadow-sm border-0 rounded-4 p-4 mb-3">
              <h6 className="fw-bold text-secondary text-uppercase mb-3" style={{ fontSize: '0.8rem' }}>
                Enviar pase de {obtenerNombre(pasajeroViendo).split(' ')[0]}
              </h6>

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

              <button
                className={`btn w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 ${enviado.impresora ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => handleEnviar('impresora')}>
                {enviado.impresora ? <FaCheckCircle /> : <FaPrint />}
                <span>{enviado.impresora ? 'Enviado a impresora' : 'Imprimir pase de abordar'}</span>
              </button>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary flex-grow-1 py-2 fw-bold rounded-3"
                onClick={() => navigate('/check-in/maleta', {
                  state: { reserva, seleccionPorTramo, tramoIndex }
                })}
              >
                Asignar Maletas
              </button>
              <button
                className="btn btn-primary flex-grow-1 py-2 fw-bold rounded-3"
                onClick={() => navigate('/admin')}
              >
                Finalizar
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default PaseAbordar;