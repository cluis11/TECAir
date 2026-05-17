-- ============================================================
-- TECAir - Script 01: Estructura de la base de datos
-- Ejecutar conectado a la BD "tecair_db" como tecair_app
-- ============================================================
 
-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
 
CREATE TABLE usuario (
	id_user		SERIAL PRIMARY KEY,
	correo 		VARCHAR(50) UNIQUE NOT NULL,
	contrasena	VARCHAR(50) NOT NULL,
	nombre		VARCHAR(50) NOT NULL,
	ap1			VARCHAR(50) NOT NULL,
	ap2			VARCHAR(50),
	telefono	VARCHAR(50)	UNIQUE NOT NULL
);
 
CREATE TABLE estudiante (
	id_usuario	INT PRIMARY KEY REFERENCES usuario(id_user),
	carnet		VARCHAR(20) NOT NULL,
	universidad	VARCHAR(50) NOT NULL,
	millas 		FLOAT		NOT NULL DEFAULT 0	
);
 
-- ------------------------------------------------------------
-- AEROPUERTOS Y AVIONES
-- ------------------------------------------------------------
 
CREATE TABLE aeropuerto (
	id_aeropuerto 	SERIAL PRIMARY KEY,
	nombre			VARCHAR(100) NOT NULL,
	codigo		  	VARCHAR(5) UNIQUE NOT NULL,
	ciudad			VARCHAR(50) NOT NULL,
	pais			VARCHAR(50) NOT NULL
);
 
CREATE TABLE puertas_aeropuerto (
	id_aeropuerto 		INT 		NOT NULL REFERENCES aeropuerto(id_aeropuerto),
	puerta_embarque		VARCHAR(5) 	NOT NULL,
	PRIMARY KEY (id_aeropuerto, puerta_embarque)
);
 
CREATE TABLE avion (
	matricula	VARCHAR(20) PRIMARY KEY,
	capacidad	INT NOT NULL
);
 
CREATE TABLE asiento (
	id_asiento	SERIAL PRIMARY KEY,
	matricula	VARCHAR(20) NOT NULL REFERENCES avion(matricula),
	fila		VARCHAR(5) 	NOT NULL,
	columna		VARCHAR(5) 	NOT NULL,
	UNIQUE (matricula, fila, columna)
);
 
-- ------------------------------------------------------------
-- RUTAS Y VUELOS
-- ------------------------------------------------------------
 
CREATE TABLE ruta (
    id_ruta     SERIAL PRIMARY KEY,
    id_origen   INT     NOT NULL REFERENCES aeropuerto(id_aeropuerto),
    id_destino  INT     NOT NULL REFERENCES aeropuerto(id_aeropuerto),
    precio      DECIMAL(10,2) NOT NULL
);
 
CREATE TABLE vuelo (
    id_vuelo    SERIAL PRIMARY KEY,
    id_ruta     INT         NOT NULL REFERENCES ruta(id_ruta),
    id_origen   INT         NOT NULL REFERENCES aeropuerto(id_aeropuerto),
    id_destino  INT         NOT NULL REFERENCES aeropuerto(id_aeropuerto),
    matricula   VARCHAR(20) NOT NULL REFERENCES avion(matricula)
);
 
-- ------------------------------------------------------------
-- ITINERARIOS
-- ------------------------------------------------------------
 
CREATE TABLE itinerario (
    id_itinerario   SERIAL PRIMARY KEY,
    id_vuelo        INT         NOT NULL REFERENCES vuelo(id_vuelo),
    fecha           DATE        NOT NULL,
    salida          TIME        NOT NULL,
    llegada         TIME        NOT NULL,
    puerta_embarque VARCHAR(5)  NOT NULL,
    estado          VARCHAR(20) NOT NULL DEFAULT 'abierto'
        CHECK (estado IN ('abierto', 'cerrado'))
);
 
CREATE TABLE asiento_itinerario (
    id_asiento      INT NOT NULL REFERENCES asiento(id_asiento),
    id_itinerario   INT NOT NULL REFERENCES itinerario(id_itinerario),
    estado          VARCHAR(20) NOT NULL DEFAULT 'libre'
        CHECK (estado IN ('libre', 'ocupado')),
    PRIMARY KEY (id_asiento, id_itinerario)
);
 
-- ------------------------------------------------------------
-- PROMOCIONES
-- ------------------------------------------------------------
 
CREATE TABLE promocion (
    id_promo    SERIAL PRIMARY KEY,
    id_ruta     INT          NOT NULL REFERENCES ruta(id_ruta),
    porcentaje  DECIMAL(5,2) NOT NULL,
    inicio      DATE         NOT NULL,
    fin         DATE         NOT NULL,
    imagen      TEXT,
    CHECK (fin > inicio)
);
 
-- ------------------------------------------------------------
-- PASAJEROS Y RESERVAS
-- ------------------------------------------------------------
 
CREATE TABLE pasajero (
    pasaporte       VARCHAR(20) PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL,
    ap1             VARCHAR(50) NOT NULL,
    ap2             VARCHAR(50),
    nacionalidad    VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE       NOT NULL
);
 
CREATE TABLE reserva (
    id_reserva          SERIAL PRIMARY KEY,
    id_user             INT         NOT NULL REFERENCES usuario(id_user),
    pasaporte_titular   VARCHAR(20) NOT NULL REFERENCES pasajero(pasaporte),
    fecha               DATE        NOT NULL DEFAULT CURRENT_DATE,
    tipo                VARCHAR(20) NOT NULL DEFAULT 'ida'
        CHECK (tipo IN ('ida', 'ida_vuelta')),
    estado              VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'pagada', 'cancelada'))
);
 
CREATE TABLE boleto (
    id_boleto       SERIAL PRIMARY KEY,
    id_pasajero     VARCHAR(20) NOT NULL REFERENCES pasajero(pasaporte),
    id_itinerario   INT         NOT NULL REFERENCES itinerario(id_itinerario),
    id_asiento      INT         REFERENCES asiento(id_asiento),
    id_reserva      INT         NOT NULL REFERENCES reserva(id_reserva),
    estado          VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'pagado', 'cancelado')),
    ya_checkin      BOOLEAN     NOT NULL DEFAULT FALSE
);
 
-- ------------------------------------------------------------
-- MALETAS
-- ------------------------------------------------------------
 
CREATE TABLE maleta (
    id_maleta   SERIAL PRIMARY KEY,
    pasaporte   VARCHAR(20)  NOT NULL REFERENCES pasajero(pasaporte),
    color       VARCHAR(30)  NOT NULL,
    peso        FLOAT        NOT NULL
);
 
-- ------------------------------------------------------------
-- PERMISOS FINALES
-- ------------------------------------------------------------
 
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tecair_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tecair_app;