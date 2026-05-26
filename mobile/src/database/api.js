const API_BASE = '';

export const login = async (correo, contrasena) => {
    const res = await fetch(`${API_BASE}/usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
    });
    if (!res.ok) throw new Error ('Credenciales inválidas');
    return res.json();
};

export const regiistrarUsuario = async (datos) => {
    const res = await fetch(`${API_BASE}/usuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Error al registrar usuario');
    return res.json();
};

export const getAeropuertos = async () => {
    const res = await fetch(`${API_BASE}/aeropuerto`);
    if (!res.ok) throw new Error('Error al cargar aeropuertos');
    return res.json();
}

export const buscarVuelos = async (idOrigen, idDestino, fecha, pasajeros) => {
    const res = await fetch(`${API_BASE}/itinerario/buscar?idOrigen=${idOrigen}&idDestino=${idDestino}&fecha=${fecha}&cantidadPasajeros=${pasajeros}`);
    if (!res.ok) throw new Error('Error al buscar vuelos');
    return res.json();
}

export const getPromociones = async () => {
    const res = await fetch(`${API_BASE}/promocion/activas`);
    if (!res.ok) throw new Error('Error al cargar promociones');
    return res.json();
}

export const crearReserva = async (datos) => {
    const res = await fetch(`${API_BASE}/reserva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Error al crear reserva');
    return res.json();
};