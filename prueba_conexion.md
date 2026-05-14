# Prueba de Conexión PostgreSQL + API

## Tabla de prueba

```sql
CREATE TABLE prueba (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion VARCHAR(255)
);

INSERT INTO prueba (nombre, descripcion) VALUES 
('Test 1', 'Primera prueba'),
('Test 2', 'Segunda prueba');
```

---

## Permisos usuario tecair_app

```sql
GRANT CONNECT ON DATABASE tecair_test TO tecair_app;
GRANT USAGE ON SCHEMA public TO tecair_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tecair_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tecair_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tecair_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO tecair_app;
```

---

## Instalar Npgsql

En la terminal dentro de la carpeta del proyecto:

```bash
dotnet add package Npgsql
```

---

## Connection String

`appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=tecair_test;Username=tecair_app;Password=tecair123;"
  }
}
```

---

## Endpoints probados

```
GET    http://localhost:5103/prueba        → Lista todos
GET    http://localhost:5103/prueba/{id}   → Obtiene uno, 404 si no existe
POST   http://localhost:5103/prueba        → Crea uno
PUT    http://localhost:5103/prueba/{id}   → Actualiza, 404 si no existe
DELETE http://localhost:5103/prueba/{id}   → Elimina, 404 si no existe
```

Body para POST y PUT:
```json
{
  "nombre": "string",
  "descripcion": "string"
}
```
