import React, { useState } from 'react';
import './forms.css';

const RegistroUsuario = () => {
  // Estado inicial del usuario 
  const [usuario, setUsuario] = useState({
    nombreCompleto: '',
    telefono: '',
    correo: '',
    esEstudiante: false,
    universidad: '', 
    carnet: ''       
  });

  // Manejador para entradas estándar y el checkbox 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setUsuario(prev => {
      const nuevoEstado = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      if (name === 'esEstudiante' && !checked) {
        nuevoEstado.universidad = '';
        nuevoEstado.carnet = '';
      }
      
      return nuevoEstado;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Cliente registrado a AIRTec:', usuario);
    
    if (usuario.esEstudiante) {
      alert(`Estudiante ${usuario.nombreCompleto} registrado con éxito en el Programa de Lealtad Estudiantil. Carnet: ${usuario.carnet}`);
    } else {
      alert(`Usuario ${usuario.nombreCompleto} registrado con éxito.`);
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '25px' }}>
        Cree su cuenta en AIRTec para acumular millas.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>
        
        {/* Nombre Completo */}
        <div className="input-field" style={{ gridColumn: 'span 2' }}>
          <label>Nombre Completo</label>
          <input 
            type="text" 
            name="nombreCompleto"
            value={usuario.nombreCompleto}
            onChange={handleChange}
            placeholder="Ej: Pancho Pérez" 
            required
          />
        </div>

        {/* Teléfono de Contacto */}
        <div className="input-field">
          <label>Teléfono de Contacto</label>
          <input 
            type="tel" 
            name="telefono"
            value={usuario.telefono}
            onChange={handleChange}
            placeholder="Ej: +506 8888-8888" 
            required
          />
        </div>

        {/* Correo Electrónico */}
        <div className="input-field">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            name="correo"
            value={usuario.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com" 
            required
          />
        </div>

        {/* Checkbox */}
        <div className="input-field" style={{ gridColumn: 'span 2', flexDirection: 'row', alignItems: 'center', gap: '12px', margin: '10px 0' }}>
          <input 
            type="checkbox" 
            name="esEstudiante"
            id="esEstudiante"
            checked={usuario.esEstudiante}
            onChange={handleChange}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
          <label htmlFor="esEstudiante" style={{ margin: 0, cursor: 'pointer', textTransform: 'none', fontSize: '0.9rem', color: '#1e293b' }}>
            Soy estudiante activo (Deseo acumular millas )
          </label>
        </div>

        {/* Campos aparecen si es estudiante */}
        {usuario.esEstudiante && (
          <>
            <div className="input-field">
              <label>Universidad</label>
              <input 
                type="text" 
                name="universidad"
                value={usuario.universidad}
                onChange={handleChange}
                placeholder="Ej: Instituto Tecnológico de Costa Rica" 
                required={usuario.esEstudiante} 
              />
            </div>

            {/* Carnet Universitario */}
            <div className="input-field">
              <label>Carnet </label>
              <input 
                type="text" 
                name="carnet"
                value={usuario.carnet}
                onChange={handleChange}
                placeholder="Ej: 2024123456" 
                required={usuario.esEstudiante}
              />
            </div>
          </>
        )}

        {/* Botón de Envío */}
        <button type="submit" className="btn-save">
          Registrar Cuenta
        </button>

      </form>
    </div>
  );
};

export default RegistroUsuario;