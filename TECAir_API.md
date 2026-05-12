# TECAir API Documentation

## Flujos por funcionalidad

---

## 1. Autenticación

**Flujo:** Usuario se registra o inicia sesión para acceder al sistema.

### POST /usuario
Registrar un nuevo usuario.

**Request:**
```json
{
  "correo": "string",
  "contrasena": "string",
  "nombre": "string",
  "ap1": "string",
  "ap2": "string",
  "telefono": "string",
  "esEstudiante": true,
  "estudiante": {
    "carnet": "string",
    "universidad": "string"
  }
}
```

**Response `201`:**
```json
{
  "idUser": 1,
  "correo": "string",
  "nombre": "string",
  "ap1": "string",
  "ap2": "string",
  "telefono": "string",
  "esEstudiante": true,
  "estudiante": {
    "carnet": "string",
    "universidad": "string",
    "millas": 0
  }
}
```

**Response `400`:** Correo o teléfono ya registrado.

---

### POST /usuario/login
Iniciar sesión.

**Request:**
```json
{
  "correo": "string",
  "contrasena": "string"
}
```

**Response `200`:**
```json
{
  "idUser": 1,
  "nombre": "string",
  "correo": "string",
  "esEstudiante": true
}
```

**Response `401`:** Credenciales inválidas.

---

### GET /usuario/{id}
Obtener un usuario por ID.

**Response `200`:**
```json
{
  "idUser": 1,
  "correo": "string",
  "nombre": "string",
  "ap1": "string",
  "ap2": "string",
  "telefono": "string",
  "esEstudiante": true,
  "estudiante": {
    "carnet": "string",
    "universidad": "string",
    "millas": 0
  }
}
```

---

### PUT /usuario/{id}
Actualizar teléfono, correo, o info de estudiante. Nombre no se puede modificar. Si cambia universidad debe cambiar carnet.

**Request:**
```json
{
  "correo": "string",
  "telefono": "string",
  "estudiante": {
    "carnet": "string",
    "universidad": "string"
  }
}
```

**Response `200`:** Usuario actualizado.
**Response `400`:** Correo o teléfono ya en uso. Universidad y carnet deben cambiar juntos.

---

### DELETE /usuario/{id}
Eliminar un usuario.

**Response `200`:** Usuario eliminado.

---

## 2. Promociones

**Flujo:** Cliente ve promociones activas. Funcionario gestiona el CRUD de promociones.

### GET /promocion/activas
Obtener promociones vigentes a la fecha actual.

**Response `200`:**
```json
[
  {
    "idPromo": 1,
    "idRuta": 1,
    "ciudadOrigen": "string",
    "ciudadDestino": "string",
    "porcentaje": 10.5,
    "inicio": "2026-05-01",
    "fin": "2026-05-31",
    "imagen": "string"
  }
]
```

---

### GET /promocion
Obtener todas las promociones.

**Response `200`:** Lista de promociones.

---

### GET /promocion/{id}
Obtener una promoción por ID.

**Response `200`:** Promoción.

---

### POST /promocion
Crear una promoción.

**Request:**
```json
{
  "idRuta": 1,
  "porcentaje": 10.5,
  "inicio": "2026-05-01",
  "fin": "2026-05-31",
  "imagen": "string"
}
```

**Response `201`:** Promoción creada.

---

### PUT /promocion/{id}
Actualizar una promoción.

**Request:**
```json
{
  "porcentaje": 15.0,
  "inicio": "2026-05-01",
  "fin": "2026-06-30",
  "imagen": "string"
}
```

**Response `200`:** Promoción actualizada.

---

### DELETE /promocion/{id}
Eliminar una promoción.

**Response `200`:** Promoción eliminada.

---

## 3. Catálogos

**Flujo:** La interfaz consulta aeropuertos y aviones para poblar selectores al crear rutas, vuelos e itinerarios.

### GET /aeropuerto
Obtener todos los aeropuertos.

**Response `200`:**
```json
[
  {
    "idAeropuerto": 1,
    "nombre": "string",
    "codigo": "string",
    "ciudad": "string",
    "pais": "string"
  }
]
```

---

### GET /aeropuerto/{id}/puertas
Obtener las puertas de embarque de un aeropuerto.

**Response `200`:**
```json
[
  {
    "puertaEmbarque": "string"
  }
]
```

---

### GET /avion
Obtener todos los aviones.

**Response `200`:**
```json
[
  {
    "matricula": "string",
    "capacidad": 150
  }
]
```

---

### POST /avion
Crear un avión y sus asientos.

**Request:**
```json
{
  "matricula": "string",
  "capacidad": 150,
  "filas": 25,
  "columnas": ["A","B","C","D","E","F"]
}
```

**Response `201`:** Avión creado con sus asientos.

---

### PUT /avion/{matricula}
Actualizar un avión.

**Response `200`:** Avión actualizado.

---

### DELETE /avion/{matricula}
Eliminar un avión.

**Response `200`:** Avión eliminado.

---

## 4. Gestión de Rutas

**Flujo:** Funcionario crea rutas definiendo origen, destino y sus vuelos. Puede editar, consultar y eliminar. Al eliminar una ruta con itinerarios activos estos se cierran.

### GET /ruta
Obtener todas las rutas.

**Response `200`:**
```json
[
  {
    "idRuta": 1,
    "ciudadOrigen": "string",
    "ciudadDestino": "string",
    "precio": 250.00,
    "vuelos": [
      {
        "idVuelo": 1,
        "ciudadOrigen": "string",
        "ciudadDestino": "string",
        "matricula": "string"
      }
    ]
  }
]
```

---

### GET /ruta/{id}
Obtener una ruta con sus vuelos.

**Response `200`:** Ruta con vuelos.

---

### POST /ruta
Crear una ruta con sus vuelos.

**Request:**
```json
{
  "idOrigen": 1,
  "idDestino": 2,
  "precio": 250.00,
  "vuelos": [
    {
      "idOrigen": 1,
      "idDestino": 3,
      "matricula": "string"
    },
    {
      "idOrigen": 3,
      "idDestino": 2,
      "matricula": "string"
    }
  ]
}
```

**Response `201`:** Ruta creada con sus vuelos.

---

### PUT /ruta/{id}
Actualizar precio, origen o destino de una ruta.

**Request:**
```json
{
  "idOrigen": 1,
  "idDestino": 2,
  "precio": 300.00
}
```

**Response `200`:** Ruta actualizada.

---

### DELETE /ruta/{id}
Eliminar una ruta. Cierra todos los itinerarios activos asociados.

**Response `200`:** Ruta eliminada, itinerarios cerrados.

---

### POST /ruta/{id}/vuelo
Agregar un vuelo a una ruta existente.

**Request:**
```json
{
  "idOrigen": 1,
  "idDestino": 3,
  "matricula": "string"
}
```

**Response `201`:** Vuelo agregado.

---

### DELETE /vuelo/{idVuelo}
Eliminar un vuelo. Cierra todos los itinerarios de todos los vuelos de esa ruta.

**Response `200`:** Vuelo eliminado, itinerarios cerrados.

---

## 5. Búsqueda de Vuelos

**Flujo:** Cliente ingresa origen, destino, fecha y cantidad de pasajeros. Para ida y vuelta el frontend hace dos llamadas invirtiendo origen y destino con la fecha de vuelta.

### GET /itinerario/buscar
Buscar itinerarios disponibles.

**Query params:**
```
idOrigen: int
idDestino: int
fecha: date
cantidadPasajeros: int
```

**Response `200`:**
```json
[
  {
    "idRuta": 1,
    "ciudadOrigen": "string",
    "ciudadDestino": "string",
    "precio": 250.00,
    "asientosLibres": 45,
    "vuelos": [
      {
        "idItinerario": 1,
        "idVuelo": 1,
        "ciudadOrigen": "string",
        "ciudadDestino": "string",
        "fecha": "2026-06-01",
        "salida": "08:00",
        "llegada": "10:30",
        "puertaEmbarque": "string",
        "asientosLibres": 45
      }
    ]
  }
]
```

**Response `404`:** No se encontraron rutas disponibles.

---

### GET /itinerario/{id}/asientos
Obtener asientos disponibles de un itinerario para selección.

**Response `200`:**
```json
[
  {
    "idAsiento": 1,
    "fila": "string",
    "columna": "string",
    "estado": "libre"
  }
]
```

---

## 6. Apertura y Cierre de Vuelos

**Flujo:** Funcionario selecciona una ruta y asigna fecha, hora y puerta a cada vuelo para crear los itinerarios. También puede cerrar un vuelo manualmente.

### POST /itinerario/abrir
Abrir los vuelos de una ruta asignando fecha, hora y puerta a cada uno. Genera registros en AsientoItinerario con todos los asientos libres.

**Request:**
```json
{
  "idRuta": 1,
  "vuelos": [
    {
      "idVuelo": 1,
      "fecha": "2026-06-01",
      "salida": "08:00",
      "llegada": "10:30",
      "puertaEmbarque": "string"
    }
  ]
}
```

**Response `201`:** Itinerarios creados.

---

### PUT /itinerario/{id}/cerrar
Cerrar un vuelo manualmente.

**Response `200`:** Itinerario cerrado.

---

## 7. Reserva

**Flujo:** Cliente selecciona vuelo, agrega pasajeros, opcionalmente selecciona asientos, define titular y paga.

### POST /reserva
Crear una reserva con sus pasajeros y boletos.

**Request:**
```json
{
  "idUsuario": 1,
  "pasaporteTitular": "string",
  "pasajeros": [
    {
      "pasaporte": "string",
      "nombre": "string",
      "ap1": "string",
      "ap2": "string",
      "nacionalidad": "string",
      "fechaNacimiento": "2000-01-01",
      "boletos": [
        {
          "idItinerario": 1,
          "idAsiento": null
        }
      ]
    }
  ]
}
```

**Response `201`:**
```json
{
  "idReserva": 1,
  "estado": "pendiente",
  "fecha": "2026-05-11",
  "boletos": [
    {
      "idBoleto": 1,
      "idPasajero": "string",
      "idItinerario": 1,
      "idAsiento": null,
      "estado": "pendiente",
      "yaCheckin": false
    }
  ]
}
```

---

### GET /reserva/{id}
Obtener una reserva con sus boletos.

**Response `200`:**
```json
{
  "idReserva": 1,
  "idUsuario": 1,
  "pasaporteTitular": "string",
  "estado": "string",
  "fecha": "2026-05-11",
  "boletos": [
    {
      "idBoleto": 1,
      "pasaporte": "string",
      "nombrePasajero": "string",
      "idItinerario": 1,
      "ciudadOrigen": "string",
      "ciudadDestino": "string",
      "salida": "08:00",
      "idAsiento": null,
      "fila": null,
      "columna": null,
      "estado": "string",
      "yaCheckin": false
    }
  ]
}
```

---

### GET /reserva/usuario/{idUsuario}
Obtener todas las reservas de un usuario.

**Response `200`:** Lista de reservas.

---

### PUT /reserva/{id}/pagar
Marcar una reserva como pagada.

**Response `200`:** Reserva pagada.
**Response `400`:** Reserva ya pagada o cancelada.

---

### DELETE /reserva/{id}
Cancelar una reserva. Libera los asientos en AsientoItinerario.

**Response `200`:** Reserva cancelada, asientos liberados.

---

## 8. Checkin

**Flujo:** Funcionario busca la reserva por ID o pasaporte, obtiene los boletos, selecciona uno y hace el checkin asignando o cambiando el asiento. Genera el pase de abordar en PDF.

### GET /checkin/reserva/{idReserva}
Obtener boletos de una reserva para checkin.

**Response `200`:** Reserva con boletos y estado de checkin.

---

### GET /checkin/pasajero/{pasaporte}
Buscar reservas y boletos por pasaporte.

**Response `200`:** Lista de boletos del pasajero.

---

### PUT /checkin/{idBoleto}
Hacer checkin de un boleto. Asigna o cambia asiento y marca YaCheckin.

**Request:**
```json
{
  "idAsiento": 1
}
```

**Response `200`:**
```json
{
  "idBoleto": 1,
  "yaCheckin": true,
  "fila": "string",
  "columna": "string",
  "puertaEmbarque": "string",
  "salida": "08:00",
  "idVuelo": 1
}
```

---

### GET /checkin/{idBoleto}/pase
Generar y descargar el pase de abordar en PDF.

**Response `200`:** Archivo PDF.

---

## 9. Maletas

**Flujo:** Funcionario asigna maletas a pasajeros ya chequeados. El sistema calcula el cobro adicional antes de confirmar.

### GET /maleta/pasajero/{pasaporte}
Obtener maletas de un pasajero y cobro acumulado.

**Response `200`:**
```json
{
  "pasaporte": "string",
  "maletas": [
    {
      "idMaleta": 1,
      "color": "string",
      "peso": 23.5
    }
  ],
  "totalMaletas": 1,
  "cobroAdicional": 0
}
```

---

### GET /maleta/pasajero/{pasaporte}/cobro
Calcular el cobro de agregar una maleta más.

**Response `200`:**
```json
{
  "maletasActuales": 1,
  "cobroNuevaMaleta": 50.00
}
```

---

### POST /maleta
Asignar una maleta a un pasajero chequeado.

**Request:**
```json
{
  "pasaporte": "string",
  "color": "string",
  "peso": 23.5
}
```

**Response `201`:**
```json
{
  "idMaleta": 1,
  "pasaporte": "string",
  "color": "string",
  "peso": 23.5,
  "cobroCargado": 50.00
}
```

**Response `400`:** Pasajero no ha hecho checkin.

---

### DELETE /maleta/{id}
Eliminar una maleta.

**Response `200`:** Maleta eliminada.
