-- ============================================================
-- TECAir - Script 00: Crear permisos de la base de datos
-- Ejecutar como superusuario (postgres) en pgAdmin
-- ============================================================

GRANT CONNECT ON DATABASE tecair_db TO tecair_app;

GRANT USAGE ON SCHEMA public TO tecair_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tecair_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tecair_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tecair_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tecair_app;