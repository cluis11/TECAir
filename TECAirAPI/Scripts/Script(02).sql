-- ============================================================
-- TECAir - Script 02: Datos iniciales de prueba
-- Ejecutar después de 01_create_tables.sql
-- ============================================================

-- ------------------------------------------------------------
-- AEROPUERTOS
-- ------------------------------------------------------------
 
INSERT INTO aeropuerto (nombre, codigo, ciudad, pais) VALUES
('Aeropuerto Internacional Juan Santamaría', 'SJO', 'San José',            'Costa Rica'),
('Aeropuerto Internacional Daniel Oduber',   'LIR', 'Liberia',             'Costa Rica'),
('Aeropuerto Internacional Tocumen',         'PTY', 'Ciudad de Panamá',    'Panamá'),
('Aeropuerto Internacional El Dorado',       'BOG', 'Bogotá',              'Colombia'),
('Aeropuerto Internacional La Aurora',       'GUA', 'Ciudad de Guatemala', 'Guatemala');

-- ------------------------------------------------------------
-- PUERTAS DE EMBARQUE
-- ------------------------------------------------------------
 
INSERT INTO puertas_aeropuerto (id_aeropuerto, puerta_embarque) VALUES
(1, 'A1'), (1, 'A2'), (1, 'B1'), (1, 'B2'),
(2, 'A1'), (2, 'A2'),
(3, 'C1'), (3, 'C2'), (3, 'C3'),
(4, 'D1'), (4, 'D2'),
(5, 'E1'), (5, 'E2');

-- ------------------------------------------------------------
-- AVIONES Y ASIENTOS
-- ------------------------------------------------------------
 
INSERT INTO avion (matricula, capacidad) VALUES
('TEC-001', 30),
('TEC-002', 30);
 
-- Asientos avión TEC-001 (5 filas x 6 columnas = 30 asientos)
INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-001', f::text, c
FROM generate_series(1, 5) f,
     unnest(ARRAY['A','B','C','D','E','F']) c;
 
-- Asientos avión TEC-002 (5 filas x 6 columnas = 30 asientos)
INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-002', f::text, c
FROM generate_series(1, 5) f,
     unnest(ARRAY['A','B','C','D','E','F']) c;

-- ------------------------------------------------------------
-- RUTAS Y VUELOS
-- ------------------------------------------------------------
 
-- Ruta 1: SJO → PTY (directo)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 3, 250.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(1, 1, 3, 'TEC-001');
 
-- Ruta 2: SJO → BOG (escala en PTY)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 4, 320.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(2, 1, 3, 'TEC-001'),  -- id_vuelo = 2 SJO → PTY
(2, 3, 4, 'TEC-002');  -- id_vuelo = 3 PTY → BOG
 
-- Ruta 3: SJO → GUA (escalas en PTY y BOG)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 5, 450.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(3, 1, 3, 'TEC-001'),  -- id_vuelo = 4 SJO → PTY
(3, 3, 4, 'TEC-002'),  -- id_vuelo = 5 PTY → BOG
(3, 4, 5, 'TEC-001');  -- id_vuelo = 6 BOG → GUA

-- Ruta 4: SJO → GUA (directo)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 5, 380.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(4, 1, 5, 'TEC-002');  -- id_vuelo = 7 SJO → GUA directo

-- Ruta 5: LIR → PTY (directo)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (2, 3, 200.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(5, 2, 3, 'TEC-001');  -- id_vuelo = 8

-- ------------------------------------------------------------
-- ITINERARIOS
-- ------------------------------------------------------------
 
-- Ruta 1 - vuelo 1 (SJO→PTY): dos horarios el mismo día
INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque) VALUES
(1, '2026-06-01', '08:00', '10:30', 'A1'),  -- id_itinerario = 1
(1, '2026-06-01', '14:00', '16:30', 'A2'),  -- id_itinerario = 2
(1, '2026-06-15', '08:00', '10:30', 'A1');  -- id_itinerario = 3

-- Ruta 2 - vuelos 2 y 3 (SJO→PTY→BOG)
INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque) VALUES
(2, '2026-06-01', '08:00', '10:30', 'A1'),  -- id_itinerario = 4
(3, '2026-06-01', '12:00', '14:30', 'C1');  -- id_itinerario = 5

-- Ruta 3 - vuelos 4, 5 y 6 (SJO→PTY→BOG→GUA)
INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque) VALUES
(4, '2026-06-01', '08:00', '10:30', 'A2'),  -- id_itinerario = 6
(5, '2026-06-01', '12:00', '14:30', 'C2'),  -- id_itinerario = 7
(6, '2026-06-01', '16:00', '17:30', 'D1');  -- id_itinerario = 8

-- Ruta 4 - vuelo 7 (SJO→GUA directo)
INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque) VALUES
(7, '2026-06-01', '09:00', '11:00', 'B1');  -- id_itinerario = 9

-- Ruta 5 - vuelo 8 (LIR→PTY)
INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque) VALUES
(8, '2026-06-01', '10:00', '12:00', 'A1');  -- id_itinerario = 10

-- ------------------------------------------------------------
-- ASIENTOS POR ITINERARIO
-- ------------------------------------------------------------
 
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 1, 'libre' FROM asiento WHERE matricula = 'TEC-001';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 2, 'libre' FROM asiento WHERE matricula = 'TEC-001';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 3, 'libre' FROM asiento WHERE matricula = 'TEC-001';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 4, 'libre' FROM asiento WHERE matricula = 'TEC-001';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 5, 'libre' FROM asiento WHERE matricula = 'TEC-002';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 6, 'libre' FROM asiento WHERE matricula = 'TEC-001';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 7, 'libre' FROM asiento WHERE matricula = 'TEC-002';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 8, 'libre' FROM asiento WHERE matricula = 'TEC-001';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 9, 'libre' FROM asiento WHERE matricula = 'TEC-002';

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 10, 'libre' FROM asiento WHERE matricula = 'TEC-001';

-- ------------------------------------------------------------
-- PROMOCIONES
-- ------------------------------------------------------------
 
INSERT INTO promocion (id_ruta, porcentaje, inicio, fin, imagen) VALUES
(1, 15.00, '2026-05-01', '2026-06-30', NULL),
(2, 10.00, '2026-06-01', '2026-07-31', NULL);

-- ------------------------------------------------------------
-- Usuarios
-- ------------------------------------------------------------

INSERT INTO usuario (correo, contrasena, nombre, ap1, ap2, telefono) VALUES
('juan@tec.ac.cr', 'pass1234', 'Juan',  'Pérez',   'López', '88881111'),
('maria@tec.ac.cr','pass1234', 'María', 'González', 'Mora',  '88882222');

INSERT INTO estudiante (id_usuario, carnet, universidad, millas) VALUES
(1, '2021123456', 'TEC', 0.0),
(2, '2022654321', 'TEC', 0.0);

-- ------------------------------------------------------------
-- VERIFICACION
-- ------------------------------------------------------------

SELECT * FROM aeropuerto;
SELECT * FROM avion;
SELECT * FROM asiento;
SELECT * FROM usuario;
SELECT * FROM pasajero;
SELECT * FROM ruta;
SELECT * FROM vuelo;
SELECT * FROM itinerario;
SELECT * FROM asiento_itinerario;
SELECT * FROM reserva;

