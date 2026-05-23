import React, { useState, useEffect } from 'react';
import './forms.css';

const API_BASE = process.env.REACT_APP_API_URL;

const estadoInicialUsuario = {
  idUser: null,
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
  const [usuarios, setUsuarios] = useState([]);
  const modoEdicion = usuario.idUser !== null;

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`${API_BASE}/usuario`);
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

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

  const handleCancelar = () => {
    setUsuario(estadoInicialUsuario);
  };

  const handleEditar = (u) => {
    setUsuario({
      idUser: u.idUser,
      nombre: u.nombre || '',
      ap1: u.ap1 || '',
      ap2: u.ap2 || '',
      telefono: u.telefono || '',
      correo: u.correo || '',
      contrasena: '',
      esEstudiante: u.esEstudiante || false,
      universidad: u.estudiante?.universidad || u.Estudiante?.Universidad || '',
      carnet: u.estudiante?.carnet || u.Estudiante?.Carnet || ''
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleEliminar = async (idUser) => {
    if (!window.confirm('¿Seguro que desea eliminar este usuario?')) return;
    try {
      const res = await fetch(`${API_BASE}/usuario/${idUser}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Usuario eliminado con exito.');
        fetchUsuarios();
      } else if (res.status === 404) {
        alert('Usuario no encontrado.');
      } else if (res.status === 400) {
        alert('No se puede eliminar el usuario. Verifique que no tenga reservas activas.');
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
      if (modoEdicion) {
        // PUT — correo y telefono
        const bodyPut = {
          correo: usuario.correo,
          telefono: usuario.telefono,
          contrasena: usuario.contrasena || ''
        };
        const res = await fetch(`${API_BASE}/usuario/${usuario.idUser}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPut)
        });
        if (!res.ok) {
          if (res.status === 400) {
            alert('El correo o telefono ingresado ya esta en uso por otro usuario.');
          } else if (res.status === 404) {
            alert('Usuario no encontrado.');
          } else {
            alert('Ocurrio un error inesperado. Intente de nuevo.');
          }
          return;
        }

        // PUT estudiante — endpoint separado
        if (usuario.esEstudiante) {
          const bodyEst = {
            carnet: usuario.carnet,
            universidad: usuario.universidad
          };
          const resEst = await fetch(`${API_BASE}/usuario/${usuario.idUser}/estudiante`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyEst)
          });
          if (!resEst.ok) {
            alert('Usuario actualizado pero hubo un error al guardar la informacion de estudiante.');
            setUsuario(estadoInicialUsuario);
            fetchUsuarios();
            return;
          }
        }

        alert('Usuario actualizado con exito.');
        setUsuario(estadoInicialUsuario);
        fetchUsuarios();
      } else {
        // POST — crear usuario
        const res = await fetch(`${API_BASE}/usuario`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (res.ok) {
          alert(`Usuario ${usuario.nombre} ${usuario.ap1} registrado con exito.`);
          setUsuario(estadoInicialUsuario);
          fetchUsuarios();
        } else if (res.status === 400) {
          alert('El correo o telefono ingresado ya esta registrado en el sistema.');
        } else {
          alert('Ocurrio un error inesperado. Intente de nuevo.');
        }
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor.');
      console.error(error);
    }
  };

  return (
    <div className="form-container">

      {/* TABLA DE USUARIOS */}
      <h2 className="mb-1">Clientes Registrados</h2>
      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
        Gestione los usuarios registrados en AIRTec.
      </p>

      {usuarios.length === 0 ? (
        <div className="alert alert-info mb-4">No hay usuarios registrados.</div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Telefono</th>
                <th>Estudiante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.idUser}>
                  <td className="fw-semibold">
                    {u.nombre} {u.ap1} {u.ap2}
                  </td>
                  <td>{u.correo}</td>
                  <td>{u.telefono}</td>
                  <td>
                    {(u.esEstudiante || u.EsEstudiante)
                      ? <span className="badge bg-primary">Si</span>
                      : <span className="badge bg-secondary">No</span>
                    }
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditar(u)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleEliminar(u.idUser)}
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

      {/* FORMULARIO */}
      <h2 className="mb-1">{modoEdicion ? 'Editar Usuario' : 'Registro de Usuario'}</h2>
      <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
        {modoEdicion
          ? 'Puede modificar el correo, telefono e informacion de estudiante.'
          : 'Cree una cuenta en AIRTec para acumular millas.'
        }
      </p>

      {modoEdicion && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center py-2 mb-3">
          <span>Editando usuario <strong>#{usuario.idUser} — {usuario.nombre} {usuario.ap1}</strong></span>
          <button className="btn btn-sm btn-outline-danger" onClick={handleCancelar}>
            Cancelar edicion
          </button>
        </div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>

        {/* Nombre */}
        <div className="input-field">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            placeholder="Ej: Juan"
            disabled={modoEdicion}
            required={!modoEdicion}
          />
        </div>

        {/* Primer Apellido */}
        <div className="input-field">
          <label>Primer Apellido</label>
          <input
            type="text"
            name="ap1"
            value={usuario.ap1}
            onChange={handleChange}
            placeholder="Ej: Perez"
            disabled={modoEdicion}
            required={!modoEdicion}
          />
        </div>

        {/* Segundo Apellido */}
        <div className="input-field">
          <label>Segundo Apellido</label>
          <input
            type="text"
            name="ap2"
            value={usuario.ap2}
            onChange={handleChange}
            placeholder="Ej: Mora (opcional)"
            disabled={modoEdicion}
          />
        </div>

        {/* Telefono */}
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

        {/* Correo */}
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

        {/* Contrasena - solo al crear */}
        {!modoEdicion && (
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
        )}

        {/* Checkbox estudiante */}
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
            Es estudiante activo (acumula millas)
          </label>
        </div>

        {/* Campos estudiante */}
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
                required={usuario.esEstudiante}
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
                required={usuario.esEstudiante}
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-save">
          {modoEdicion ? 'Actualizar Usuario' : 'Registrar Cuenta'}
        </button>

      </form>
    </div>
  );
};

export default GestionUsuarios;