import React, { useState } from 'react';
import './forms.css';

const RegistroVueloAIRTec = () => {
  
  // DATOS PRUEBA
  const [avionesDisponibles] = useState([
    { matricula: 'TI-TEC1', modelo: 'Boeing 737', capacidad: 160 },
    { matricula: 'TI-TEC2', modelo: 'Airbus A320', capacidad: 180 },
    { matricula: 'TI-TEC3', modelo: 'Embraer 190', capacidad: 100 }
  ]);

  // Estado para el formulario de vuelo
  const estadoInicialVuelo = {
    codigoVuelo: '',
    aeropuertoInicial: '',
    aeropuertoDestino: '',
    matriculaAvion: '',
    capacidadPasajeros: 0, 
    fechaSalida: '',
    fechaLlegada: '',
    precioBase: '',
    estadoOperativo: 'Abierto'
  };

  const [vuelo, setVuelo] = useState(estadoInicialVuelo);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'matriculaAvion') {
      const avionSeleccionado = avionesDisponibles.find(a => a.matricula === value);
      setVuelo(prev => ({
        ...prev,
        matriculaAvion: value,
        capacidadPasajeros: avionSeleccionado ? avionSeleccionado.capacidad : 0
      }));
    } else {
      setVuelo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Vuelo ${vuelo.codigoVuelo} registrado con éxito. Capacidad máxima: ${vuelo.capacidadPasajeros} pasajeros.`);
    setVuelo(estadoInicialVuelo);
  };

  return (
    <div className="form-container">
      <h2>Registro de Vuelos</h2>
      <p style={{ color: '#8892b0', fontSize: '0.9rem', marginBottom: '25px' }}>
        Defina el origen, destino, asignación de aeronave, horarios y guarde el vuelo en el sistema.
      </p>
      
      <form className="form-grid" onSubmit={handleSubmit}>
        
        {/* Código del Vuelo */}
        <div className="input-field" style={{ gridColumn: 'span 2' }}> 
          {/* Se expande a 2 columnas ya que quitamos el selector de estado al lado */}
          <label>Código de Vuelo</label>
          <input 
            type="text" 
            name="codigoVuelo"
            value={vuelo.codigoVuelo}
            onChange={handleChange}
            placeholder="Ej: AT-905" 
            required 
          />
        </div>

        {/* Aeropuerto Inicial */}
        <div className="input-field">
          <label>Aeropuerto Inicial</label>
          <input 
            type="text" 
            name="aeropuertoInicial"
            value={vuelo.aeropuertoInicial}
            onChange={handleChange}
            placeholder="Ej: Juan Santamaría (SJO)" 
            required
          />
        </div>

        {/* Aeropuerto Destino */}
        <div className="input-field">
          <label>Aeropuerto Destino Final</label>
          <input 
            type="text" 
            name="aeropuertoDestino"
            value={vuelo.aeropuertoDestino}
            onChange={handleChange}
            placeholder="Ej: Adolfo Suárez (MAD)" 
            required
          />
        </div>

        {/* Asignación de Avión por Matrícula */}
        <div className="input-field">
          <label>Matrícula del Avión</label>
          <select 
            name="matriculaAvion" 
            value={vuelo.matriculaAvion} 
            onChange={handleChange}
            required
          >
            <option value="">-- Seleccione una Aeronave --</option>
            {avionesDisponibles.map(avion => (
              <option key={avion.matricula} value={avion.matricula}>
                {avion.matricula} ({avion.modelo})
              </option>
            ))}
          </select>
        </div>

        {/* Capacidad de Pasajeros */}
        <div className="input-field">
          <label>Capacidad Bloqueada (Asientos)</label>
          <input 
            type="text" 
            name="capacidadPasajeros"
            value={vuelo.capacidadPasajeros > 0 ? `${vuelo.capacidadPasajeros} pasajeros` : 'Seleccione un avión'}
            readOnly
          />
        </div>

        {/* Horarios de Operación */}
        <div className="input-field">
          <label>Fecha y Hora de Salida</label>
          <input 
            type="datetime-local" 
            name="fechaSalida"
            value={vuelo.fechaSalida}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-field">
          <label>Fecha y Hora de Llegada</label>
          <input 
            type="datetime-local" 
            name="fechaLlegada"
            value={vuelo.fechaLlegada}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-field" style={{ gridColumn: 'span 2' }}>
          <label>Precio Base del Boleto (USD)</label>
          <input 
            type="number" 
            name="precioBase"
            value={vuelo.precioBase}
            onChange={handleChange}
            placeholder="Ej: 600" 
            min="0"
            step="0.01"
            required
          />
        </div>

        <button type="submit" className="btn-save">
          Guardar Vuelo
        </button>

      </form>
    </div>
  );
};

export default RegistroVueloAIRTec;