import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaPlus, FaTrash, FaUser, FaSearch } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL;

const calcularCostoMaletas = (cantidad) => {
  if (cantidad <= 1) return 0;
  if (cantidad === 2) return 50;
  return 50 + (cantidad - 2) * 75;
};

const SeleccionEquipaje = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { reserva, seleccionPorTramo, tramoIndex } = location.state || {};

  // Modo: 'pase' si viene desde pasaje, 'independiente' si viene del admin directo
  const modoDesdePane = !!reserva;

  const [codigoReserva, setCodigoReserva] = useState('');
  const [pasajeros, setPasajeros] = useState([]);
  const [pasajeroActivo, setPasajeroActivo] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [reservaCargada, setReservaCargada] = useState(false);

  // Si viene desde pase, cargar pasajeros directamente
  useEffect(() => {
    if (modoDesdePane && reserva?.pasajeros) {
      const pasajerosInit = reserva.pasajeros.map(p => ({
        pasaporte: p.pasaporte,
        nombreCompleto: p.nombreCompleto,
        maletas: []
      }));
      setPasajeros(pasajerosInit);
      setReservaCargada(true);
    }
  }, []);

  // Buscar reserva en modo independiente
  const handleBuscarReserva = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await fetch(`${API_BASE}/maleta/reserva/${codigoReserva.trim()}`);
      if (res.status === 404 || !res.ok) {
        alert('Reserva no encontrada o sin pasajeros chequeados con vuelo abierto.');
        return;
      }
      const data = await res.json();
      if (!data || data.length === 0) {
        alert('No hay pasajeros con check-in pendiente de asignación de maletas.');
        return;
      }
      const pasajerosInit = data.map(p => ({
        pasaporte: p.pasaporte,
        nombreCompleto: `${p.nombre} ${p.ap1}`,
        maletas: p.maletas || []
      }));
      setPasajeros(pasajerosInit);
      setReservaCargada(true);
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const handleNuevaReserva = () => {
    setCodigoReserva('');
    setPasajeros([]);
    setReservaCargada(false);
    setPasajeroActivo(0);
  };

  // Agregar maleta — llama POST /maleta
  const agregarMaleta = async (indexPasajero) => {
    const pasajero = pasajeros[indexPasajero];
    // Agregar maleta temporal sin datos aún
    setPasajeros(prev => prev.map((p, i) => {
      if (i !== indexPasajero) return p;
      return {
        ...p,
        maletas: [
          ...p.maletas,
          { id: Date.now(), idMaleta: null, peso: '', color: '', guardada: false }
        ]
      };
    }));
  };

  // Guardar maleta en la API
  const guardarMaleta = async (indexPasajero, idTemp) => {
    const pasajero = pasajeros[indexPasajero];
    const maleta = pasajero.maletas.find(m => m.id === idTemp);

    if (!maleta.peso?.toString().trim() || !maleta.color?.trim()) {
      alert('Complete el peso y color de la maleta antes de guardar.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/maleta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pasaporte: pasajero.pasaporte,
          color: maleta.color,
          peso: parseFloat(maleta.peso)
        })
      });

      if (!res.ok) {
        const err = await res.text();
        alert(`Error al guardar maleta: ${err}`);
        return;
      }

      const data = await res.json();

      // Actualizar con el idMaleta real de la base
      setPasajeros(prev => prev.map((p, i) => {
        if (i !== indexPasajero) return p;
        return {
          ...p,
          maletas: p.maletas.map(m =>
            m.id === idTemp
              ? { ...m, idMaleta: data.idMaleta, guardada: true }
              : m
          )
        };
      }));
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  // Eliminar maleta — llama DELETE /maleta/{id}
  const eliminarMaleta = async (indexPasajero, maleta) => {
    // Si no está guardada aún, solo quitarla del estado
    if (!maleta.guardada || !maleta.idMaleta) {
      setPasajeros(prev => prev.map((p, i) => {
        if (i !== indexPasajero) return p;
        return { ...p, maletas: p.maletas.filter(m => m.id !== maleta.id) };
      }));
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/maleta/${maleta.idMaleta}`, { method: 'DELETE' });
      if (res.ok) {
        setPasajeros(prev => prev.map((p, i) => {
          if (i !== indexPasajero) return p;
          return { ...p, maletas: p.maletas.filter(m => m.id !== maleta.id) };
        }));
      } else {
        alert('Error al eliminar la maleta.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  const actualizarMaleta = (indexPasajero, idTemp, campo, valor) => {
    setPasajeros(prev => prev.map((p, i) => {
      if (i !== indexPasajero) return p;
      return {
        ...p,
        maletas: p.maletas.map(m => m.id !== idTemp ? m : { ...m, [campo]: valor })
      };
    }));
  };

  const calcularTotalGeneral = () =>
    pasajeros.reduce((total, p) => total + calcularCostoMaletas(p.maletas.length), 0);

  const obtenerNombre = (index) => pasajeros[index]?.nombreCompleto || `Pasajero ${index + 1}`;

  const pasajeroActual = pasajeros[pasajeroActivo];
  const cantMaletas = pasajeroActual?.maletas.length || 0;
  const costoPasajeroActivo = calcularCostoMaletas(cantMaletas);

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

          {/* Header */}
          <div className="bg-primary text-white text-center py-4 px-3">
            <h4 className="fw-bold mb-1">Asignación de Maletas</h4>
            <small className="opacity-75">1 maleta sin costo · 2da maleta $50 · 3ra en adelante $75 c/u</small>
          </div>

          <div className="card-body px-4 py-3">

            {/* Modo independiente — buscar reserva */}
            {!modoDesdePane && !reservaCargada && (
              <form onSubmit={handleBuscarReserva} className="mb-4">
                <label className="form-label fw-semibold">Código de Reserva</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese número de reserva"
                    value={codigoReserva}
                    onChange={e => setCodigoReserva(e.target.value)}
                    required
                  />
                  <button className="btn btn-primary" type="submit" disabled={cargando}>
                    <FaSearch />
                  </button>
                </div>
              </form>
            )}

            {/* Botón nueva reserva en modo independiente */}
            {!modoDesdePane && reservaCargada && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mb-3 d-flex align-items-center gap-2"
                onClick={handleNuevaReserva}
              >
                <FaSearch /> Buscar otra reserva
              </button>
            )}

            {reservaCargada && pasajeroActual && (
              <>
                {/* Selector de pasajero */}
                <div className="bg-white p-3 rounded-3 border mb-4 shadow-sm">
                  <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <FaUser className="text-primary" /> Pasajero asignado:
                  </label>
                  <select
                    className="form-select border-primary fw-semibold"
                    value={pasajeroActivo}
                    onChange={e => setPasajeroActivo(Number(e.target.value))}
                  >
                    {pasajeros.map((p, index) => (
                      <option key={index} value={index}>
                        {obtenerNombre(index)} — {p.maletas.length} maleta(s) · ${calcularCostoMaletas(p.maletas.length)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info del pasajero activo */}
                <div className="alert alert-primary border-0 rounded-3 py-2 px-3 mb-3 d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-uppercase fw-bold opacity-75" style={{ fontSize: '0.75rem' }}>Pasajero:</small>
                    <h5 className="fw-bold mb-0">{obtenerNombre(pasajeroActivo)}</h5>
                  </div>
                  <div className="text-end">
                    <small className="opacity-75">Cargo adicional</small>
                    <h4 className="fw-bold mb-0">${costoPasajeroActivo}</h4>
                  </div>
                </div>

                {/* Lista de maletas */}
                {pasajeroActual.maletas.length === 0 ? (
                  <div className="text-center py-4 border rounded-3 bg-white mb-3 text-muted">
                    <p className="small mb-0">Sin maletas registradas — la primera es gratuita.</p>
                  </div>
                ) : (
                  pasajeroActual.maletas.map((maleta, subIndex) => (
                    <div key={maleta.id} className="p-3 bg-white border rounded-3 mb-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <span className="fw-bold text-primary small d-flex align-items-center gap-2">
                          Maleta #{subIndex + 1}
                          {subIndex === 0 && <span className="badge bg-success ms-1">Gratis</span>}
                          {subIndex === 1 && <span className="badge bg-warning text-dark ms-1">+$50</span>}
                          {subIndex >= 2 && <span className="badge bg-danger ms-1">+$75</span>}
                          {maleta.guardada && <span className="badge bg-secondary ms-1">#{maleta.idMaleta}</span>}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger border-0 p-1"
                          onClick={() => eliminarMaleta(pasajeroActivo, maleta)}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>

                      <div className="row g-3">
                        <div className="col-6">
                          <label className="form-label small fw-semibold text-secondary mb-1">Peso (kg):</label>
                          <input
                            type="number"
                            className="form-control form-control-sm font-monospace"
                            value={maleta.peso}
                            onChange={e => actualizarMaleta(pasajeroActivo, maleta.id, 'peso', e.target.value)}
                            disabled={maleta.guardada}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small fw-semibold text-secondary mb-1">Color:</label>
                          <input
                            type="text"
                            className="form-control form-control-sm font-monospace"
                            value={maleta.color}
                            onChange={e => actualizarMaleta(pasajeroActivo, maleta.id, 'color', e.target.value)}
                            disabled={maleta.guardada}
                            required
                          />
                        </div>
                        {!maleta.guardada && (
                          <div className="col-12">
                            <button
                              type="button"
                              className="btn btn-sm btn-success w-100"
                              onClick={() => guardarMaleta(pasajeroActivo, maleta.id)}
                            >
                              Guardar maleta
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Botón agregar maleta */}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 mb-4 fw-bold"
                  onClick={() => agregarMaleta(pasajeroActivo)}
                >
                  <FaPlus size={12} />
                  Agregar maleta a {obtenerNombre(pasajeroActivo).split(' ')[0]}
                  {cantMaletas === 0 && ' (Gratis)'}
                  {cantMaletas === 1 && ' (+$50)'}
                  {cantMaletas >= 2 && ' (+$75)'}
                </button>

                {/* Total general */}
                <div className="card border-0 bg-light p-3 rounded-3 mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted d-block small">Total cargo adicional</span>
                      <span className="fw-bold text-dark">Todos los pasajeros</span>
                    </div>
                    <div className="text-end">
                      <h3 className="fw-bold text-primary mb-0">${calcularTotalGeneral()}</h3>
                      <small className="text-muted">USD</small>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="d-flex gap-2">
                  {modoDesdePane && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary py-2 fw-bold d-flex align-items-center gap-2"
                      onClick={() => navigate(-1)}
                    >
                      <FaArrowLeft /> Volver
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/admin')}
                    className="btn btn-primary flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3"
                  >
                    <span>Finalizar</span>
                    <FaArrowRight />
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionEquipaje;