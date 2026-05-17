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

SELECT * 
FROM puerta AS p, aeropuerto AS a
WHERE p.id_aeropuerto = a.id_aeropuerto
