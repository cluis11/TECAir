-- ============================================================
-- TECAir - Script 03: Limpieza total y datos de prueba
-- Ejecutar conectado a tecair_db como tecair_app
-- ============================================================

-- ------------------------------------------------------------
-- LIMPIEZA TOTAL (orden respeta foreign keys)
-- ------------------------------------------------------------

DELETE FROM maleta;
DELETE FROM boleto;
DELETE FROM asiento_itinerario;
DELETE FROM itinerario;
DELETE FROM reserva;
DELETE FROM pasajero;
DELETE FROM estudiante;
DELETE FROM usuario;
DELETE FROM promocion;
DELETE FROM vuelo;
DELETE FROM ruta;
DELETE FROM asiento;
DELETE FROM puertas_aeropuerto;
DELETE FROM avion;
DELETE FROM aeropuerto;

-- Reiniciar secuencias
ALTER SEQUENCE aeropuerto_id_aeropuerto_seq RESTART WITH 1;
ALTER SEQUENCE asiento_id_asiento_seq RESTART WITH 1;
ALTER SEQUENCE ruta_id_ruta_seq RESTART WITH 1;
ALTER SEQUENCE vuelo_id_vuelo_seq RESTART WITH 1;
ALTER SEQUENCE itinerario_id_itinerario_seq RESTART WITH 1;
ALTER SEQUENCE usuario_id_user_seq RESTART WITH 1;
ALTER SEQUENCE reserva_id_reserva_seq RESTART WITH 1;
ALTER SEQUENCE boleto_id_boleto_seq RESTART WITH 1;
ALTER SEQUENCE maleta_id_maleta_seq RESTART WITH 1;
ALTER SEQUENCE promocion_id_promo_seq RESTART WITH 1;

-- ------------------------------------------------------------
-- AEROPUERTOS (12)
-- ------------------------------------------------------------

INSERT INTO aeropuerto (nombre, codigo, ciudad, pais) VALUES
('Aeropuerto Internacional Juan Santamaría',  'SJO', 'San José',           'Costa Rica'),
('Aeropuerto Internacional Daniel Oduber',    'LIR', 'Liberia',            'Costa Rica'),
('Aeropuerto Internacional Tocumen',          'PTY', 'Ciudad de Panamá',   'Panamá'),
('Aeropuerto Internacional El Dorado',        'BOG', 'Bogotá',             'Colombia'),
('Aeropuerto Internacional José M. Córdova',  'MED', 'Medellín',           'Colombia'),
('Aeropuerto Internacional La Aurora',        'GUA', 'Ciudad de Guatemala','Guatemala'),
('Aeropuerto Internacional Benito Juárez',    'MEX', 'Ciudad de México',   'México'),
('Aeropuerto Internacional de Cancún',        'CUN', 'Cancún',             'México'),
('Aeropuerto Adolfo Suárez Madrid-Barajas',   'MAD', 'Madrid',             'España'),
('Aeropuerto Internacional de Miami',         'MIA', 'Miami',              'Estados Unidos'),
('Aeropuerto Internacional JFK',              'JFK', 'Nueva York',         'Estados Unidos'),
('Aeropuerto Internacional LAX',              'LAX', 'Los Ángeles',        'Estados Unidos');

-- ------------------------------------------------------------
-- PUERTAS DE EMBARQUE
-- ------------------------------------------------------------

INSERT INTO puertas_aeropuerto (id_aeropuerto, puerta_embarque) VALUES
(1,'A1'),(1,'A2'),(1,'B1'),(1,'B2'),(1,'C1'),
(2,'A1'),(2,'A2'),
(3,'C1'),(3,'C2'),(3,'C3'),(3,'C4'),
(4,'D1'),(4,'D2'),(4,'D3'),
(5,'E1'),(5,'E2'),
(6,'F1'),(6,'F2'),
(7,'G1'),(7,'G2'),(7,'G3'),
(8,'H1'),(8,'H2'),
(9,'M1'),(9,'M2'),(9,'M3'),(9,'M4'),
(10,'N1'),(10,'N2'),(10,'N3'),
(11,'P1'),(11,'P2'),
(12,'Q1'),(12,'Q2');

-- ------------------------------------------------------------
-- AVIONES (6)
-- ------------------------------------------------------------

INSERT INTO avion (matricula, capacidad) VALUES
('TEC-001', 30),
('TEC-002', 30),
('TEC-003', 60),
('TEC-004', 60),
('TEC-005', 90),
('TEC-006', 90);

-- Asientos TEC-001 y TEC-002 (5 filas x 6 col = 30)
INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-001', f::text, c FROM generate_series(1,5) f, unnest(ARRAY['A','B','C','D','E','F']) c;

INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-002', f::text, c FROM generate_series(1,5) f, unnest(ARRAY['A','B','C','D','E','F']) c;

-- Asientos TEC-003 y TEC-004 (10 filas x 6 col = 60)
INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-003', f::text, c FROM generate_series(1,10) f, unnest(ARRAY['A','B','C','D','E','F']) c;

INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-004', f::text, c FROM generate_series(1,10) f, unnest(ARRAY['A','B','C','D','E','F']) c;

-- Asientos TEC-005 y TEC-006 (15 filas x 6 col = 90)
INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-005', f::text, c FROM generate_series(1,15) f, unnest(ARRAY['A','B','C','D','E','F']) c;

INSERT INTO asiento (matricula, fila, columna)
SELECT 'TEC-006', f::text, c FROM generate_series(1,15) f, unnest(ARRAY['A','B','C','D','E','F']) c;

-- ------------------------------------------------------------
-- RUTAS Y VUELOS (10 rutas)
-- ------------------------------------------------------------

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 3, 250.00); -- id_ruta=1
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES (1, 1, 3, 'TEC-001'); -- id_vuelo=1

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 4, 320.00); -- id_ruta=2
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(2, 1, 3, 'TEC-001'), -- id_vuelo=2
(2, 3, 4, 'TEC-002'); -- id_vuelo=3

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 9, 850.00); -- id_ruta=3
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(3, 1, 10, 'TEC-005'), -- id_vuelo=4
(3, 10, 9, 'TEC-006'); -- id_vuelo=5

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 7, 400.00); -- id_ruta=4
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES (4, 1, 7, 'TEC-003'); -- id_vuelo=6

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 6, 380.00); -- id_ruta=5
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES (5, 1, 6, 'TEC-002'); -- id_vuelo=7

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (2, 3, 200.00); -- id_ruta=6
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES (6, 2, 3, 'TEC-001'); -- id_vuelo=8

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 10, 550.00); -- id_ruta=7
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES (7, 1, 10, 'TEC-004'); -- id_vuelo=9

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 8, 300.00); -- id_ruta=8
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES (8, 1, 8, 'TEC-003'); -- id_vuelo=10

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (4, 9, 700.00); -- id_ruta=9
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(9, 4, 10, 'TEC-005'), -- id_vuelo=11
(9, 10, 9, 'TEC-006'); -- id_vuelo=12

INSERT INTO ruta (id_origen, id_destino, precio) VALUES (1, 12, 650.00); -- id_ruta=10
INSERT INTO vuelo (id_ruta, id_origen, id_destino, matricula) VALUES
(10, 1, 7, 'TEC-003'), -- id_vuelo=13
(10, 7, 12, 'TEC-004'); -- id_vuelo=14

-- ------------------------------------------------------------
-- ITINERARIOS (15 abiertos, 2 cerrados)
-- ------------------------------------------------------------

INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque) VALUES
(1, '2026-07-01', '08:00', '10:30', 'A1'), -- id=1
(1, '2026-07-01', '14:00', '16:30', 'A2'), -- id=2
(1, '2026-07-15', '08:00', '10:30', 'B1'), -- id=3
(2, '2026-07-01', '07:00', '09:30', 'A1'), -- id=4
(3, '2026-07-01', '11:00', '13:30', 'C1'), -- id=5
(4, '2026-07-10', '09:00', '13:00', 'C1'), -- id=6
(5, '2026-07-10', '16:00', '06:00', 'N1'), -- id=7
(6, '2026-07-05', '10:00', '13:30', 'B1'), -- id=8
(6, '2026-07-20', '10:00', '13:30', 'B2'), -- id=9
(7, '2026-07-03', '08:30', '10:00', 'A1'), -- id=10
(7, '2026-07-03', '15:00', '16:30', 'A2'), -- id=11
(9, '2026-07-08', '07:00', '11:30', 'C1'), -- id=12
(10, '2026-07-12', '09:00', '11:30', 'B1'),-- id=13
(11, '2026-07-15', '08:00', '12:00', 'D1'),-- id=14
(12, '2026-07-15', '15:00', '07:00', 'N2');-- id=15

INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque, estado) VALUES
(1, '2026-06-01', '08:00', '10:30', 'A1', 'cerrado'), -- id=16
(6, '2026-06-05', '10:00', '13:30', 'B1', 'cerrado'); -- id=17

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
SELECT id_asiento, 6, 'libre' FROM asiento WHERE matricula = 'TEC-005';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 7, 'libre' FROM asiento WHERE matricula = 'TEC-006';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 8, 'libre' FROM asiento WHERE matricula = 'TEC-003';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 9, 'libre' FROM asiento WHERE matricula = 'TEC-003';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 10, 'libre' FROM asiento WHERE matricula = 'TEC-002';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 11, 'libre' FROM asiento WHERE matricula = 'TEC-002';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 12, 'libre' FROM asiento WHERE matricula = 'TEC-004';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 13, 'libre' FROM asiento WHERE matricula = 'TEC-003';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 14, 'libre' FROM asiento WHERE matricula = 'TEC-005';
INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 15, 'libre' FROM asiento WHERE matricula = 'TEC-006';

-- ------------------------------------------------------------
-- USUARIOS (15)
-- ------------------------------------------------------------

INSERT INTO usuario (correo, contrasena, nombre, ap1, ap2, telefono) VALUES
('juan@tec.ac.cr',    'pass1234', 'Juan',    'Pérez',     'López',    '88881111'),
('maria@tec.ac.cr',   'pass1234', 'María',   'González',  'Mora',     '88882222'),
('carlos@tec.ac.cr',  'pass1234', 'Carlos',  'Rodríguez', 'Jiménez',  '88883333'),
('ana@tec.ac.cr',     'pass1234', 'Ana',     'Martínez',  'Solano',   '88884444'),
('luis@tec.ac.cr',    'pass1234', 'Luis',    'Hernández', 'Castro',   '88885555'),
('sofia@tec.ac.cr',   'pass1234', 'Sofía',   'Vargas',    'Blanco',   '88886666'),
('pedro@gmail.com',   'pass1234', 'Pedro',   'Alvarado',  'Núñez',    '88887777'),
('laura@gmail.com',   'pass1234', 'Laura',   'Sánchez',   'Rojas',    '88888888'),
('diego@gmail.com',   'pass1234', 'Diego',   'Ramírez',   'Torres',   '88889999'),
('valeria@gmail.com', 'pass1234', 'Valeria', 'Morales',   'Arias',    '88880000'),
('andres@ucr.ac.cr',  'pass1234', 'Andrés',  'Quesada',   'Salas',    '77771111'),
('paula@ucr.ac.cr',   'pass1234', 'Paula',   'Esquivel',  'Méndez',   '77772222'),
('roberto@una.ac.cr', 'pass1234', 'Roberto', 'Fonseca',   'Chaves',   '77773333'),
('karen@una.ac.cr',   'pass1234', 'Karen',   'Vindas',    'Porras',   '77774444'),
('miguel@gmail.com',  'pass1234', 'Miguel',  'Brenes',    'Ugalde',   '77775555');

INSERT INTO estudiante (id_usuario, carnet, universidad, millas) VALUES
(1,  '2021123456', 'Instituto Tecnológico de Costa Rica', 1500.0),
(2,  '2022654321', 'Instituto Tecnológico de Costa Rica', 750.0),
(3,  '2020111222', 'Instituto Tecnológico de Costa Rica', 0.0),
(4,  '2023333444', 'Instituto Tecnológico de Costa Rica', 2500.0),
(11, '2019555666', 'Universidad de Costa Rica', 0.0),
(12, '2021777888', 'Universidad de Costa Rica', 500.0),
(13, '2022999000', 'Universidad Nacional', 0.0),
(14, '2023111333', 'Universidad Nacional', 300.0);

-- ------------------------------------------------------------
-- PASAJEROS (20)
-- ------------------------------------------------------------

INSERT INTO pasajero (pasaporte, nombre, ap1, ap2, nacionalidad, fecha_nacimiento) VALUES
('PA001', 'Juan',    'Pérez',     'López',    'Costarricense', '1998-03-15'),
('PA002', 'María',   'González',  'Mora',     'Costarricense', '1999-07-22'),
('PA003', 'Carlos',  'Rodríguez', 'Jiménez',  'Costarricense', '2000-01-10'),
('PA004', 'Ana',     'Martínez',  'Solano',   'Costarricense', '1997-11-05'),
('PA005', 'Luis',    'Hernández', 'Castro',   'Costarricense', '2001-06-30'),
('PA006', 'Sofía',   'Vargas',    'Blanco',   'Costarricense', '2002-09-18'),
('PA007', 'Pedro',   'Alvarado',  'Núñez',    'Costarricense', '1995-04-25'),
('PA008', 'Laura',   'Sánchez',   'Rojas',    'Costarricense', '1993-12-08'),
('PA009', 'Diego',   'Ramírez',   'Torres',   'Colombiano',    '1990-08-14'),
('PA010', 'Valeria', 'Morales',   'Arias',    'Costarricense', '1996-02-28'),
('PA011', 'Andrés',  'Quesada',   'Salas',    'Costarricense', '2000-05-17'),
('PA012', 'Paula',   'Esquivel',  'Méndez',   'Costarricense', '2001-10-03'),
('PA013', 'Roberto', 'Fonseca',   'Chaves',   'Costarricense', '1992-07-19'),
('PA014', 'Karen',   'Vindas',    'Porras',   'Costarricense', '1994-03-11'),
('PA015', 'Miguel',  'Brenes',    'Ugalde',   'Costarricense', '1991-01-25'),
('PA016', 'Daniela', 'Castro',    'Mora',     'Guatemalteca',  '1998-06-14'),
('PA017', 'Ernesto', 'López',     'Vega',     'Colombiano',    '1987-09-30'),
('PA018', 'Carmen',  'Ruiz',      'Salinas',  'Española',      '1985-12-22'),
('PA019', 'Tomás',   'Navarro',   'Gil',      'Mexicano',      '1993-04-07'),
('PA020', 'Lucía',   'Fernández', 'Pardo',    'Estadounidense','1996-08-19');

-- ------------------------------------------------------------
-- RESERVAS Y BOLETOS (12 reservas)
-- ------------------------------------------------------------

-- CASO 1: Pagada, check-in hecho, CON maletas
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (1, 'PA001', '2026-06-15', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA001', 1, 1, 1, 'pagado', true);
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 1 AND id_itinerario = 1;
INSERT INTO maleta (pasaporte, id_boleto, color, peso) VALUES
('PA001', 1, 'negro', 23.5),
('PA001', 1, 'azul',  18.0);

-- CASO 2: Pagada, check-in hecho, SIN maletas
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (2, 'PA002', '2026-06-16', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA002', 1, 2, 2, 'pagado', true);
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 2 AND id_itinerario = 1;

-- CASO 3: Pagada, SIN check-in
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (3, 'PA003', '2026-06-17', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA003', 2, NULL, 3, 'pagado', false);

-- CASO 4: PENDIENTE, no debe aparecer en check-in
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (4, 'PA004', '2026-06-18', 'pendiente');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA004', 8, NULL, 4, 'pendiente', false);

-- CASO 5: Con escala, tramo 1 chequeado, tramo 2 pendiente
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (5, 'PA005', '2026-06-19', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA005', 4, 3, 5, 'pagado', true),
('PA005', 5, NULL, 5, 'pagado', false);
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 3 AND id_itinerario = 4;

-- CASO 6: 2 pasajeros, pagada, sin check-in
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (7, 'PA007', '2026-06-20', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA007', 10, NULL, 6, 'pagado', false),
('PA008', 10, NULL, 6, 'pagado', false);

-- CASO 7: Pagada, check-in hecho, CON maletas, vuelo diferente
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (6, 'PA006', '2026-06-21', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA006', 10, 31, 7, 'pagado', true);
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 31 AND id_itinerario = 10;
INSERT INTO maleta (pasaporte, id_boleto, color, peso) VALUES
('PA006', 9, 'rojo', 20.0);

-- CASO 8: Pagada, sin check-in, vuelo SJO→MAD con escala
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (9, 'PA009', '2026-06-22', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA009', 6, NULL, 8, 'pagado', false),
('PA009', 7, NULL, 8, 'pagado', false);

-- CASO 9: Pagada, check-in hecho, SIN maletas, SJO→MIA
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (10, 'PA010', '2026-06-23', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA010', 12, 121, 9, 'pagado', true);
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 121 AND id_itinerario = 12;

-- CASO 10: Pagada, check-in hecho, 3 maletas para probar cobro
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (11, 'PA011', '2026-06-24', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA011', 13, 61, 10, 'pagado', true);
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 61 AND id_itinerario = 13;
INSERT INTO maleta (pasaporte, id_boleto, color, peso) VALUES
('PA011', 13, 'negro',  22.0),
('PA011', 13, 'gris',   19.5),
('PA011', 13, 'verde',  15.0);

-- CASO 11: 2 pasajeros, pagada, sin check-in, SJO→BOG con escala
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (12, 'PA012', '2026-06-25', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA012', 4, NULL, 11, 'pagado', false),
('PA012', 5, NULL, 11, 'pagado', false),
('PA013', 4, NULL, 11, 'pagado', false),
('PA013', 5, NULL, 11, 'pagado', false);

-- CASO 12: Ambos tramos chequeados, SIN maletas, SJO→BOG
INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (14, 'PA014', '2026-06-26', 'pagada');
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin) VALUES
('PA014', 4, 4, 12, 'pagado', true),
('PA014', 5, 32, 12, 'pagado', true);
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 4 AND id_itinerario = 4;
UPDATE asiento_itinerario SET estado = 'ocupado' WHERE id_asiento = 32 AND id_itinerario = 5;

-- ------------------------------------------------------------
-- VUELO EXTRA PARA REPORTE DE CIERRE (Script_06)
-- LIR → PTY, 2026-08-01, TEC-001
-- ------------------------------------------------------------

INSERT INTO itinerario (id_vuelo, fecha, salida, llegada, puerta_embarque, estado) VALUES
(8, '2026-08-01', '07:00', '09:00', 'A1', 'abierto'); -- id=18

INSERT INTO asiento_itinerario (id_asiento, id_itinerario, estado)
SELECT id_asiento, 18, 'libre' FROM asiento WHERE matricula = 'TEC-001';

INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (7, 'PA007', '2026-07-01', 'pagada'); -- id=13
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin)
SELECT 'PA007', 18, id_asiento, 13, 'pagado', true
FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'A';
UPDATE asiento_itinerario SET estado = 'ocupado'
WHERE id_itinerario = 18 AND id_asiento = (SELECT id_asiento FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'A');
INSERT INTO maleta (pasaporte, id_boleto, color, peso) VALUES
('PA007', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA007' AND id_itinerario = 18), 'negro', 23.0),
('PA007', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA007' AND id_itinerario = 18), 'azul', 18.0);

INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (8, 'PA008', '2026-07-01', 'pagada'); -- id=14
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin)
SELECT 'PA008', 18, id_asiento, 14, 'pagado', true
FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'B';
UPDATE asiento_itinerario SET estado = 'ocupado'
WHERE id_itinerario = 18 AND id_asiento = (SELECT id_asiento FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'B');
INSERT INTO maleta (pasaporte, id_boleto, color, peso) VALUES
('PA008', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA008' AND id_itinerario = 18), 'rojo',  22.0),
('PA008', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA008' AND id_itinerario = 18), 'verde', 15.5),
('PA008', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA008' AND id_itinerario = 18), 'gris',  19.0);

INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (9, 'PA009', '2026-07-01', 'pagada'); -- id=15
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin)
SELECT 'PA009', 18, id_asiento, 15, 'pagado', true
FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'C';
UPDATE asiento_itinerario SET estado = 'ocupado'
WHERE id_itinerario = 18 AND id_asiento = (SELECT id_asiento FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'C');

INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (10, 'PA010', '2026-07-01', 'pagada'); -- id=16
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin)
SELECT 'PA010', 18, id_asiento, 16, 'pagado', true
FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'D';
UPDATE asiento_itinerario SET estado = 'ocupado'
WHERE id_itinerario = 18 AND id_asiento = (SELECT id_asiento FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'D');
INSERT INTO maleta (pasaporte, id_boleto, color, peso) VALUES
('PA010', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA010' AND id_itinerario = 18), 'café', 20.0);

INSERT INTO reserva (id_user, pasaporte_titular, fecha, estado) VALUES (11, 'PA011', '2026-07-01', 'pagada'); -- id=17
INSERT INTO boleto (id_pasajero, id_itinerario, id_asiento, id_reserva, estado, ya_checkin)
SELECT 'PA011', 18, id_asiento, 17, 'pagado', true
FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'E';
UPDATE asiento_itinerario SET estado = 'ocupado'
WHERE id_itinerario = 18 AND id_asiento = (SELECT id_asiento FROM asiento WHERE matricula = 'TEC-001' AND fila = '1' AND columna = 'E');
INSERT INTO maleta (pasaporte, id_boleto, color, peso) VALUES
('PA011', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA011' AND id_itinerario = 18), 'negro',  21.0),
('PA011', (SELECT id_boleto FROM boleto WHERE id_pasajero = 'PA011' AND id_itinerario = 18), 'blanco', 16.0);

-- ------------------------------------------------------------
-- PROMOCIONES (5 activas)
-- ------------------------------------------------------------

INSERT INTO promocion (id_ruta, porcentaje, inicio, fin, imagen) VALUES
(1, 15.00, '2026-06-01', '2026-08-31', NULL),
(2, 10.00, '2026-06-15', '2026-07-31', NULL),
(3, 20.00, '2026-07-01', '2026-09-30', NULL),
(7, 12.00, '2026-06-20', '2026-08-15', NULL),
(4,  8.00, '2026-07-01', '2026-07-31', NULL);

-- ------------------------------------------------------------
-- VERIFICACION
-- ------------------------------------------------------------

SELECT 'aeropuertos'  AS tabla, COUNT(*) FROM aeropuerto
UNION ALL SELECT 'aviones',      COUNT(*) FROM avion
UNION ALL SELECT 'asientos',     COUNT(*) FROM asiento
UNION ALL SELECT 'rutas',        COUNT(*) FROM ruta
UNION ALL SELECT 'vuelos',       COUNT(*) FROM vuelo
UNION ALL SELECT 'itinerarios',  COUNT(*) FROM itinerario
UNION ALL SELECT 'usuarios',     COUNT(*) FROM usuario
UNION ALL SELECT 'estudiantes',  COUNT(*) FROM estudiante
UNION ALL SELECT 'pasajeros',    COUNT(*) FROM pasajero
UNION ALL SELECT 'reservas',     COUNT(*) FROM reserva
UNION ALL SELECT 'boletos',      COUNT(*) FROM boleto
UNION ALL SELECT 'maletas',      COUNT(*) FROM maleta
UNION ALL SELECT 'promociones',  COUNT(*) FROM promocion;