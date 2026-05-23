import React, { useState }  from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate(); 
    // Definir estado del user y contraseña
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    // Funcion del boton ingresar
    const handleSubmit = async (e) => {
        e.preventDefault(); // no recargar pagina
        // Guardar inputs
        const loginData = {
            Usuario: user,
            Contrasena: password
        };

        try {
             // Petición al backend
            const response = await fetch("http://localhost:5239/api/Administrador/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            });
            // Recibir respuesta del server
            if (response.ok) {
                const data = await response.text();
                alert("¡Bienvenido Admin! " + data);
                // Redirigir a la página de administración
                navigate("/admin");
            } else {
                const errorText = await response.text();
                alert("Error: " + errorText);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor");
        }
    };

    // Diseño del interfaz
 return (
    <div className="container-fluid bg-light vh-100 d-flex justify-content-center align-items-center">
        
        <div
            className="card shadow-lg border-0 p-4 rounded-4"
            style={{ width: "400px" }}
        >

            {/* Título */}
            <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">
                    Iniciar Sesión
                </h2>

                <p className="text-muted">
                    Página de Administración
                </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>

                {/* Usuario */}
                <div className="mb-3">

                    <label className="form-label fw-semibold">
                        Usuario
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese su usuario"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />

                </div>

                {/* Contraseña */}
                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        className="form-control"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold"
                >
                    Ingresar
                </button>

            </form>
        </div>
    </div>
);
};

export default Login;