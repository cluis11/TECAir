import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './forms.css';

const API_BASE = process.env.REACT_APP_API_URL;

const estadoInicialUsuario = {
  nombre: '',
  ap1: '',
  ap2: '',
  telefono: '',
  correo: '',
  contrasena: '',
  esEstudiante: false,
  universidad: '',
  carnet: ''
};

const GestionUsuarios = () => {
    const [usuario, setUsuario] = useState(estadoInicialUsuario);
    const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      correo: usuario.correo,
      contrasena: usuario.contrasena,
      nombre: usuario.nombre,
      ap1: usuario.ap1,
      ap2: usuario.ap2,
      telefono: usuario.telefono,
      esEstudiante: usuario.esEstudiante,
      ...(usuario.esEstudiante && {
        estudiante: {
          carnet: usuario.carnet,
          universidad: usuario.universidad
        }
      })
    };

    try {
      const res = await fetch(`${API_BASE}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(`Usuario ${usuario.nombre} ${usuario.ap1} registrado con exito.`);
        setUsuario(estadoInicialUsuario);
        navigate(-1);
      } else if (res.status === 400) {
        alert('El correo o telefono ingresado ya esta registrado en el sistema.');
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

      <h2 className="mb-1">Registro de Usuario</h2>

      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
        Cree una cuenta en AIRTec para acumular millas.
      </p>

      <form className="form-grid" onSubmit={handleSubmit}>

        <div className="input-field">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            placeholder="Ej: Juan"
            required
          />
        </div>

        <div className="input-field">
          <label>Primer Apellido</label>
          <input
            type="text"
            name="ap1"
            value={usuario.ap1}
            onChange={handleChange}
            placeholder="Ej: Perez"
            required
          />
        </div>

        <div className="input-field">
          <label>Segundo Apellido</label>
          <input
            type="text"
            name="ap2"
            value={usuario.ap2}
            onChange={handleChange}
            placeholder="Ej: Mora (opcional)"
          />
        </div>

        <div className="input-field">
          <label>Telefono de Contacto</label>
          <input
            type="tel"
            name="telefono"
            value={usuario.telefono}
            onChange={handleChange}
            placeholder="Ej: +506 8888-8888"
            required
          />
        </div>

        <div className="input-field">
          <label>Correo Electronico</label>
          <input
            type="email"
            name="correo"
            value={usuario.correo}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div className="input-field">
          <label>Contrasena</label>
          <input
            type="password"
            name="contrasena"
            value={usuario.contrasena}
            onChange={handleChange}
            placeholder="Ingrese una contrasena"
            required
          />
        </div>

        <div
          className="input-field"
          style={{
            gridColumn: 'span 2',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            margin: '10px 0'
          }}
        >
          <input
            type="checkbox"
            name="esEstudiante"
            id="esEstudiante"
            checked={usuario.esEstudiante}
            onChange={handleChange}
            style={{ width: 'auto', cursor: 'pointer' }}
          />

          <label
            htmlFor="esEstudiante"
            style={{
              margin: 0,
              cursor: 'pointer',
              textTransform: 'none',
              fontSize: '0.9rem',
              color: '#1e293b'
            }}
          >
            Es estudiante activo (acumula millas)
          </label>
        </div>

        {usuario.esEstudiante && (
          <>
            <div className="input-field">
              <label>Universidad</label>
              <input
                type="text"
                name="universidad"
                value={usuario.universidad}
                onChange={handleChange}
                placeholder="Ej: Instituto Tecnologico de Costa Rica"
                required
              />
            </div>

            <div className="input-field">
              <label>Carnet</label>
              <input
                type="text"
                name="carnet"
                value={usuario.carnet}
                onChange={handleChange}
                placeholder="Ej: 2024123456"
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-save">
          Registrar Cuenta
        </button>

      </form>
    </div>
  );
};

export default GestionUsuarios;