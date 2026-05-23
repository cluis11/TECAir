import React, { useState, useEffect } from 'react';
import './forms.css';

const API_BASE = process.env.REACT_APP_API_URL;

const estadoInicialRuta = {
  idRuta: null,
  idOrigen: '',
  idDestino: '',
  precio: '',
  vuelos: []
};

const estadoInicialVuelo = {
  idOrigen: '',
  idDestino: '',
  matricula: ''
};

const GestionRutas = () => {
  const [ruta, setRuta] = useState(estadoInicialRuta);
  const [rutas, setRutas] = useState([]);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [aviones, setAviones] = useState([]);
  const [rutaExpandida, setRutaExpandida] = useState(null);
  const [nuevoVuelo, setNuevoVuelo] = useState(estadoInicialVuelo);
  const [mostrarFormVuelo, setMostrarFormVuelo] = useState(null);

  const modoEdicion = ruta.idRuta !== null;

  // Si hay origen seleccionado y no hay tramos, agregar el primer tramo fijo
  const esprimerTramo = ruta.vuelos.length === 0;

  useEffect(() => {
    fetchRutas();
    fetchAeropuertos();
    fetchAviones();
  }, []);

  // Cuando cambia el origen de la ruta, resetear tramos
  useEffect(() => {
    if (!modoEdicion) {
      setRuta(prev => ({ ...prev, vuelos: [] }));
      setNuevoVuelo(prev => ({ ...prev, idOrigen: ruta.idOrigen, idDestino: '' }));
    }
  }, [ruta.idOrigen]);

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

  const fetchAviones = async () => {
    try {
      const res = await fetch(`${API_BASE}/aeropuerto/aviones`);
      const data = await res.json();
      setAviones(data);
    } catch (error) {
      console.error('Error al cargar aviones:', error);
    }
  };

  const getNombreAeropuerto = (id) => {
    const a = aeropuertos.find(a => a.id_aeropuerto === parseInt(id));
    return a ? `${a.ciudad} (${a.codigo})` : `ID ${id}`;
  };

  const handleAgregarTramo = () => {
    if (!nuevoVuelo.idDestino || !nuevoVuelo.matricula) {
      alert('Complete destino y avion del tramo antes de agregar.');
      return;
    }
    // El origen del primer tramo es siempre el origen de la ruta
    const origenTramo = espimerTramo ? ruta.idOrigen : nuevoVuelo.idOrigen;
    setRuta(prev => ({
      ...prev,
      vuelos: [...prev.vuelos, { idOrigen: origenTramo, idDestino: nuevoVuelo.idDestino, matricula: nuevoVuelo.matricula }]
    }));
    // El origen del siguiente tramo es el destino del tramo recién agregado
    setNuevoVuelo({ idOrigen: nuevoVuelo.idDestino, idDestino: '', matricula: '' });
  };

  const handleEliminarTramo = (index) => {
    setRuta(prev => {
      const nuevosVuelos = prev.vuelos.filter((_, i) => i !== index);
      // Resetear origen del form al destino del último tramo restante, o al origen de la ruta
      const nuevoOrigen = nuevosVuelos.length > 0
        ? nuevosVuelos[nuevosVuelos.length - 1].idDestino
        : prev.idOrigen;
      setNuevoVuelo({ idOrigen: nuevoOrigen, idDestino: '', matricula: '' });
      return { ...prev, vuelos: nuevosVuelos };
    });
  };

  const handleCancelar = () => {
    setRuta(estadoInicialRuta);
    setNuevoVuelo(estadoInicialVuelo);
  };

  const handleEditar = (r) => {
    setRuta({
      idRuta: r.id_ruta,
      idOrigen: r.id_origen,
      idDestino: r.id_destino,
      precio: r.precio,
      vuelos: []
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleEliminarRuta = async (idRuta) => {
    if (!window.confirm('¿Seguro que desea eliminar esta ruta? Se eliminarán todos sus vuelos, itinerarios y promociones asociadas.')) return;
    try {
      const res = await fetch(`${API_BASE}/ruta/${idRuta}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Ruta eliminada con exito.');
        fetchRutas();
        if (rutaExpandida === idRuta) setRutaExpandida(null);
      } else if (res.status === 404) {
        alert('Ruta no encontrada.');
      } else {
        alert('Ocurrio un error inesperado. Intente de nuevo.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  const handleEliminarVuelo = async (idVuelo) => {
    if (!window.confirm('¿Seguro que desea eliminar este vuelo? Se cerrarán todos sus itinerarios.')) return;
    try {
      const res = await fetch(`${API_BASE}/ruta/vuelo/${idVuelo}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Vuelo eliminado con exito.');
        fetchRutas();
      } else if (res.status === 404) {
        alert('Vuelo no encontrado.');
      } else {
        alert('Ocurrio un error inesperado. Intente de nuevo.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  const handleAgregarVueloExistente = async (idRuta) => {
    if (!nuevoVuelo.idOrigen || !nuevoVuelo.idDestino || !nuevoVuelo.matricula) {
      alert('Complete todos los campos del tramo.');
      return;
    }
    try {
      const body = {
        id_origen: parseInt(nuevoVuelo.idOrigen),
        id_destino: parseInt(nuevoVuelo.idDestino),
        matricula: nuevoVuelo.matricula
      };
      const res = await fetch(`${API_BASE}/ruta/${idRuta}/vuelo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        alert('Vuelo agregado con exito.');
        setNuevoVuelo(estadoInicialVuelo);
        setMostrarFormVuelo(null);
        fetchRutas();
      } else {
        alert('Ocurrio un error inesperado. Intente de nuevo.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!modoEdicion && ruta.vuelos.length === 0) {
      alert('Agregue al menos un tramo a la ruta.');
      return;
    }

    try {
      if (modoEdicion) {
        const body = {
          id_origen: parseInt(ruta.idOrigen),
          id_destino: parseInt(ruta.idDestino),
          precio: parseFloat(ruta.precio),
          vuelos: []
        };
        const res = await fetch(`${API_BASE}/ruta/${ruta.idRuta}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          alert('Ruta actualizada con exito.');
          setRuta(estadoInicialRuta);
          fetchRutas();
        } else if (res.status === 404) {
          alert('Ruta no encontrada.');
        } else {
          alert('Ocurrio un error inesperado. Intente de nuevo.');
        }
      } else {
        const body = {
          id_origen: parseInt(ruta.idOrigen),
          id_destino: parseInt(ruta.idDestino),
          precio: parseFloat(ruta.precio),
          vuelos: ruta.vuelos.map(v => ({
            id_origen: parseInt(v.idOrigen),
            id_destino: parseInt(v.idDestino),
            matricula: v.matricula
          }))
        };
        const res = await fetch(`${API_BASE}/ruta`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          alert('Ruta creada con exito.');
          setRuta(estadoInicialRuta);
          setNuevoVuelo(estadoInicialVuelo);
          fetchRutas();
        } else if (res.status === 400) {
          alert('Datos invalidos. Verifique los campos ingresados.');
        } else {
          alert('Ocurrio un error inesperado. Intente de nuevo.');
        }
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  // typo fix
  const espimerTramo = ruta.vuelos.length === 0;
  // Si el último tramo ya llega al destino final, no se pueden agregar más
  const tramoCompleto = ruta.vuelos.length > 0 && 
    String(ruta.vuelos[ruta.vuelos.length - 1].idDestino) === String(ruta.idDestino);

  return (
    <div className="form-container">

      {/* TABLA DE RUTAS */}
      <h2 className="mb-1">Gestión de Rutas</h2>
      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
        Administre las rutas y vuelos de AIRTec.
      </p>

      {rutas.length === 0 ? (
        <div className="alert alert-info mb-4">No hay rutas registradas.</div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Origen</th>
                <th>Destino</th>
                <th>Precio (USD)</th>
                <th>Tramos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rutas.map(r => (
                <React.Fragment key={r.id_ruta}>
                  <tr>
                    <td className="fw-semibold">{getNombreAeropuerto(r.id_origen)}</td>
                    <td className="fw-semibold">{getNombreAeropuerto(r.id_destino)}</td>
                    <td>${r.precio}</td>
                    <td>
                      <span
                        className="badge bg-primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setRutaExpandida(rutaExpandida === r.id_ruta ? null : r.id_ruta)}
                      >
                        {r.vuelos?.length || 0} vuelo(s) {rutaExpandida === r.id_ruta ? '▲' : '▼'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditar(r)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminarRuta(r.id_ruta)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>

                  {rutaExpandida === r.id_ruta && (
                    <tr>
                      <td colSpan="5" className="bg-light p-3">
                        <h6 className="fw-bold text-secondary mb-2">Tramos de la ruta</h6>
                        {r.vuelos?.length === 0 ? (
                          <p className="text-muted small">Sin tramos registrados.</p>
                        ) : (
                          <table className="table table-sm table-bordered mb-3">
                            <thead className="table-secondary">
                              <tr>
                                <th>Origen</th>
                                <th>Destino</th>
                                <th>Matricula</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {r.vuelos?.map(v => (
                                <tr key={v.id_vuelo}>
                                  <td>{getNombreAeropuerto(v.id_origen)}</td>
                                  <td>{getNombreAeropuerto(v.id_destino)}</td>
                                  <td>{v.matricula}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleEliminarVuelo(v.id_vuelo)}
                                    >
                                      Eliminar
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {mostrarFormVuelo === r.id_ruta ? (
                          <div className="border rounded p-3 bg-white">
                            <h6 className="fw-bold mb-3">Agregar tramo</h6>
                            <div className="row g-2 mb-2">
                              <div className="col-12 col-md-4">
                                <label className="form-label small fw-semibold">Origen</label>
                                <select
                                  className="form-select form-select-sm"
                                  value={nuevoVuelo.idOrigen}
                                  onChange={e => setNuevoVuelo(prev => ({ ...prev, idOrigen: e.target.value }))}
                                >
                                  <option value="">-- Origen --</option>
                                  {aeropuertos.map(a => (
                                    <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                                      {a.ciudad} ({a.codigo})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-12 col-md-4">
                                <label className="form-label small fw-semibold">Destino</label>
                                <select
                                  className="form-select form-select-sm"
                                  value={nuevoVuelo.idDestino}
                                  onChange={e => setNuevoVuelo(prev => ({ ...prev, idDestino: e.target.value }))}
                                >
                                  <option value="">-- Destino --</option>
                                  {aeropuertos.map(a => (
                                    <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                                      {a.ciudad} ({a.codigo})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-12 col-md-4">
                                <label className="form-label small fw-semibold">Avion</label>
                                <select
                                  className="form-select form-select-sm"
                                  value={nuevoVuelo.matricula}
                                  onChange={e => setNuevoVuelo(prev => ({ ...prev, matricula: e.target.value }))}
                                >
                                  <option value="">-- Avion --</option>
                                  {aviones.map(a => (
                                    <option key={a.matricula} value={a.matricula}>
                                      {a.matricula} ({a.capacidad} asientos)
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-primary" onClick={() => handleAgregarVueloExistente(r.id_ruta)}>
                                Guardar tramo
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => { setMostrarFormVuelo(null); setNuevoVuelo(estadoInicialVuelo); }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => { setMostrarFormVuelo(r.id_ruta); setNuevoVuelo(estadoInicialVuelo); }}
                          >
                            + Agregar tramo
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORMULARIO CREAR / EDITAR */}
      <h2 className="mb-1">{modoEdicion ? 'Editar Ruta' : 'Crear Nueva Ruta'}</h2>

      {modoEdicion && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center py-2 mb-3">
          <span>Editando ruta <strong>#{ruta.idRuta}</strong> — solo se puede modificar origen, destino y precio.</span>
          <button className="btn btn-sm btn-outline-danger" onClick={handleCancelar}>
            Cancelar edicion
          </button>
        </div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>

        {/* Origen */}
        <div className="input-field">
          <label>Aeropuerto de Origen</label>
          <select
            value={ruta.idOrigen}
            onChange={e => setRuta(prev => ({ ...prev, idOrigen: e.target.value }))}
            required
          >
            <option value="">-- Seleccione origen --</option>
            {aeropuertos.map(a => (
              <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                {a.ciudad} ({a.codigo})
              </option>
            ))}
          </select>
        </div>

        {/* Destino */}
        <div className="input-field">
          <label>Aeropuerto de Destino Final</label>
          <select
            value={ruta.idDestino}
            onChange={e => setRuta(prev => ({ ...prev, idDestino: e.target.value }))}
            required
          >
            <option value="">-- Seleccione destino --</option>
            {aeropuertos.map(a => (
              <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                {a.ciudad} ({a.codigo})
              </option>
            ))}
          </select>
        </div>

        {/* Precio */}
        <div className="input-field" style={{ gridColumn: 'span 2' }}>
          <label>Precio Base (USD)</label>
          <input
            type="number"
            value={ruta.precio}
            onChange={e => setRuta(prev => ({ ...prev, precio: e.target.value }))}
            placeholder="Ej: 250.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Tramos — solo al crear */}
        {!modoEdicion && (
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '12px' }}>
              Tramos del Vuelo
            </label>

            {ruta.vuelos.length > 0 && (
              <div className="table-responsive mb-3">
                <table className="table table-sm table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Origen</th>
                      <th>Destino</th>
                      <th>Avion</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ruta.vuelos.map((v, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{getNombreAeropuerto(parseInt(v.idOrigen))}</td>
                        <td>{getNombreAeropuerto(parseInt(v.idDestino))}</td>
                        <td>{v.matricula}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleEliminarTramo(i)}
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Form agregar tramo */}
            {ruta.idOrigen && !tramoCompleto && (
              <div className="border rounded p-3 bg-light mb-3">
                <h6 className="fw-bold mb-3 text-secondary">
                  {espimerTramo ? 'Primer tramo (origen fijo)' : `Tramo ${ruta.vuelos.length + 1}`}
                </h6>
                <div className="row g-2 mb-2">
                  {/* Origen — fijo en primer tramo */}
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Origen</label>
                    <select
                      className="form-select form-select-sm"
                      value={espimerTramo ? ruta.idOrigen : nuevoVuelo.idOrigen}
                      disabled={espimerTramo}
                      onChange={e => setNuevoVuelo(prev => ({ ...prev, idOrigen: e.target.value }))}
                    >
                      <option value="">-- Origen --</option>
                      {aeropuertos.map(a => (
                        <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                          {a.ciudad} ({a.codigo})
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Destino */}
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Destino</label>
                    <select
                      className="form-select form-select-sm"
                      value={nuevoVuelo.idDestino}
                      onChange={e => setNuevoVuelo(prev => ({ ...prev, idDestino: e.target.value }))}
                    >
                      <option value="">-- Destino --</option>
                      {aeropuertos.map(a => (
                        <option key={a.id_aeropuerto} value={a.id_aeropuerto}>
                          {a.ciudad} ({a.codigo})
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Avion */}
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">Avion</label>
                    <select
                      className="form-select form-select-sm"
                      value={nuevoVuelo.matricula}
                      onChange={e => setNuevoVuelo(prev => ({ ...prev, matricula: e.target.value }))}
                    >
                      <option value="">-- Avion --</option>
                      {aviones.map(a => (
                        <option key={a.matricula} value={a.matricula}>
                          {a.matricula} ({a.capacidad} asientos)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleAgregarTramo}
                >
                  + Agregar tramo
                </button>
              </div>
            )}

            {!ruta.idOrigen && (
              <div className="alert alert-warning py-2 small">
                Seleccione primero el aeropuerto de origen para agregar tramos.
              </div>
            )}
            {ruta.idOrigen && tramoCompleto && (
              <div className="alert alert-success py-2 small">
                La ruta esta completa — el ultimo tramo llega al destino final.
              </div>
            )}
          </div>
        )}

        <button type="submit" className="btn-save">
          {modoEdicion ? 'Actualizar Ruta' : 'Guardar Ruta'}
        </button>

      </form>
    </div>
  );
};

export default GestionRutas;