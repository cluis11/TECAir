import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaPlane, FaUser } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL;

const SeleccionAsientos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reserva } = location.state || {};

  const tramoActual = reserva?.tramoIndex || 0;
  const [asientos, setAsientos] = useState([]);
  const [seleccion, setSeleccion] = useState({}); // { pasaporte: id_asiento }
  const [pasajeroActivo, setPasajeroActivo] = useState(0);
  const [cargando, setCargando] = useState(true);

  // Tramos ordenados por salida
  const tramos = reserva
    ? [...(reserva.pasajeros?.[0]?.boletos || [])].sort((a, b) => a.salida > b.salida ? 1 : -1)
    : [];

  const tramoInfo = tramos[tramoActual];

  useEffect(() => {
    if (!reserva) navigate('/admin');
  }, [reserva, navigate]);

  useEffect(() => {
    if (!tramoInfo) return;
    const fetchAsientos = async () => {
      setCargando(true);
      try {
        const res = await fetch(`${API_BASE}/itinerario/asiento/${tramoInfo.idItinerario}`);
        const data = await res.json();
        setAsientos(data);
      } catch (error) {
        console.error('Error al cargar asientos:', error);
      } finally {
        setCargando(false);
      }
    };
    fetchAsientos();
  }, [tramoInfo]);

  if (!reserva) return null;

  // Filas y columnas dinámicas
  const filas = [...new Set(asientos.map(a => a.fila))].sort((a, b) => parseInt(a) - parseInt(b));
  const columnas = [...new Set(asientos.map(a => a.columna))].sort();
  const mitad = Math.ceil(columnas.length / 2);
  const columnasIzq = columnas.slice(0, mitad);
  const columnasDer = columnas.slice(mitad);

  const getAsiento = (fila, columna) =>
    asientos.find(a => a.fila === fila && a.columna === columna);

  const getAsientoSeleccionadoPor = (idAsiento) =>
    Object.entries(seleccion).find(([, val]) => val?.idAsiento === idAsiento)?.[0];

  const toggleAsiento = (asiento) => {
    if (asiento.estado === 'ocupado') return;
    const pasajero = reserva.pasajeros[pasajeroActivo];

    setSeleccion(prev => {
      const nueva = { ...prev };
      if (nueva[pasajero.pasaporte]?.idAsiento === asiento.id_asiento) {
        delete nueva[pasajero.pasaporte];
      } else {
        nueva[pasajero.pasaporte] = {
          idAsiento: asiento.id_asiento,
          fila: asiento.fila,
          columna: asiento.columna
        };
      }
      return nueva;
    });
  };

  const todosAsignados = () =>
    reserva.pasajeros.every(p => seleccion[p.pasaporte]?.idAsiento);

  const handleContinuar = () => {
    if (!todosAsignados()) {
      alert(`Debe asignar un asiento a cada uno de los ${reserva.pasajeros.length} pasajeros.`);
      return;
    }

    navigate('/check-in/pase', {
      state: {
        reserva,
        seleccion,
        seleccionPorTramo: { [tramoInfo.idItinerario]: seleccion },
        tramoIndex: tramoActual
      }
    });
  };

  const renderAsiento = (fila, columna) => {
    const asiento = getAsiento(fila, columna);
    if (!asiento) return <div key={`${fila}${columna}`} style={{ width: '38px', height: '38px' }} />;

    const estaOcupado = asiento.estado === 'ocupado';
    const pasajeroQueLoTiene = getAsientoSeleccionadoPor(asiento.id_asiento);
    const esMiSeleccion = pasajeroQueLoTiene === reserva.pasajeros[pasajeroActivo]?.pasaporte;
    const estaSeleccionadoPorOtro = pasajeroQueLoTiene && !esMiSeleccion;

    let claseBtn = 'btn btn-outline-secondary';
    if (estaOcupado) claseBtn = 'btn btn-dark';
    else if (esMiSeleccion) claseBtn = 'btn btn-primary';
    else if (estaSeleccionadoPorOtro) claseBtn = 'btn btn-success';

    return (
      <button
        key={`${fila}${columna}`}
        type="button"
        onClick={() => toggleAsiento(asiento)}
        className={claseBtn}
        disabled={estaOcupado || estaSeleccionadoPorOtro}
        style={{ width: '38px', height: '38px', fontSize: '9px', padding: 0, borderRadius: '6px 6px 2px 2px' }}
      >
        {fila}{columna}
      </button>
    );
  };

  const renderFila = (fila) => (
    <div key={fila} className="d-flex align-items-center justify-content-center mb-2 gap-1">
      <small className="text-muted me-1" style={{ width: '16px', textAlign: 'right' }}>{fila}</small>
      <div className="d-flex gap-1">
        {columnasIzq.map(col => renderAsiento(fila, col))}
      </div>
      <div style={{ width: '24px' }} />
      <div className="d-flex gap-1">
        {columnasDer.map(col => renderAsiento(fila, col))}
      </div>
      <small className="text-muted ms-1" style={{ width: '16px' }}>{fila}</small>
    </div>
  );

  const asignadosActual = Object.keys(seleccion).length;

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '560px' }}>
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

          {/* Header */}
          <div className="bg-primary text-white text-center py-4 px-3">
            <h4 className="fw-bold mb-1">Selección de Asientos</h4>
            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <FaPlane />
              <span className="fw-semibold">
                {tramoInfo?.ciudadOrigen} ➔ {tramoInfo?.ciudadDestino}
              </span>
            </div>
          </div>

          <div className="card-body px-4 py-3">

            {/* Selector de pasajero */}
            {reserva.pasajeros.length > 1 && (
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">
                  <FaUser className="me-1" />Asignando asiento para:
                </label>
                <select
                  className="form-select form-select-sm border-primary fw-semibold"
                  value={pasajeroActivo}
                  onChange={e => setPasajeroActivo(Number(e.target.value))}
                >
                  {reserva.pasajeros.map((p, i) => (
                    <option key={p.pasaporte} value={i}>
                      {p.nombreCompleto}{seleccion[p.pasaporte] ? ' ✓' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Leyenda */}
            <div className="d-flex justify-content-center gap-3 mb-3 flex-wrap">
              <div className="d-flex align-items-center gap-1 small">
                <div className="btn btn-outline-secondary" style={{ width: '20px', height: '20px', padding: 0, pointerEvents: 'none' }}></div>
                <span>Disponible</span>
              </div>
              <div className="d-flex align-items-center gap-1 small">
                <div className="btn btn-dark" style={{ width: '20px', height: '20px', padding: 0, pointerEvents: 'none' }}></div>
                <span>Ocupado</span>
              </div>
              <div className="d-flex align-items-center gap-1 small">
                <div className="btn btn-primary" style={{ width: '20px', height: '20px', padding: 0, pointerEvents: 'none' }}></div>
                <span>Tu selección</span>
              </div>
              {reserva.pasajeros.length > 1 && (
                <div className="d-flex align-items-center gap-1 small">
                  <div className="btn btn-success" style={{ width: '20px', height: '20px', padding: 0, pointerEvents: 'none' }}></div>
                  <span>Otro pasajero</span>
                </div>
              )}
            </div>

            {/* Progreso */}
            <div className="alert alert-info text-center py-2 mb-3 fw-bold">
              Asignados {asignadosActual} de {reserva.pasajeros.length} asientos
            </div>

            {/* Cabina */}
            {cargando ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-2 text-muted small">Cargando asientos...</p>
              </div>
            ) : (
              <div className="border rounded-4 overflow-hidden mb-3" style={{ background: '#f8fafc' }}>
                <div className="text-center py-2 bg-secondary text-white fw-bold small">
                  ▲ CREW MEMBERS AREA ▲
                </div>
                <div className="d-flex justify-content-center align-items-center gap-1 py-2">
                  <div style={{ width: '24px' }} />
                  {columnasIzq.map(l => (
                    <div key={l} style={{ width: '38px', textAlign: 'center' }}>
                      <small className="fw-bold text-muted">{l}</small>
                    </div>
                  ))}
                  <div style={{ width: '24px' }} />
                  {columnasDer.map(l => (
                    <div key={l} style={{ width: '38px', textAlign: 'center' }}>
                      <small className="fw-bold text-muted">{l}</small>
                    </div>
                  ))}
                  <div style={{ width: '24px' }} />
                </div>
                <div className="px-3 pb-3">
                  {filas.map(renderFila)}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline-secondary py-2 fw-bold d-flex align-items-center gap-2"
              >
                <FaArrowLeft /> Volver
              </button>
              <button
                onClick={handleContinuar}
                className="btn btn-primary flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                <span>Confirmar Check-in</span>
                <FaArrowRight />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionAsientos;