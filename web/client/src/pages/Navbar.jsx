import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaTimes, FaPlane } from 'react-icons/fa';
import { useAuth } from './AuthContext';

const API_BASE = process.env.REACT_APP_API_URL;

const Navbar = ({ paginaActiva }) => {
    const navigate = useNavigate();
    const { usuario, login, logout } = useAuth();

    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [mostrarPerfil, setMostrarPerfil] = useState(false);
    const [loginData, setLoginData] = useState({ correo: '', contrasena: '' });
    const [loginError, setLoginError] = useState('');
    const [cargandoLogin, setCargandoLogin] = useState(false);

    const [perfil, setPerfil] = useState({
        correo: '',
        telefono: '',
        universidad: '',
        carnet: ''
    });
    const [perfilError, setPerfilError] = useState('');
    const [perfilExito, setPerfilExito] = useState('');

    const handleAbrirPerfil = () => {
        setPerfil({
            correo: usuario.correo || '',
            telefono: usuario.telefono || '',
            universidad: usuario.estudiante?.universidad || '',
            carnet: usuario.estudiante?.carnet || ''
        });
        setPerfilError('');
        setPerfilExito('');
        setMostrarPerfil(true);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setCargandoLogin(true);
        setLoginError('');

        try {
            const res = await fetch(`${API_BASE}/usuario/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: loginData.correo,
                    contrasena: loginData.contrasena
                })
            });

            if (res.ok) {
                const data = await res.json();

                // Segunda llamada para obtener info completa con millas
                const resCompleto = await fetch(`${API_BASE}/usuario/${data.idUser}`);
                const usuarioCompleto = await resCompleto.json();

                login(usuarioCompleto);
                setMostrarLogin(false);
                setLoginData({ correo: '', contrasena: '' });
            } else if (res.status === 401) {
                setLoginError('Correo o contraseña incorrectos.');
            } else {
                setLoginError('Ocurrió un error inesperado. Intente de nuevo.');
            }
        } catch (error) {
            setLoginError('No se pudo conectar con el servidor.');
        } finally {
            setCargandoLogin(false);
        }
    };

    const handleGuardarPerfil = async (e) => {
        e.preventDefault();
        setPerfilError('');
        setPerfilExito('');

        try {
            const bodyPut = {
                correo: perfil.correo,
                telefono: perfil.telefono,
                contrasena: ''
            };
            const res = await fetch(`${API_BASE}/usuario/${usuario.idUser}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyPut)
            });

            if (!res.ok) {
                if (res.status === 400) {
                    setPerfilError('El correo o teléfono ya está en uso.');
                } else {
                    setPerfilError('Error al actualizar. Intente de nuevo.');
                }
                return;
            }



            // Actualizar contexto con datos nuevos
            login({
                ...usuario,
                correo: perfil.correo,
                telefono: perfil.telefono,
                estudiante: usuario.esEstudiante ? {
                    ...usuario.estudiante,
                    universidad: perfil.universidad,
                    carnet: perfil.carnet
                } : null
            });

            setPerfilExito('Perfil actualizado con éxito.');
        } catch (error) {
            setPerfilError('No se pudo conectar con el servidor.');
        }
    };

    const millas = usuario?.estudiante?.millas || usuario?.Estudiante?.millas || 0;

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm py-3">
                <div
                    className="navbar-brand d-flex align-items-center"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="fw-bold">✈︎ AIRTec</span>
                </div>

                <ul className="navbar-nav d-flex flex-row flex-wrap ms-lg-3 me-auto gap-3">
                    <li className="nav-item">
                        <Link
                            className={`nav-link fw-bold ${paginaActiva === 'reserva' ? 'active' : 'text-white-50'}`}
                            to="/"
                        >
                            Reserva
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link fw-bold ${paginaActiva === 'promos' ? 'active' : 'text-white-50'}`}
                            to="/promos"
                        >
                            Promociones
                        </Link>
                    </li>
                </ul>

                {!usuario ? (
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-light fw-bold px-4 rounded-pill"
                        onClick={() => navigate('/registro')}
                    >
                        Registrarse
                    </button>

                    <button
                        className="btn btn-light text-primary fw-bold px-4 rounded-pill shadow-sm"
                        onClick={() => setMostrarLogin(true)}
                    >
                        Iniciar Sesión
                    </button>
                </div>
                ) : (
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-none d-md-flex flex-column align-items-end">
                            <span className="text-white fw-semibold" style={{ fontSize: '0.9rem' }}>
                                <FaUserCircle className="me-1" />
                                {usuario.nombre} {usuario.ap1}
                            </span>
                            {usuario.esEstudiante && (
                                <span className="text-white-50" style={{ fontSize: '0.78rem' }}>
                                    <FaPlane className="me-1" />
                                    {millas} millas
                                </span>
                            )}
                        </div>
                        <button
                            className="btn btn-light text-primary fw-bold px-3 rounded-pill shadow-sm"
                            onClick={handleAbrirPerfil}
                        >
                            Mi Perfil
                        </button>
                        <button
                            className="btn btn-outline-light fw-bold px-3 rounded-pill"
                            onClick={logout}
                        >
                            Salir
                        </button>
                    </div>
                )}
            </nav>

            {/* Modal Login */}
            {mostrarLogin && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
                    onClick={(e) => { if (e.target === e.currentTarget) setMostrarLogin(false); }}
                >
                    <div className="card border-0 shadow-lg rounded-4 p-4" style={{ width: '420px', maxWidth: '95vw' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0">Iniciar Sesión</h4>
                            <button className="btn btn-sm btn-light rounded-circle" onClick={() => setMostrarLogin(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="correo@ejemplo.com"
                                    value={loginData.correo}
                                    onChange={e => setLoginData(prev => ({ ...prev, correo: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg"
                                    placeholder="Ingrese su contraseña"
                                    value={loginData.contrasena}
                                    onChange={e => setLoginData(prev => ({ ...prev, contrasena: e.target.value }))}
                                    required
                                />
                            </div>

                            {loginError && (
                                <div className="alert alert-danger py-2 small">{loginError}</div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-bold rounded-3 mt-2"
                                disabled={cargandoLogin}
                            >
                                {cargandoLogin ? 'Verificando...' : 'Ingresar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Perfil */}
            {mostrarPerfil && usuario && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
                    onClick={(e) => { if (e.target === e.currentTarget) setMostrarPerfil(false); }}
                >
                    <div className="card border-0 shadow-lg rounded-4 p-4" style={{ width: '500px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0">Mi Perfil</h4>
                            <button className="btn btn-sm btn-light rounded-circle" onClick={() => setMostrarPerfil(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        {/* Nombre no editable */}
                        <div className="bg-light rounded-3 p-3 mb-4">
                            <p className="mb-0 fw-bold text-dark fs-5">
                                {usuario.nombre} {usuario.ap1} {usuario.ap2}
                            </p>
                        </div>

                        <form onSubmit={handleGuardarPerfil}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={perfil.correo}
                                    onChange={e => setPerfil(prev => ({ ...prev, correo: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Teléfono</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    value={perfil.telefono}
                                    onChange={e => setPerfil(prev => ({ ...prev, telefono: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* Info estudiante — solo si es estudiante */}
                            {usuario.esEstudiante && (
                                <div className="border rounded-3 p-3 mb-3 bg-light">
                                    <h6 className="fw-bold text-primary mb-3">
                                        <FaPlane className="me-2" />Programa de Lealtad Estudiantil
                                    </h6>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Universidad</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={perfil.universidad}
                                            readOnly
                                            style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Carnet</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={perfil.carnet}
                                            readOnly
                                            style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="mb-1">
                                        <label className="form-label fw-semibold">Millas acumuladas</label>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
                                                <FaPlane className="me-1" />{millas} millas
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {perfilError && (
                                <div className="alert alert-danger py-2 small">{perfilError}</div>
                            )}
                            {perfilExito && (
                                <div className="alert alert-success py-2 small">{perfilExito}</div>
                            )}

                            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-3 mt-2">
                                Guardar cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;