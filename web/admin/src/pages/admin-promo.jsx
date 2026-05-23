import React, { useState } from 'react';
import './forms.css';

const RegistroPromocion = () => {
  // Estado para manejar los datos de promoción

    const estadoInicialPromocion = {
      origen: '',
      destino: '',
      precioOriginal: '',
      precioPromocion: '',
      fechaInicio: '',
      fechaFin: '',
      imagenUrl: ''// POR EL MOMENTO SE MANEJA CON URL LAS IMAGENES
    };

  const [promocion, setPromocion] = useState(estadoInicialPromocion);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromocion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Promoción creada con éxito de ${promocion.origen} hacia ${promocion.destino}`);
    setPromocion(estadoInicialPromocion);
  };

  return (
    <div className="form-container">
      <h2>Crear Nueva Promoción</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        
        {/* Aeropuerto Origen */}
        <div className="input-field">
          <label>Aeropuerto de Origen</label>
          <input 
            type="text" 
            name="origen"
            value={promocion.origen}
            onChange={handleChange}
            placeholder="Ej: San José (SJO)" 
            required
          />
        </div>

        {/* Aeropuerto Destino */}
        <div className="input-field">
          <label>Aeropuerto de Destino</label>
          <input 
            type="text" 
            name="destino"
            value={promocion.destino}
            onChange={handleChange}
            placeholder="Ej: Miami (MIA)" 
            required
          />
        </div>

        {/* Precio Original */}
        <div className="input-field">
          <label>Precio Regular (USD)</label>
          <input 
            type="number" 
            name="precioOriginal"
            value={promocion.precioOriginal}
            onChange={handleChange}
            placeholder="Ej: 550.00" 
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Precio en Promoción */}
        <div className="input-field">
          <label>Precio en Oferta (USD)</label>
          <input 
            type="number" 
            name="precioPromocion"
            value={promocion.precioPromocion}
            onChange={handleChange}
            placeholder="Ej: 299.99" 
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Fecha Inicio */}
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

        {/* Fecha Fin */}
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

        {/* Imagen de la Promoción  */}
        <div className="input-field" style={{ gridColumn: 'span 2' }}>
          <label>Imagen publicitaria (URL) — Opcional</label>
          <input 
            type="text" 
            name="imagenUrl"
            value={promocion.imagenUrl}
            onChange={handleChange}
            placeholder="https://ejemplo/costarica.png" 
          />
        </div>

        {/* Botón */}
        <button type="submit" className="btn-save">
          Publicar Promoción
        </button>

      </form>
    </div>
  );
};

export default RegistroPromocion;