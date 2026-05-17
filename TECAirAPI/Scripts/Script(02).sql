-- ============================================================
-- TECAir - Script 02: Datos iniciales de prueba
-- Ejecutar después de 01_create_tables.sql
-- ============================================================

-- ------------------------------------------------------------
-- AEROPUERTOS
-- ------------------------------------------------------------

INSERT INTO aeropuerto (nombre, codigo, ciudad, pais) VALUES
('Aeropuerto Internacional Juan Santamaría', 'SJO', 'San José',    'Costa Rica'),
('Aeropuerto Internacional Daniel Oduber',   'LIR', 'Liberia',     'Costa Rica'),
('Aeropuerto Internacional Tocumen',          'PTY', 'Ciudad de Panamá', 'Panamá'),
('Aeropuerto Internacional El Dorado',        'BOG', 'Bogotá',     'Colombia'),
('Aeropuerto Internacional La Aurora',        'GUA', 'Ciudad de Guatemala', 'Guatemala');

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
 
-- Asientos avión TEC-001 (5 filas x 6 columnas)
--INSERT INTO asiento (matricula, fila, columna)
--SELECT 'TEC-001', f::text, c
--FROM generate_series(1, 5) f,
--     unnest(ARRAY['A','B','C','D','E','F']) c;
 
-- Asientos avión TEC-002 (5 filas x 6 columnas)
--INSERT INTO asiento (matricula, fila, columna)
--SELECT 'TEC-002', f::text, c
--FROM generate_series(1, 5) f,
--     unnest(ARRAY['A','B','C','D','E','F']) c;

-- ------------------------------------------------------------
-- RUTAS y VUELOS
-- ------------------------------------------------------------

-- Ruta 1: SJO → PTY (vuelo directo, sin escalas)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 3, 200.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(1, 1, 3, 'TEC-001');
 
-- Ruta 2: SJO → BOG (una escala en PTY)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 4, 320.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(2, 1, 3, 'TEC-001'),   -- SJO → PTY
(2, 3, 4, 'TEC-002');   -- PTY → BOG
 
-- Ruta 3: SJO → GUA (dos escalas: PTY y BOG)
INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 5, 450.00);
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(3, 1, 3, 'TEC-001'),   -- SJO → PTY
(3, 3, 4, 'TEC-002'),   -- PTY → BOG
(3, 4, 5, 'TEC-001');   -- BOG → GUA

-- ------------------------------------------------------------
-- PROMOCIONES
-- ------------------------------------------------------------
 
INSERT INTO promocion (id_ruta, porcentaje, inicio, fin, imagen) VALUES
(1, 15.00, '2026-05-01', '2026-06-30', NULL),
(3, 10.00, '2026-06-01', '2026-07-31', NULL);

-- ------------------------------------------------------------
-- VERIFICACION
-- ------------------------------------------------------------
 
SELECT * FROM aeropuerto;
SELECT * FROM avion;
SELECT * FROM asiento;
SELECT * FROM ruta;
SELECT * FROM vuelo;
SELECT * FROM promocion;