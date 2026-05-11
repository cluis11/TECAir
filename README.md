# TECAir - Sistema de Gestión de Aerolínea

Proyecto #1  
Instituto Tecnológico de Costa Rica  
Escuela de Ingeniería en Computadores  
Curso: Bases de Datos (CE3101)  
I Semestre 2026  


---

## 📌 Descripción del Proyecto

**TECAir** es un sistema integral para la gestión de una aerolínea de bajo costo enfocada en transporte aéreo de pasajeros.

El sistema permite administrar:
- Reservaciones de vuelos
- Gestión de usuarios
- Check-in en aeropuerto
- Manejo de maletas
- Promociones
- Aplicación móvil offline con sincronización

---

## 🎯 Objetivo General

Desarrollar una aplicación distribuida que permita gestionar la operación completa de la aerolínea TECAir, integrando bases de datos, servicios API, aplicaciones web y móvil.

---

## 🧩 Arquitectura del Sistema

El sistema está compuesto por las siguientes capas:

-  **Base de Datos:** PostgreSQL
-  **Backend / API:** C# (.NET) desplegado en IIS
-  **Aplicación Web:** React + Bootstrap + HTML5 + CSS
-  **Aplicación Móvil:** React Native con SQLite local
-  **Sincronización:** Mobile ↔ API ↔ PostgreSQL

---

## ✈️ Funcionalidades principales

- Gestión de usuarios (CRUD)
- Búsqueda y gestión de vuelos
- Check-in de pasajeros
- Selección de asiento
- Gestión de maletas
- Gestión de promociones
- Base de datos local SQLite para App Movil

---

## 🧱 Tecnologías Utilizadas

### Backend
- C# (.NET)
- ASP.NET Web API
- IIS (despliegue local)

### Base de Datos
- PostgreSQL
- SQL scripts en capa de datos 

### Frontend Web
- React 
- Bootstrap
- HTML5 / CSS3

### App Móvil
- React Native
- SQLite

---


## 📦 Entregables

- 📘 Manual de usuario
- 📄 Documentación técnica completa
- 🛠️ Script de creación de base de datos
- 🧪 Script de datos iniciales
- 🌐 Aplicación Web funcional
- 📱 Aplicación Móvil funcional
- ⚙️ Web API
- 📦 Documento de instalación
- 📊 Plan de proyecto

---

## 🗃️ Estructura del Proyecto (Sugerida)

```text
TECAir/
├── backend/    # API en C#
├── database/   # Scripts PostgreSQL
├── web/        # Aplicación React
├── mobile/     # React Native + SQLite
├── docs/       # Documentación
├── git.ignore
└── README.md
```

---

## 📅 Cronograma de Entrega

- 📌 Plan de proyecto: **5 Mayo 2026**
- 📌 Avance 1: **12 Mayo 2026**
- 📌 Avance 2: **19 Mayo 2026**
- 📌 Entrega final: **26 Mayo 2026**

---