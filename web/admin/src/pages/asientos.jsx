import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {FaArrowRight, FaPlane } from 'react-icons/fa';

const SeleccionAsientos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // tramoActual: 1 = Primer tramo, 2 = Segundo tramo (si hay conexión)
  const [tramoActual, setTramoActual] = useState(1);
  const [asientosTramo1, setAsientosTramo1] = useState([]);
  const [asientosTramo2, setAsientosTramo2] = useState([]);

  const { reserva } = location.state || { };
  //Bloqueo si no hay reserva
  useEffect(() => {
    if (!reserva) {
      navigate('/admin');
    }
  }, [reserva, navigate]);
  if (!reserva) return null;

  // DATOS PRUEBA ASIENTOS
  const TOTAL_FILAS = 12; 
  const COLUMNAS = ['A', 'B', 'C', 'D', 'E', 'F']; 
  const asientosOcupadosSimulados = ['1C', '2A', '2F', '4D', '7B', '9C', '10E'];

  // Definir las etiquetas de origen y destino del tramo actual
  const origenTramo = tramoActual === 1 ? reserva.origen : reserva.escalas;
  const destinoTramo = tramoActual === 1 && reserva.tieneEscala ? reserva.escalas : reserva.destino;

  // limitar seleccion de asiento
  const toggleAsiento = (id) => {
    if (asientosOcupadosSimulados.includes(id)) return; 
    if (tramoActual === 1) {
      if (asientosTramo1.includes(id)) {
        setAsientosTramo1(asientosTramo1.filter(a => a !== id));
      } else {
        if (asientosTramo1.length >= reserva.cantPasajerosComprados) {
          alert(`Su reserva solo permite asignar ${reserva.cantPasajerosComprados} asiento(s).`);
          return;
        }
        setAsientosTramo1([...asientosTramo1, id]);
      }
    } else {
      if (asientosTramo2.includes(id)) {
        setAsientosTramo2(asientosTramo2.filter(a => a !== id));
      } else {
        if (asientosTramo2.length >= reserva.cantPasajerosComprados) {
          alert(`Su reserva solo permite asignar ${reserva.cantPasajerosComprados} asiento(s).`);
          return;
        }
        setAsientosTramo2([...asientosTramo2, id]);
      }
    }
  };
  // Lógica del boton
  const handleContinuarFlujo = () => {
  const asientosActuales = tramoActual === 1 ? asientosTramo1 : asientosTramo2;
  const limitePasajeros = reserva.cantPasajerosComprados || reserva.cantPasajeros;

  if (asientosActuales.length !== limitePasajeros) {
    alert(`Debe asignar un asiento a cada uno de los ${limitePasajeros} pasajeros.`);
    return;
  }
  
  if (reserva.tieneEscala && tramoActual === 1) {
    alert(`Asientos guardados para el tramo ${reserva.origen} ➔ ${reserva.escalas}.\nProcedamos a elegir los asientos para el tramo ${reserva.escalas} ➔ ${reserva.destino}.`);
    setTramoActual(2);
    return;
  }

  // Unir asientos y pasajeros 
  const pasajerosConAsiento = (reserva.pasajeros || []).map((pasajero, index) => {
    return {
      ...pasajero,
      asientoTramo1: asientosTramo1[index] || null,
      asientoTramo2: reserva.tieneEscala ? (asientosTramo2[index] || null) : null
    };
  });

  navigate('/check-in/maleta', { 
    state: { 
      reserva: {
        ...reserva,
        cantPasajeros: limitePasajeros,
        pasajeros: pasajerosConAsiento 
      }
    } 
  });
};

  // Renderizar un asiento
  const renderAsiento = (letra, numFila) => {
    const asientoId = `${numFila}${letra}`;
    const estaOcupado = asientosOcupadosSimulados.includes(asientoId);
    const estaSeleccionado = tramoActual === 1
      ? asientosTramo1.includes(asientoId)
      : asientosTramo2.includes(asientoId);

    let claseBtn = 'btn btn-outline-secondary';
    if (estaOcupado) claseBtn = 'btn btn-dark';
    if (estaSeleccionado) claseBtn = 'btn btn-primary';

    return (
      <button
        key={asientoId}
        type="button"
        onClick={() => toggleAsiento(asientoId)}
        className={claseBtn}
        disabled={estaOcupado}
        style={{ width: '38px', height: '38px', fontSize: '9px', padding: 0, borderRadius: '6px 6px 2px 2px' }}
      >
        {asientoId}
      </button>
    );
  };

  const renderFila = (numFila) => (
    <div key={numFila} className="d-flex align-items-center justify-content-center mb-2 gap-1">
      <small className="text-muted me-1" style={{ width: '16px', textAlign: 'right' }}>{numFila}</small>
      <div className="d-flex gap-1">
        {COLUMNAS.slice(0, 3).map((letra) => renderAsiento(letra, numFila))}
      </div>
      <div style={{ width: '24px' }} />
      <div className="d-flex gap-1">
        {COLUMNAS.slice(3, 6).map((letra) => renderAsiento(letra, numFila))}
      </div>
      <small className="text-muted ms-1" style={{ width: '16px' }}>{numFila}</small>
    </div>
  );

  const asientosActuales = tramoActual === 1 ? asientosTramo1 : asientosTramo2;

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container" style={{ maxWidth: '560px' }}>

        {/* Tarjeta principal */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

          {/* Header azul */}
          <div className="bg-primary text-white text-center py-4 px-3">
            <h4 className="fw-bold mb-1">Selección de Asientos</h4>
            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <FaPlane />
              <span className="fw-semibold">{origenTramo} ➔ {destinoTramo}</span>
            </div>
            <small className="opacity-75">Vuelo: {reserva.vuelo}</small>
          </div>

          <div className="card-body px-4 py-3">

            {/* Estado de asientos */}
            <div className="d-flex justify-content-center gap-3 mb-3">
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
            </div>

            {/* Progreso */}
            <div className="alert alert-info text-center py-2 mb-3 fw-bold">
              Asignados {asientosActuales.length} de {reserva.cantPasajerosComprados} asientos
            </div>

            {/* Cabina del avión */}
            <div className="border rounded-4 overflow-hidden mb-3" style={{ background: '#f8fafc' }}>

              {/* Techo */}
              <div className="text-center py-2 bg-secondary text-white fw-bold small">
                ▲ CREW MEMBERS AREA ▲
              </div>

              {/* Letras de columnas */}
              <div className="d-flex justify-content-center align-items-center gap-1 py-2">
                <div style={{ width: '24px' }} />
                {['A','B','C'].map(l => (
                  <div key={l} style={{ width: '38px', textAlign: 'center' }}>
                    <small className="fw-bold text-muted">{l}</small>
                  </div>
                ))}
                <div style={{ width: '24px' }} />
                {['D','E','F'].map(l => (
                  <div key={l} style={{ width: '38px', textAlign: 'center' }}>
                    <small className="fw-bold text-muted">{l}</small>
                  </div>
                ))}
                <div style={{ width: '24px' }} />
              </div>

              {/* Asientos */}
              <div className="px-3 pb-3">
                {Array.from({ length: TOTAL_FILAS }, (_, i) => i + 1).map(renderFila)}
              </div>
            </div>

            {/* Botón continuar */}
            <button
              onClick={handleContinuarFlujo}
              className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              <span>Siguiente</span>
              <FaArrowRight />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionAsientos;