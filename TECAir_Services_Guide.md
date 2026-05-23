# TECAir API — Guía de Implementación de Services

## Arquitectura

```
Controllers  →  Services (Interfaces/Implementations)  →  Repositories (Interfaces/Implementations)  →  DBConnection  →  PostgreSQL
```

- **Controllers** — exponen los endpoints, usan interfaces de services
- **Services** — lógica de negocio, usan interfaces de repositorios
- **Repositories** — queries SQL, usan DBConnection
- **Models** — mapean tablas de la BD
- **DTOs** — cuando el resultado de un query junta varias tablas o se necesita un campo descriptivo en vez de un ID

---

## Reglas generales

- El repositorio **solo hace queries**, sin lógica de negocio
- El service **orquesta la lógica** — validaciones, reglas de negocio, coordinación entre repositorios
- El controller **no tiene lógica**, solo llama al service y retorna el resultado
- Si un service necesita datos de otro módulo, usa el service correspondiente, no el repositorio directamente
- Cada repositorio abre su propia conexión, la usa y la cierra — Npgsql maneja el pool automáticamente
- No usar stored procedures, vistas ni triggers — todo el SQL va en los repositorios

---

## 1. UsuarioService

### Repositorio: IUsuarioRepository
- `GetAll()` — SELECT a usuario
- `GetById(idUser)` — SELECT a usuario por id_user
- `GetByCorreo(correo)` — SELECT a usuario por correo
- `ExisteCorreo(correo)` — SELECT COUNT donde correo = @correo
- `ExisteTelefono(telefono)` — SELECT COUNT donde telefono = @telefono
- `Insert(usuario)` — INSERT a usuario, retorna id generado
- `Update(usuario)` — UPDATE correo, telefono, contrasena
- `Delete(idUser)` — DELETE a usuario
- `GetEstudiante(idUser)` — SELECT a estudiante por id_usuario
- `InsertEstudiante(estudiante)` — INSERT a estudiante
- `UpdateEstudiante(estudiante)` — UPDATE carnet y universidad juntos
- `AgregarMillas(idUsuario, millas)` — UPDATE millas = millas + @millas

### Lógica de negocio: IUsuarioService
- `CrearUsuario(usuario, estudiante?)` — valida correo único, valida teléfono único, inserta usuario, si es estudiante inserta estudiante
- `Login(correo, contrasena)` — obtiene usuario por correo, valida contraseña
- `ActualizarUsuario(usuario)` — nombre NO se puede cambiar, valida correo único si cambia, valida teléfono único si cambia
- `ActualizarEstudiante(estudiante)` — si cambia universidad DEBE cambiar carnet, no se puede cambiar uno sin el otro
- `EliminarUsuario(id)` — elimina usuario
- `AgregarMillas(idUsuario, millas)` — llamado por otros services (BoletoService, CheckinService) no directamente por el cliente

### Endpoints
```
GET    /usuario              → GetAll
GET    /usuario/{id}         → GetById
POST   /usuario/login        → Login
POST   /usuario              → CrearUsuario
PUT    /usuario/{id}         → ActualizarUsuario
PUT    /usuario/{id}/estudiante → ActualizarEstudiante
PUT    /usuario/{id}/millas  → AgregarMillas
DELETE /usuario/{id}         → EliminarUsuario
```

---

## 2. ItinerarioService

### Repositorio: IItinerarioRepository
- `GetById(idItinerario)` — SELECT a itinerario con join a vuelo y aeropuerto
- `GetByVuelo(idVuelo)` — SELECT a itinerario por id_vuelo
- `Insert(itinerario)` — INSERT a itinerario
- `Update(itinerario)` — UPDATE a itinerario
- `CerrarItinerario(idItinerario)` — UPDATE estado = cerrado
- `CerrarPorRuta(idRuta)` — UPDATE estado = cerrado para todos los itinerarios de los vuelos de esa ruta
- `Buscar(idOrigen, idDestino, fecha, cantidadPasajeros)` — SELECT con join Ruta→Vuelo→Itinerario→AsientoItinerario, filtra estado abierto y asientos libres >= cantidadPasajeros
- `GetAsientosDisponibles(idItinerario)` — SELECT a AsientoItinerario donde estado = libre
- `InsertAsientoItinerario(idAsiento, idItinerario)` — INSERT a AsientoItinerario con estado libre
- `UpdateAsientoItinerario(idAsiento, idItinerario, estado)` — UPDATE estado en AsientoItinerario

### Lógica de negocio: IItinerarioService
- `BuscarItinerarios(idOrigen, idDestino, fecha, cantidadPasajeros)` — valida que exista ruta con ese origen/destino, obtiene vuelos de la ruta, filtra itinerarios por fecha + estado abierto + asientos libres >= cantidadPasajeros. Retorna RutaResultadoDTO con lista de VueloItinerarioDTO
- `AbrirVuelos(idRuta, listaItinerarios)` — usa RutaService para obtener vuelos de la ruta, crea itinerarios, genera AsientoItinerario con todos los asientos libres
- `CerrarVuelo(idItinerario)` — cambia estado a cerrado
- `ObtenerItinerario(idItinerario)` — retorna itinerario con info de vuelo
- `GetAsientosDisponibles(idItinerario)` — retorna asientos libres

### Endpoints
```
GET  /itinerario/buscar                     → BuscarItinerarios (query params: idOrigen, idDestino, fecha, cantidadPasajeros)
GET  /itinerario/{id}/asientos              → GetAsientosDisponibles
POST /itinerario/abrir                      → AbrirVuelos
PUT  /itinerario/{id}/cerrar                → CerrarVuelo
```

---

## 3. ReservaService

### Repositorios que usa
- `IReservaRepository` — CRUD reserva
- `IPasajeroRepository` — CRUD pasajero
- `IBoletoRepository` — CRUD boleto
- `IItinerarioRepository` — actualizar AsientoItinerario al reservar/cancelar

### Repositorio: IReservaRepository
- `GetById(idReserva)` — SELECT a reserva
- `GetByUsuario(idUsuario)` — SELECT a reserva por id_user
- `Insert(reserva)` — INSERT a reserva
- `UpdateEstado(idReserva, estado)` — UPDATE estado

### Repositorio: IPasajeroRepository
- `GetByPasaporte(pasaporte)` — SELECT a pasajero por pasaporte
- `ExistePasaporte(pasaporte)` — SELECT COUNT
- `Insert(pasajero)` — INSERT a pasajero
- `Update(pasajero)` — UPDATE a pasajero

### Repositorio: IBoletoRepository
- `GetById(idBoleto)` — SELECT a boleto con joins a itinerario, asiento, pasajero
- `GetByReserva(idReserva)` — SELECT boletos con info completa
- `GetByPasaporte(pasaporte)` — SELECT boletos por pasajero
- `Insert(boleto)` — INSERT a boleto
- `Update(boleto)` — UPDATE a boleto
- `UpdateCheckin(idBoleto, idAsiento)` — UPDATE ya_checkin = true y asiento

### Lógica de negocio: IReservaService
- `CrearReserva(crearReservaDTO)` — crea reserva con estado pendiente, crea o reutiliza pasajeros por pasaporte, por cada pasajero × cada itinerario crea boleto y actualiza AsientoItinerario a ocupado si se seleccionó asiento
- `ObtenerReserva(idReserva)` — retorna ReservaResponseDTO con boletos
- `ObtenerPorUsuario(idUsuario)` — retorna lista de reservas
- `PagarReserva(idReserva)` — valida que esté pendiente, cambia estado a pagada
- `CancelarReserva(idReserva)` — cambia estado a cancelada, libera asientos en AsientoItinerario

### Endpoints
```
POST   /reserva                    → CrearReserva
GET    /reserva/{id}               → ObtenerReserva
GET    /reserva/usuario/{idUsuario} → ObtenerPorUsuario
PUT    /reserva/{id}/pagar         → PagarReserva
DELETE /reserva/{id}               → CancelarReserva
```

---

## 4. CheckinService

### Repositorios que usa
- `IBoletoRepository`
- `IItinerarioRepository`
- `IPdfService`

### Lógica de negocio: ICheckinService
- `GetBoletosPorReserva(idReserva)` — retorna boletos con estado de checkin
- `GetBoletosPorPasajero(pasaporte)` — retorna boletos del pasajero
- `HacerCheckin(idBoleto, idAsiento)` — valida que no haya hecho checkin, si tenía asiento anterior lo libera en AsientoItinerario, ocupa el nuevo asiento, marca ya_checkin = true
- `GenerarPase(idBoleto)` — llama a PdfService con datos del boleto, itinerario y asiento

### Endpoints
```
GET  /checkin/reserva/{idReserva}    → GetBoletosPorReserva
GET  /checkin/pasajero/{pasaporte}   → GetBoletosPorPasajero
PUT  /checkin/{idBoleto}             → HacerCheckin
GET  /checkin/{idBoleto}/pase        → GenerarPase
```

---

## 5. MaletaService

### Repositorios que usa
- `IMaletaRepository`
- `IBoletoRepository` — para validar que el pasajero hizo checkin

### Repositorio: IMaletaRepository
- `GetById(idMaleta)` — SELECT a maleta
- `GetByPasaporte(pasaporte)` — SELECT maletas por pasaporte
- `CountByPasaporte(pasaporte)` — SELECT COUNT maletas del pasajero
- `Insert(maleta)` — INSERT a maleta
- `Delete(idMaleta)` — DELETE a maleta

### Lógica de negocio: IMaletaService
- `GetMaletasPorPasajero(pasaporte)` — retorna MaletaPasajeroDTO con maletas y cobro acumulado
- `CalcularCobro(pasaporte)` — cuenta maletas actuales: 0→gratis, 1→$50, 2+→$75
- `AsignarMaleta(maleta)` — valida que el pasajero tenga al menos un boleto con checkin hecho, calcula cobro, inserta maleta
- `EliminarMaleta(idMaleta)` — elimina maleta

### Endpoints
```
GET    /maleta/pasajero/{pasaporte}        → GetMaletasPorPasajero
GET    /maleta/pasajero/{pasaporte}/cobro  → CalcularCobro
POST   /maleta                             → AsignarMaleta
DELETE /maleta/{id}                        → EliminarMaleta
```

---

## 6. RutaService

### Repositorios que usa
- `IRutaRepository`
- `IItinerarioRepository` — para cerrar itinerarios al eliminar ruta o vuelo

### Repositorio: IRutaRepository
- `GetAll()` — SELECT a ruta con join a aeropuerto para nombres origen/destino
- `GetById(idRuta)` — SELECT a ruta con vuelos
- `Insert(ruta)` — INSERT a ruta
- `Update(ruta)` — UPDATE a ruta
- `Delete(idRuta)` — DELETE a ruta y sus vuelos
- `GetVuelos(idRuta)` — SELECT vuelos por id_ruta
- `GetVuelo(idVuelo)` — SELECT vuelo por id_vuelo
- `InsertVuelo(vuelo)` — INSERT a vuelo
- `DeleteVuelo(idVuelo)` — DELETE a vuelo

### Lógica de negocio: IRutaService
- `GetAll()` — retorna rutas con nombres de aeropuertos
- `GetById(idRuta)` — retorna ruta con sus vuelos
- `CrearRuta(ruta, listaVuelos)` — inserta ruta e inserta cada vuelo
- `ActualizarRuta(ruta)` — actualiza precio, origen, destino
- `EliminarRuta(idRuta)` — cierra todos los itinerarios activos de la ruta via ItinerarioRepository, elimina ruta
- `AgregarVuelo(idRuta, vuelo)` — inserta vuelo en la ruta
- `EliminarVuelo(idVuelo)` — cierra todos los itinerarios de todos los vuelos de la ruta, elimina vuelo

### Endpoints
```
GET    /ruta              → GetAll
GET    /ruta/{id}         → GetById
POST   /ruta              → CrearRuta
PUT    /ruta/{id}         → ActualizarRuta
DELETE /ruta/{id}         → EliminarRuta
POST   /ruta/{id}/vuelo   → AgregarVuelo
DELETE /vuelo/{idVuelo}   → EliminarVuelo
```

---

## 7. PromocionService

### Repositorio: IPromocionRepository
- `GetAll()` — SELECT a promocion con join a ruta y aeropuerto
- `GetById(idPromo)` — SELECT a promocion
- `GetActivas(fecha)` — SELECT donde fecha entre inicio y fin
- `Insert(promocion)` — INSERT a promocion
- `Update(promocion)` — UPDATE a promocion
- `Delete(idPromo)` — DELETE a promocion

### Lógica de negocio: IPromocionService
- `GetActivas()` — pasa fecha actual al repositorio
- `GetAll()` — retorna todas
- `CrearPromocion(promocion)` — inserta promocion
- `ActualizarPromocion(promocion)` — actualiza promocion
- `EliminarPromocion(idPromo)` — elimina promocion

### Endpoints
```
GET    /promocion/activas  → GetActivas
GET    /promocion          → GetAll
GET    /promocion/{id}     → GetById
POST   /promocion          → CrearPromocion
PUT    /promocion/{id}     → ActualizarPromocion
DELETE /promocion/{id}     → EliminarPromocion
```

---

## 8. AeropuertoService

### Repositorio: IAeropuertoRepository
- `GetAll()` — SELECT a aeropuerto
- `GetPuertas(idAeropuerto)` — SELECT a PuertasAeropuerto por id_aeropuerto
- `GetAviones()` — SELECT a avion

### Lógica de negocio: IAeropuertoService
- `GetAll()` — retorna aeropuertos
- `GetPuertas(idAeropuerto)` — retorna puertas del aeropuerto
- `GetAviones()` — retorna aviones disponibles

### Endpoints
```
GET  /aeropuerto                      → GetAll
GET  /aeropuerto/{id}/puertas         → GetPuertas
GET  /avion                           → GetAviones
```

---

## 9. PdfService

### Lógica: IPdfService
- `GenerarPaseAbordar(checkinResponseDTO)` — genera PDF con puerta de embarque, hora de salida, asiento y número de vuelo. Retorna byte[]

### Notas
- No tiene repositorio propio
- Es llamado por CheckinService
- Usar librería como iTextSharp o similar
