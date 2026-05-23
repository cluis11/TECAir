import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowRight, FaPlus, FaTrash, FaUser } from 'react-icons/fa';

// Lógica de cobro 
const calcularCostoMaletas = (cantidad) => {
  if (cantidad <= 1) return 0;
  if (cantidad === 2) return 50;
  return 50 + (cantidad - 2) * 75;
};

// ID DE MALETA SE GENERA RANDOM, HAY QUE VER SI CAMBIARLO O NO
const generarNumeroMaleta = () => {
  return 'MAL-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
};

const SeleccionEquipaje = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // DATOS DE PRUEBA
  const { reserva, asientosVuelo1, asientosVuelo2 } = location.state || {
    reserva: { 
      vuelo: 'AT-402', 
      cantPasajeros: 2,
      pasajeros: [
        { nombreCompleto: 'Carlos Mendoza' },
        { nombreCompleto: 'Ana Gómez' }
      ]
    },
    asientosVuelo1: ['1A', '1B'],
    asientosVuelo2: null
  };

  const totalPasajeros = parseInt(reserva?.cantPasajerosComprados || reserva?.cantPasajeros, 10) || 1;

  const obtenerNombrePasajero = (index) => {
    const p = reserva?.pasajeros?.[index];
    if (!p) return `Pasajero ${index + 1}`;
    return p?.nombreCompleto || `${p?.nombre || ''} ${p?.apellido || ''}`.trim() || `Pasajero ${index + 1}`;
  };

  const [equipajePasajeros, setEquipajePasajeros] = useState(() =>
    Array.from({ length: totalPasajeros }, () => ({ maletasBodega: [] }))
  );

  const [pasajeroActivo, setPasajeroActivo] = useState(0);

  const agregarMaleta = (indexPasajero) => {
    setEquipajePasajeros(prev => prev.map((p, i) => {
      if (i !== indexPasajero) return p;
      return {
        ...p,
        maletasBodega: [
          ...p.maletasBodega,
          { id: Date.now(), numeroMaleta: generarNumeroMaleta(), peso: '', color: '' }
        ]
      };
    }));
  };

  const eliminarMaleta = (indexPasajero, maletaId) => {
    setEquipajePasajeros(prev => prev.map((p, i) => {
      if (i !== indexPasajero) return p;
      return { ...p, maletasBodega: p.maletasBodega.filter(m => m.id !== maletaId) };
    }));
  };

  const actualizarMaleta = (indexPasajero, maletaId, campo, valor) => {
    setEquipajePasajeros(prev => prev.map((p, i) => {
      if (i !== indexPasajero) return p;
      return {
        ...p,
        maletasBodega: p.maletasBodega.map(m => m.id !== maletaId ? m : { ...m, [campo]: valor })
      };
    }));
  };

  const calcularTotalGeneral = () => {
    return equipajePasajeros.reduce((total, p) => total + calcularCostoMaletas(p.maletasBodega.length), 0);
  };

  const handleContinuar = () => {
    const incompletos = equipajePasajeros.some(p =>
      p.maletasBodega.some(m => !m.peso?.trim() || !m.color?.trim())
    );
   if (incompletos) {
      alert("Por favor complete los datos de las maletas.");
      return;
    }

    const equipajeConNombres = equipajePasajeros.map((item, index) => ({
      ...item,
      pasajero: obtenerNombrePasajero(index),
      asiento: asientosVuelo1?.[index] || 'N/A',
      costoMaletas: calcularCostoMaletas(item.maletasBodega.length)
    }));

    navigate('/check-in/resumen', {
      state: { reserva, asientosVuelo1, asientosVuelo2, equipajeAsignado: equipajeConNombres, totalEquipaje: calcularTotalGeneral() }
    });
  };

  const pasajeroActual = equipajePasajeros[pasajeroActivo];
  const cantMaletas = pasajeroActual.maletasBodega.length;
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

            {/* Selector de pasajero */}
            <div className="bg-white p-3 rounded-3 border mb-4 shadow-sm">
              <label className="form-label fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <FaUser className="text-primary" /> Pasajero asignado:
              </label>
              <select
                className="form-select border-primary fw-semibold"
                value={pasajeroActivo}
                onChange={(e) => setPasajeroActivo(Number(e.target.value))}
              >
                {equipajePasajeros.map((p, index) => (
                  <option key={index} value={index}>
                    {obtenerNombrePasajero(index)} — {p.maletasBodega.length} maleta(s) · ${calcularCostoMaletas(p.maletasBodega.length)}
                  </option>
                ))}
              </select>
            </div>

            {/* Info del pasajero activo */}
            <div className="alert alert-primary border-0 rounded-3 py-2 px-3 mb-3 d-flex justify-content-between align-items-center">
              <div>
                <small className="text-uppercase fw-bold opacity-75" style={{ fontSize: '0.75rem' }}>Pasajero:</small>
                <h5 className="fw-bold mb-0">{obtenerNombrePasajero(pasajeroActivo)}</h5>
              </div>
              <div className="text-end">
                <small className="opacity-75">Cargo adicional</small>
                <h4 className="fw-bold mb-0">${costoPasajeroActivo}</h4>
              </div>
            </div>

            {/* Lista de maletas */}
            {pasajeroActual.maletasBodega.length === 0 ? (
              <div className="text-center py-4 border rounded-3 bg-white mb-3 text-muted">
                <p className="small mb-0">Sin maletas registradas — la primera es gratuita.</p>
              </div>
            ) : (
              pasajeroActual.maletasBodega.map((maleta, subIndex) => (
                <div key={maleta.id} className="p-3 bg-white border rounded-3 mb-3 shadow-sm">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <span className="fw-bold text-primary small d-flex align-items-center gap-2">
                       Maleta #{subIndex + 1}
                      {subIndex === 0 && <span className="badge bg-success ms-1">Gratis</span>}
                      {subIndex === 1 && <span className="badge bg-warning text-dark ms-1">+$50</span>}
                      {subIndex >= 2 && <span className="badge bg-danger ms-1">+$75</span>}
                    </span>
                    <button type="button" className="btn btn-sm btn-outline-danger border-0 p-1"
                      onClick={() => eliminarMaleta(pasajeroActivo, maleta.id)}>
                      <FaTrash size={14} />
                    </button>
                  </div>

                  <div className="row g-3">
                    {/* Número único de maleta */}
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary mb-1">Número de maleta :</label>
                      <label className="form-label small fw-semibold text-secondary mb-1">
                         {maleta.numeroMaleta}
                      </label>
                    </div>
                    {/* Peso */}
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary mb-1">Peso (kg):</label>
                      <input 
                        type="text"
                        className="form-control form-control-sm font-monospace"
                        value={maleta.peso}
                        onChange={(e) => actualizarMaleta(pasajeroActivo, maleta.id, 'peso', e.target.value)}
                        required/>
                    </div>
                    {/* Color */}
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-secondary mb-1">Color:</label>
                        <input type="text" className="form-control form-control-sm font-monospace"
                          value={maleta.color}
                          onChange={(e) => actualizarMaleta(pasajeroActivo, maleta.id, 'color', e.target.value)} 
                          required/>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Botón agregar maleta */}
            <button type="button"
              className="btn btn-outline-primary btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 mb-4 fw-bold"
              onClick={() => agregarMaleta(pasajeroActivo)}>
              <FaPlus size={12} />
              Agregar maleta a {obtenerNombrePasajero(pasajeroActivo).split(' ')[0]}
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

            <button onClick={handleContinuar}
              className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3">
              <span>Continuar al Resumen</span>
              <FaArrowRight />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionEquipaje;