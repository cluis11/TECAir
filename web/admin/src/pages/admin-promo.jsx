import React, { useState, useEffect } from 'react';
import './forms.css';

const API_BASE = process.env.REACT_APP_API_URL;

const RegistroPromocion = ({ onExito }) => {

  const estadoInicialPromocion = {
    idPromo: null,
    idRuta: '',
    origen: '',
    destino: '',
    precioBase: '',
    porcentaje: '',
    precioOferta: '',
    fechaInicio: '',
    fechaFin: '',
    imagenUrl: ''
  };

  const [promocion, setPromocion] = useState(estadoInicialPromocion);
  const [rutas, setRutas] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [destinoTocado, setDestinoTocado] = useState(false);
  const modoEdicion = promocion.idPromo !== null;

  useEffect(() => {
    fetchRutas();
    fetchPromociones();
  }, []);

  const fetchRutas = async () => {
    try {
      const res = await fetch(`${API_BASE}/ruta/promo`);
      const data = await res.json();
      setRutas(data);
    } catch (error) {
      console.error('Error al cargar rutas:', error);
    }
  };

  const fetchPromociones = async () => {
    try {
      const res = await fetch(`${API_BASE}/promocion`);
      const data = await res.json();
      setPromociones(data);
    } catch (error) {
      console.error('Error al cargar promociones:', error);
    }
  };

  const origenesUnicos = [...new Set(rutas.map(r => r.ciudadOrigen))];
  const destinosUnicos = [...new Set(
    rutas.filter(r => r.ciudadOrigen === promocion.origen).map(r => r.ciudadDestino)
  )];
  const rutasFiltradas = rutas.filter(
    r => r.ciudadOrigen === promocion.origen && r.ciudadDestino === promocion.destino
  );
  const hayAmbiguedad = rutasFiltradas.length > 1;

  const labelRuta = (ruta) => {
    const tipo = ruta.cantidadVuelos === 1 ? 'Directo' : 'Con escalas';
    return `${tipo} · $${ruta.precio}`;
  };

  const getNombreRuta = (idRuta) => {
    const ruta = rutas.find(r => r.idRuta === idRuta);
    return ruta ? `${ruta.ciudadOrigen} → ${ruta.ciudadDestino}` : `Ruta #${idRuta}`;
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    return fechaStr.split('T')[0];
  };

  const handleOrigenChange = (e) => {
    setPromocion(prev => ({
      ...prev,
      origen: e.target.value,
      destino: '',
      idRuta: '',
      precioBase: '',
      porcentaje: '',
      precioOferta: ''
    }));
    setDestinoTocado(false);
  };

  const handleDestinoChange = (e) => {
    const ciudadDestino = e.target.value;
    const coincidentes = rutas.filter(
      r => r.ciudadOrigen === promocion.origen && r.ciudadDestino === ciudadDestino
    );
    setPromocion(prev => ({
      ...prev,
      destino: ciudadDestino,
      idRuta: coincidentes.length === 1 ? coincidentes[0].idRuta : '',
      precioBase: coincidentes.length === 1 ? coincidentes[0].precio : '',
      porcentaje: '',
      precioOferta: ''
    }));
  };

  const handleRutaEspecificaChange = (e) => {
    const idRuta = e.target.value;
    const ruta = rutasFiltradas.find(r => r.idRuta === parseInt(idRuta));
    setPromocion(prev => ({
      ...prev,
      idRuta,
      precioBase: ruta ? ruta.precio : '',
      porcentaje: '',
      precioOferta: ''
    }));
  };

  const handlePorcentajeChange = (e) => {
    const porcentaje = e.target.value;
    const oferta = porcentaje && promocion.precioBase
      ? (promocion.precioBase * (1 - porcentaje / 100)).toFixed(2)
      : '';
    setPromocion(prev => ({ ...prev, porcentaje, precioOferta: oferta }));
  };

  const handlePrecioOfertaChange = (e) => {
    const precioOferta = e.target.value;
    const porcentaje = precioOferta && promocion.precioBase
      ? (((promocion.precioBase - precioOferta) / promocion.precioBase) * 100).toFixed(2)
      : '';
    setPromocion(prev => ({ ...prev, precioOferta, porcentaje }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromocion(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelarEdicion = () => {
    setPromocion(estadoInicialPromocion);
    setDestinoTocado(false);
  };

  const handleEditar = (promo) => {
    const ruta = rutas.find(r => r.idRuta === promo.id_ruta);
    setPromocion({
      idPromo: promo.id_promo,
      idRuta: promo.id_ruta,
      origen: ruta ? ruta.ciudadOrigen : '',
      destino: ruta ? ruta.ciudadDestino : '',
      precioBase: ruta ? ruta.precio : '',
      porcentaje: promo.porcentaje,
      precioOferta: ruta ? (ruta.precio * (1 - promo.porcentaje / 100)).toFixed(2) : '',
      fechaInicio: formatFecha(promo.inicio),
      fechaFin: formatFecha(promo.fin),
      imagenUrl: promo.imagen ? `${API_BASE}${promo.imagen}` : ''
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleEliminar = async (idPromo) => {
    if (!window.confirm('¿Seguro que desea eliminar esta promocion?')) return;
    try {
      const res = await fetch(`${API_BASE}/promocion/${idPromo}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Promocion eliminada con exito.');
        fetchPromociones();
      } else if (res.status === 404) {
        alert('Promocion no encontrada.');
      } else if (res.status === 400) {
        alert('No se puede eliminar la promocion en este momento.');
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

    const body = {
      id_ruta: parseInt(promocion.idRuta),
      porcentaje: parseFloat(promocion.porcentaje),
      inicio: promocion.fechaInicio,
      fin: promocion.fechaFin,
      imagen: promocion.imagenUrl || null
    };

    try {
      const url = modoEdicion
        ? `${API_BASE}/promocion/${promocion.idPromo}`
        : `${API_BASE}/promocion`;
      const method = modoEdicion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(modoEdicion
          ? 'Promocion actualizada con exito.'
          : `Promocion creada con exito: ${promocion.origen} -> ${promocion.destino} - ${promocion.porcentaje}% de descuento`
        );
        setPromocion(estadoInicialPromocion);
        setDestinoTocado(false);
        fetchPromociones();
        if (onExito) onExito();
      } else if (res.status === 400) {
        alert('Datos invalidos. Verifique que las fechas y el porcentaje sean correctos.');
      } else if (res.status === 404) {
        alert('La ruta seleccionada no existe.');
      } else {
        alert('Ocurrio un error inesperado. Intente de nuevo.');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  return (
    <div className="form-container">

      <h2 className="mb-1">Promociones</h2>
      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
        Administre las promociones activas de la aerolinea.
      </p>

      {promociones.length === 0 ? (
        <div className="alert alert-info mb-4">No hay promociones registradas.</div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Ruta</th>
                <th>Descuento</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promociones.map(promo => (
                <tr key={promo.id_promo}>
                  <td className="fw-semibold">{getNombreRuta(promo.id_ruta)}</td>
                  <td>
                    <span className="badge bg-success fs-6">{promo.porcentaje}% OFF</span>
                  </td>
                  <td>{formatFecha(promo.inicio)}</td>
                  <td>{formatFecha(promo.fin)}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditar(promo)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminar(promo.id_promo)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mb-1">{modoEdicion ? 'Editar Promocion' : 'Crear Nueva Promocion'}</h2>

      {modoEdicion && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center py-2 mb-3">
          <span>Editando promocion <strong>#{promocion.idPromo}</strong></span>
          <button className="btn btn-sm btn-outline-danger" onClick={handleCancelarEdicion}>
            Cancelar edicion
          </button>
        </div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>

        <div className="input-field">
          <label>Aeropuerto de Origen</label>
          <select
            name="origen"
            value={promocion.origen}
            onChange={handleOrigenChange}
            disabled={modoEdicion}
            required
          >
            <option value="">-- Seleccione origen --</option>
            {origenesUnicos.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>

        <div className="input-field">
          <label>Aeropuerto de Destino</label>
          <select
            name="destino"
            value={promocion.destino}
            onChange={handleDestinoChange}
            onFocus={() => setDestinoTocado(true)}
            disabled={!promocion.origen || modoEdicion}
            required
            style={destinoTocado && !promocion.origen ? { borderColor: '#dc3545' } : {}}
          >
            <option value="">-- Seleccione destino --</option>
            {destinosUnicos.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </select>
          {destinoTocado && !promocion.origen && (
            <small className="text-danger mt-1">Primero seleccione un origen.</small>
          )}
        </div>

        {hayAmbiguedad && !modoEdicion && (
          <div className="input-field" style={{ gridColumn: 'span 2' }}>
            <label>Tipo de Ruta</label>
            <select
              value={promocion.idRuta}
              onChange={handleRutaEspecificaChange}
              required
            >
              <option value="">-- Seleccione una ruta --</option>
              {rutasFiltradas.map(ruta => (
                <option key={ruta.idRuta} value={ruta.idRuta}>
                  {labelRuta(ruta)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="input-field">
          <label>Precio Base (USD)</label>
          <input
            type="number"
            value={promocion.precioBase}
            readOnly
            placeholder="Se rellena al seleccionar ruta"
            style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
          />
        </div>

        <div className="input-field">
          <label>Porcentaje de Descuento (%)</label>
          <input
            type="number"
            name="porcentaje"
            value={promocion.porcentaje}
            onChange={handlePorcentajeChange}
            placeholder="Ej: 15"
            min="0"
            max="100"
            step="0.01"
            disabled={!promocion.precioBase}
            required
          />
        </div>

        <div className="input-field" style={{ gridColumn: 'span 2' }}>
          <label>Precio en Oferta (USD)</label>
          <input
            type="number"
            name="precioOferta"
            value={promocion.precioOferta}
            onChange={handlePrecioOfertaChange}
            placeholder="O ingrese el precio y se calcula el porcentaje"
            min="0"
            step="0.01"
            disabled={!promocion.precioBase}
          />
        </div>

        <div className="input-field">
          <label>Inicio de Vigencia</label>
          <input
            type="date"
            name="fechaInicio"
            value={promocion.fechaInicio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-field">
          <label>Fin de Vigencia</label>
          <input
            type="date"
            name="fechaFin"
            value={promocion.fechaFin}
            onChange={handleChange}
            min={promocion.fechaInicio}
            required
          />
        </div>

        <div className="input-field" style={{ gridColumn: 'span 2' }}>
          <label>Imagen publicitaria — Opcional</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const archivo = e.target.files[0];
              if (!archivo) return;
              const reader = new FileReader();
              reader.onloadend = () => {
                setPromocion(prev => ({ ...prev, imagenUrl: reader.result }));
              };
              reader.readAsDataURL(archivo);
            }}
          />
          {promocion.imagenUrl && (
            <img src={promocion.imagenUrl} alt="preview"
              className="mt-2 rounded-3 w-100"
              style={{ maxHeight: '180px', objectFit: 'cover' }} />
          )}
        </div>

        <button type="submit" className="btn-save">
          {modoEdicion ? 'Actualizar Promocion' : 'Publicar Promocion'}
        </button>

      </form>
    </div>
  );
};

export default RegistroPromocion;