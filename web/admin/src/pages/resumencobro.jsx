import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowRight, FaLuggageCart, FaUser, FaPlane, FaCheckCircle } from 'react-icons/fa';

const ResumenCobro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reserva, asientosVuelo1, asientosVuelo2, equipajeAsignado, totalEquipaje } = location.state || {};

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '650px' }}>
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

          {/* Header */}
          <div className="bg-success text-white text-center py-4 px-3">
            <FaCheckCircle size={32} className="mb-2" />
            <h4 className="fw-bold mb-1">Resumen del Check-in</h4>
            <small className="opacity-75">Vuelo {reserva.vuelo} · {reserva.origen} ➔ {reserva.destino}</small>
          </div>

          <div className="card-body px-4 py-3">

            {/* Detalle por pasajero */}
            <h6 className="fw-bold text-secondary text-uppercase mb-3" style={{ fontSize: '0.8rem' }}>
              Pasajeros y equipaje
            </h6>

            {equipajeAsignado.map((item, index) => (
              <div key={index} className="card border-0 bg-white shadow-sm rounded-3 mb-3 p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <FaUser className="text-primary" />
                    <div>
                      <span className="fw-bold text-dark">{item.pasajero}</span>
                      <small className="text-muted d-block">Asiento: {item.asiento}</small>
                    </div>
                  </div>
                  <span className={`badge ${item.costoMaletas > 0 ? 'bg-warning text-dark' : 'bg-success'}`}>
                    ${item.costoMaletas}
                  </span>
                </div>

                {/* Maletas del pasajero */}
                {item.maletasBodega.length === 0 ? (
                  <small className="text-muted">Sin maletas de bodega</small>
                ) : (
                  <div className="border-top pt-2 mt-1">
                    {item.maletasBodega.map((maleta, i) => (
                      <div key={maleta.id} className="d-flex align-items-center gap-2 mb-1">
                        <FaLuggageCart className="text-muted" size={12} />
                        <small>
                          <span className="font-monospace">{maleta.numeroMaleta}</span>
                          {' · '}{maleta.peso} kg{' · '}
                          <span
                            style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '2px', background: maleta.color, border: '1px solid #ccc', verticalAlign: 'middle' }}
                          />
                          {i === 0 && <span className="badge bg-success ms-1" style={{ fontSize: '0.65rem' }}>Gratis</span>}
                          {i === 1 && <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.65rem' }}>+$50</span>}
                          {i >= 2 && <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>+$75</span>}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Total */}
            <div className="card border-0 rounded-3 p-3 mb-4" style={{ background: '#f0f7ff' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small d-block">Cargo total por equipaje adicional</span>
                  <span className="fw-bold text-dark">
                    {totalEquipaje === 0 ? 'Sin cargos adicionales' : 'Total a cobrar'}
                  </span>
                </div>
                <h3 className="fw-bold text-primary mb-0">${totalEquipaje}</h3>
              </div>
            </div>

            {/* Botón continuar */}
            <button
              onClick={() => navigate('/check-in/pase', { state: { reserva, asientosVuelo1, asientosVuelo2, equipajeAsignado, totalEquipaje } })}
              className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3"
            >
              <FaPlane />
              <span>Generar Pase de Abordar</span>
              <FaArrowRight />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenCobro;