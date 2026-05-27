import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate(); 
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user === "admin" && password === "1234") {
            navigate("/admin");
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    };

    return (
        <div className="container-fluid bg-light vh-100 d-flex justify-content-center align-items-center">
            
            <div className="card shadow-lg border-0 p-4 rounded-4" style={{ width: "400px" }}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Iniciar Sesión</h2>
                    <p className="text-muted">Página de Administración</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingrese su usuario"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;