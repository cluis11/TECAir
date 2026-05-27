import React, { useState, useEffect } from 'react';
import './forms.css';

const API_BASE = process.env.REACT_APP_API_URL;

const AperturaVuelos = () => {

  const [rutas, setRutas] = useState([]);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [puertas, setPuertas] = useState({});
  const [tramosForm, setTramosForm] = useState([]);
  const [vistaActiva, setVistaActiva] = useState('apertura');
  const [rutaCierre, setRutaCierre] = useState('');
  const [itinerariosAbiertos, setItinerariosAbiertos] = useState([]);
  const [resumenCierre, setResumenCierre] = useState(null);

  useEffect(() => {
    fetchRutas();
    fetchAeropuertos();
  }, []);

  const fetchRutas = async () => {
    try {
      const res = await fetch(`${API_BASE}/ruta`);
      const data = await res.json();
      setRutas(data);
    } catch (error) {
      console.error('Error al cargar rutas:', error);
    }
  };

  const fetchAeropuertos = async () => {
    try {
      const res = await fetch(`${API_BASE}/aeropuerto`);
      const data = await res.json();
      setAeropuertos(data);
    } catch (error) {
      console.error('Error al cargar aeropuertos:', error);
    }
  };

  const fetchPuertas = async (idAeropuerto) => {
    if (puertas[idAeropuerto]) return;
    try {
      const res = await fetch(`${API_BASE}/aeropuerto/${idAeropuerto}/puertas`);
      const data = await res.json();
      setPuertas(prev => ({ ...prev, [idAeropuerto]: data }));
    } catch (error) {
      console.error('Error al cargar puertas:', error);
    }
  };

  const getNombreAeropuerto = (id) => {
    const a = aeropuertos.find(a => a.id_aeropuerto === id);
    return a ? `${a.ciudad} (${a.codigo})` : `ID ${id}`;
  };

  const handleSeleccionarRuta = async (e) => {
    const idRuta = parseInt(e.target.value);
    const ruta = rutas.find(r => r.id_ruta === idRuta);
    if (!ruta) { setRutaSeleccionada(null); setTramosForm([]); return; }

    setRutaSeleccionada(ruta);
    const forms = ruta.vuelos.map(v => ({
      idVuelo: v.id_vuelo,
      idOrigen: v.id_origen,
      idDestino: v.id_destino,
      fecha: '',
      salida: '',
      llegada: '',
      puertaEmbarque: ''
    }));
    setTramosForm(forms);

    for (const v of ruta.vuelos) {
      await fetchPuertas(v.id_origen);
    }
  };

  const handleTramoChange = (index, campo, valor) => {
    const nuevos = [...tramosForm];
    nuevos[index][campo] = valor;
    setTramosForm(nuevos);
  };

  const handleSubmitApertura = async (e) => {
    e.preventDefault();
    const body = {
      IdRuta: rutaSeleccionada.id_ruta,
      Vuelos: tramosForm.map(t => ({
        IdVuelo: t.idVuelo,
        Fecha: t.fecha,
        Salida: t.salida,
        Llegada: t.llegada,
        PuertaEmbarque: t.puertaEmbarque
      }))
    };
    try {
      const res = await fetch(`${API_BASE}/itinerario/abrir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('Vuelos abiertos con éxito.');
        setRutaSeleccionada(null);
        setTramosForm([]);
      } else if (res.status === 400) {
        alert('Datos inválidos. Verifique los horarios y puertas.');
      } else {
        alert('Ocurrió un error inesperado. Intente de nuevo.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
    }
  };

  const handleBuscarItinerarios = async (e) => {
    e.preventDefault();
    if (!rutaCierre) return;
    try {
      const res = await fetch(`${API_BASE}/itinerario/abiertos?idRuta=${rutaCierre}`);
      const data = await res.json();
      const itinerarios = data.map(it => ({
        idItinerario:   it.idItinerario,
        ciudadOrigen:   it.ciudadOrigen,
        ciudadDestino:  it.ciudadDestino,
        fecha:          it.fecha,
        salida:         it.salida,
        llegada:        it.llegada,
        puerta:         it.puertaEmbarque,
        asientosLibres: it.asientosLibres
      }));
      setItinerariosAbiertos(itinerarios);
      if (itinerarios.length === 0) alert('No hay itinerarios abiertos para esta ruta.');
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  const handleCerrar = async (idItinerario) => {
    if (!window.confirm('¿Seguro que desea cerrar este itinerario?')) return;
    try {
      const res = await fetch(`${API_BASE}/itinerario/cerrar/${idItinerario}`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setResumenCierre(data);
        setItinerariosAbiertos(prev => prev.filter(i => i.idItinerario !== idItinerario));
      } else {
        alert('Ocurrió un error inesperado. Intente de nuevo.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="form-container">

      {/* Tabs */}
      <div className="d-flex gap-3 mb-4">
        <button
          type="button"
          className={`btn ${vistaActiva === 'apertura' ? 'btn-primary' : 'btn-outline-primary'} fw-bold px-4`}
          onClick={() => setVistaActiva('apertura')}
        >
          Apertura de Vuelos
        </button>
        <button
          type="button"
          className={`btn ${vistaActiva === 'cierre' ? 'btn-primary' : 'btn-outline-primary'} fw-bold px-4`}
          onClick={() => setVistaActiva('cierre')}
        >
          Cierre de Vuelos
        </button>
      </div>

      {/* ====== APERTURA ====== */}
      {vistaActiva === 'apertura' && (
        <>
          <h2>Apertura de Vuelos</h2>
          <p style={{ color: '#8892b0', fontSize: '0.9rem', marginBottom: '25px' }}>
            Seleccione una ruta y asigne fecha, horarios y puerta de embarque a cada tramo.
          </p>

          <form className="form-grid" onSubmit={handleSubmitApertura}>

            <div className="input-field" style={{ gridColumn: 'span 2' }}>
              <label>Ruta</label>
              <select onChange={handleSeleccionarRuta} required defaultValue="">
                <option value="">-- Seleccione una ruta --</option>
                {rutas.map(r => (
                  <option key={r.id_ruta} value={r.id_ruta}>
                    {getNombreAeropuerto(r.id_origen)} → {getNombreAeropuerto(r.id_destino)} · ${r.precio}
                  </option>
                ))}
              </select>
            </div>

            {tramosForm.map((tramo, index) => (
              <React.Fragment key={tramo.idVuelo}>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '4px' }}>
                  <p style={{ fontWeight: '700', color: '#0d6efd', marginBottom: '0', fontSize: '0.9rem' }}>
                    Tramo {index + 1} — {getNombreAeropuerto(tramo.idOrigen)} → {getNombreAeropuerto(tramo.idDestino)}
                  </p>
                </div>

                <div className="input-field">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={tramo.fecha}
                    onChange={e => handleTramoChange(index, 'fecha', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="input-field">
                  <label>Puerta de Embarque</label>
                  <select
                    value={tramo.puertaEmbarque}
                    onChange={e => handleTramoChange(index, 'puertaEmbarque', e.target.value)}
                    required
                  >
                    <option value="">-- Seleccione puerta --</option>
                    {(puertas[tramo.idOrigen] || []).map(p => (
                      <option key={p.puertaEmbarque} value={p.puertaEmbarque}>
                        {p.puertaEmbarque}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-field">
                  <label>Hora de Salida</label>
                  <input
                    type="time"
                    value={tramo.salida}
                    onChange={e => handleTramoChange(index, 'salida', e.target.value)}
                    required
                  />
                </div>

                <div className="input-field">
                  <label>Hora de Llegada</label>
                  <input
                    type="time"
                    value={tramo.llegada}
                    onChange={e => handleTramoChange(index, 'llegada', e.target.value)}
                    required
                  />
                </div>
              </React.Fragment>
            ))}

            {rutaSeleccionada && (
              <button type="submit" className="btn-save">
                Abrir Vuelos
              </button>
            )}

          </form>
        </>
      )}

      {/* ====== CIERRE ====== */}
      {vistaActiva === 'cierre' && (
        <>
          <h2>Cierre de Vuelos</h2>
          <p style={{ color: '#8892b0', fontSize: '0.9rem', marginBottom: '25px' }}>
            Seleccione una ruta para ver sus itinerarios abiertos y cerrarlos manualmente.
          </p>

          <form className="form-grid" onSubmit={handleBuscarItinerarios}>
            <div className="input-field" style={{ gridColumn: 'span 2' }}>
              <label>Ruta</label>
              <select
                value={rutaCierre}
                onChange={e => { setRutaCierre(e.target.value); setItinerariosAbiertos([]); }}
                required
              >
                <option value="">-- Seleccione una ruta --</option>
                {rutas.map(r => (
                  <option key={r.id_ruta} value={r.id_ruta}>
                    {getNombreAeropuerto(r.id_origen)} → {getNombreAeropuerto(r.id_destino)}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-save">
              Buscar Itinerarios
            </button>
          </form>

          {itinerariosAbiertos.length > 0 && (
            <div className="table-responsive mt-4">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Tramo</th>
                    <th>Fecha</th>
                    <th>Salida</th>
                    <th>Llegada</th>
                    <th>Puerta</th>
                    <th>Asientos libres</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {itinerariosAbiertos.map(it => (
                    <tr key={it.idItinerario}>
                      <td className="fw-semibold">{it.ciudadOrigen} → {it.ciudadDestino}</td>
                      <td>{it.fecha}</td>
                      <td>{it.salida?.substring(0, 5)}</td>
                      <td>{it.llegada?.substring(0, 5)}</td>
                      <td>{it.puerta}</td>
                      <td>{it.asientosLibres}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCerrar(it.idItinerario)}
                        >
                          Cerrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal Resumen de Cierre */}
      {resumenCierre && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
        >
          <div className="card border-0 shadow-lg rounded-4 p-4" style={{ width: '520px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <h4 className="fw-bold mb-1">Resumen de Cierre</h4>
            <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
              {resumenCierre.ciudadOrigen} → {resumenCierre.ciudadDestino} · {resumenCierre.fecha} · {resumenCierre.salida}
            </p>

            <div className="d-flex gap-3 mb-3">
              <div className="alert alert-primary py-2 px-3 mb-0 flex-grow-1 text-center">
                <div className="fw-bold fs-4">{resumenCierre.totalPasajeros}</div>
                <small>Pasajeros</small>
              </div>
              <div className="alert alert-success py-2 px-3 mb-0 flex-grow-1 text-center">
                <div className="fw-bold fs-4">{resumenCierre.totalMaletas}</div>
                <small>Maletas</small>
              </div>
            </div>

            <div className="table-responsive mb-3">
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Pasajero</th>
                    <th>Pasaporte</th>
                    <th className="text-center">Maletas</th>
                  </tr>
                </thead>
                <tbody>
                  {resumenCierre.pasajeros?.map((p, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{p.nombre}</td>
                      <td className="text-muted">{p.pasaporte}</td>
                      <td className="text-center">
                        <span className="badge bg-primary">{p.cantidadMaletas}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="btn btn-primary w-100 fw-bold"
              onClick={() => setResumenCierre(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AperturaVuelos;