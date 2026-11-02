<div align="center">

# 🍽️ GastroHub — Culinary Management & Recipe Suite

**Plataforma full-stack moderna para estandarización gastronómica, gestión de fichas técnicas de recetas, escalado dinámico de porciones y control de mise en place.**

[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## ✨ Características Principales

- **📋 Fichas Técnicas Gastronómicas Completas:** Registro de título, descripción sensorial, categoría (`Entrada`, `Plato Fuerte`, `Postre`, `Bebida`, `Ensalada`, `Sopa`, `Snack`), dificultad (`Fácil`, `Media`, `Alta`), tiempo, porciones, calorías (`kcal`), fotografía y colección de favoritos.
- **⚖️ Calculadora de Rendimiento (Escalador de Porciones en Vivo):** Ajusta dinámicamente el número de porciones en cualquier ficha técnica y recalcula todas las cantidades de ingredientes en tiempo real.
- **👨‍🍳 Modo Cocina Interactiva (Mise en Place & Paso a Paso):** Lista interactiva de ingredientes y pasos con barra de progreso en vivo para marcar el avance durante la preparación.
- **🖨️ Impresión de Ficha Técnica:** Hoja de estilos `@media print` optimizada para imprimir o exportar a PDF fichas limpias para cocina.
- **⊞ Vista Dual (Tarjetas Gourmet & Tabla Ejecutiva):** Alterna instantáneamente entre galería visual de tarjetas y tabla ejecutiva con paginación.
- **🔍 Búsqueda y Filtros Multicriterio:** Filtra simultáneamente por texto (título, descripción o ingrediente), categoría, dificultad, tiempo, mínimo de ingredientes, favoritos y ordenamiento múltiple.
- **⚡ Resiliencia Zero-Config (MongoDB + Fallback en Memoria):** Funciona conectado a **MongoDB / Atlas** (sembrando automáticamente 6 recetas gourmet iniciales si la base está vacía) y cuenta con un **almacén en memoria de respaldo** automático si se ejecuta en desarrollo sin `MONGO_URI`.
- **🛡️ API RESTful con Validación Estricta y Tests Automatizados:** Sanitización de payloads sin campos extra, cabeceras de seguridad, healthcheck (`/api/health`) y suite de pruebas con `node:test`.

---

## 🗂️ Arquitectura del Proyecto

```text
GastroHub/
├── backend/                                  # API RESTful con Express 5 + Mongoose 9
│   ├── App/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── recetaController.js       # Controladores CRUD, estadísticas y favoritos
│   │   │   └── Request/
│   │   │       ├── recetaValidationRules.js  # Reglas estrictas de validación y saneamiento
│   │   │       ├── createRecetaRequest.js
│   │   │       ├── updateRecetaRequest.js
│   │   │       ├── replaceRecetaRequest.js
│   │   │       └── destroyRecetaRequest.js
│   │   └── Models/
│   │       └── Receta.js                     # Esquema Mongoose enriquecido
│   ├── Routes/
│   │   └── api.js                            # Definición de endpoints REST
│   ├── config/
│   │   ├── database.js                       # Conexión MongoDB + fallback en memoria
│   │   └── recetasIniciales.js               # Dataset de 6 recetas gourmet de autor
│   ├── tests/
│   │   └── recetas.test.js                   # Suite de pruebas de integración (node:test)
│   ├── Dockerfile
│   ├── seed.js                               # Script para poblar MongoDB
│   └── server.js                             # Entrada de la API + middlewares de seguridad
│
├── frontend/                                 # SPA con React 19 + Vite 7 + Tailwind CSS v4
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/Navbar.jsx             # Barra de navegación con contadores en vivo
│   │   │   ├── recetas/
│   │   │   │   ├── FiltrosRecetas.jsx        # Panel multicriterio
│   │   │   │   ├── TablaRecetas.jsx          # Vista dual: Grid de Tarjetas y Tabla
│   │   │   │   ├── FormularioReceta.jsx      # Formulario dinámico de ficha técnica
│   │   │   │   └── DetalleReceta.jsx         # Escalador de porciones + Modo Cocina
│   │   │   └── ui/                           # Modal, ConfirmacionModal, Spinner
│   │   ├── context/RecetaContext.jsx         # Estado global y acciones asíncronas
│   │   ├── services/recetaService.js         # Cliente HTTP Axios
│   │   └── views/
│   │       ├── Inicio/InicioView.jsx         # Landing page gastronómica con AOS
│   │       └── Catalogo/CatalogoView.jsx     # Dashboard KPIs + Catálogo interactivo
│   ├── Dockerfile
│   └── nginx.conf
│
└── docker-compose.yml                        # Orquestación completa (MongoDB + API + Web)
```

---

## 🚀 Inicio Rápido (Local)

### 1. Clonar el repositorio

```bash
git clone https://github.com/campodidier07-collab/GastroHub.git
cd GastroHub
```

### 2. Ejecutar el Backend (`http://localhost:5000`)

```bash
cd backend
npm install
cp .env.example .env
```

> 💡 **Nota:** Si configuras `MONGO_URI` en `.env`, GastroHub se conectará a tu instancia de MongoDB y sembrará las 6 recetas gourmet iniciales automáticamente. Si dejas `.env` sin configurar en desarrollo, el servidor activará automáticamente el almacén en memoria pre-cargado para que puedas probar todo al instante.

```bash
# Iniciar en modo desarrollo
npm run dev

# Ejecutar suite de tests automatizados
npm test
```

### 3. Ejecutar el Frontend (`http://localhost:5173`)

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🐳 Despliegue con Docker Compose

Levanta **MongoDB 7 + Backend API + Frontend Nginx** con un solo comando:

```bash
docker compose up --build -d
```

- **Aplicación Web (Frontend):** `http://localhost:8080`
- **API RESTful (Backend):** `http://localhost:5000/api/recetas`
- **Healthcheck:** `http://localhost:5000/api/health`

---

## 📡 Endpoints de la API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Estado de salud del servicio y motor de almacenamiento activo |
| `GET` | `/api/recetas` | Listar todas las recetas ordenadas por fecha de creación |
| `GET` | `/api/recetas/estadisticas` | Obtener KPIs del catálogo (totales, favoritas, distribución por categoría/dificultad) |
| `GET` | `/api/recetas/:id` | Obtener la ficha técnica completa de una receta por ID |
| `POST` | `/api/recetas` | Crear una nueva receta con validación estricta de payload |
| `PATCH` | `/api/recetas/:id` | Actualizar parcialmente los campos de una receta |
| `PUT` | `/api/recetas/:id` | Reemplazar completamente una receta |
| `PATCH` | `/api/recetas/:id/favorito` | Alternar el estado de favorito (`true` / `false`) |
| `DELETE` | `/api/recetas/:id` | Eliminar una receta del catálogo |

### Ejemplo de Payload (`POST /api/recetas`)

```json
{
  "titulo": "Risotto Cremoso de Hongos Silvestres y Trufa",
  "descripcion": "Arroz arbóreo cocinado lentamente en caldo de vegetales tostados y aceite de trufa negra.",
  "categoria": "Plato Fuerte",
  "dificultad": "Media",
  "tiempo": "40 minutos",
  "porciones": 4,
  "calorias": 520,
  "favorito": true,
  "ingredientes": [
    { "nombre": "Arroz Arbóreo", "cantidad": 350, "unidad": "gr" },
    { "nombre": "Hongos Portobello y Shiitake", "cantidad": 300, "unidad": "gr" }
  ],
  "pasos": [
    "Saltear los hongos laminados a fuego alto hasta dorar.",
    "Nacarar el arroz arbóreo, desglasar con vino blanco e incorporar el caldo caliente poco a poco."
  ]
}
```

---

## 🧪 Pruebas y Calidad de Código

```bash
# Ejecutar pruebas de integración de la API (Node Test Runner)
cd backend && npm test

# Verificar linter y compilación de producción en Frontend
cd frontend && npm run lint && npm run build
```

---

## 👨‍💻 Autor

**Didier Puentes** — *Full Stack Developer*
- GitHub: [@campodidier07-collab](https://github.com/campodidier07-collab)

---

<div align="center">
  Diseñado y desarrollado con ❤️ usando el stack <strong>MERN</strong>
</div>
