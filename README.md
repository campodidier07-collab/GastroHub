# 🍽️ Sistema Cocina MERN

Aplicación web full-stack para gestionar un catálogo de recetas de cocina. Permite crear, consultar, editar y eliminar recetas con una interfaz moderna y responsiva.

> **Stack:** MongoDB · Express.js · React 19 · Node.js (MERN)

---

## ✨ Características

- **Catálogo de recetas** con tabla responsiva y vista de tarjetas en móvil
- **CRUD completo:** crear, ver detalle, editar y eliminar recetas
- **Filtros en tiempo real:** búsqueda por nombre, tiempo, número mínimo de ingredientes y ordenamiento
- **Paginación** automática del catálogo
- **Validación** de formularios en el frontend y en el backend
- **Notificaciones toast** para confirmaciones y errores
- **Animaciones AOS** en la vista de inicio
- **Diseño pastel profesional** con paleta personalizada, tipografía Inter y glassmorphism
- **API REST** con validaciones estrictas de payload (sin campos extra)

---

## 🗂️ Estructura del proyecto

```
Sistema_Cocina_MERN/
├── backend/                  # API REST con Express + Mongoose
│   ├── App/
│   │   ├── Http/
│   │   │   ├── Controllers/  # Lógica de cada endpoint
│   │   │   └── Request/      # Validación de payloads
│   │   └── Models/           # Esquemas Mongoose
│   ├── Routes/
│   │   └── api.js            # Definición de rutas REST
│   ├── config/
│   │   └── database.js       # Conexión a MongoDB
│   ├── .env.example
│   └── server.js             # Punto de entrada del servidor
│
└── frontend/                 # SPA con React 19 + Vite + Tailwind CSS v4
    └── src/
        ├── components/
        │   ├── layout/       # Navbar
        │   ├── recetas/      # FormularioReceta, TablaRecetas, FiltrosRecetas, DetalleReceta
        │   └── ui/           # Modal, ConfirmacionModal, Spinner
        ├── context/
        │   └── RecetaContext.jsx   # Estado global y operaciones CRUD
        ├── services/
        │   └── recetaService.js    # Axios — comunicación con la API
        ├── views/
        │   ├── Inicio/       # Landing page con animaciones AOS
        │   └── Catalogo/     # Vista principal del catálogo
        └── App.jsx           # Router y layout raíz
```

---

## 🚀 Instalación y uso local

### Requisitos previos

- Node.js ≥ 18
- MongoDB Atlas (cuenta gratuita) o MongoDB local
- npm

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Sistema_Cocina_MERN.git
cd Sistema_Cocina_MERN
```

---

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Edita `.env` con tu cadena de conexión de MongoDB:

```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/cocina_db
```

Inicia el servidor:

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
node server.js
```

El servidor queda disponible en `http://localhost:5000`.

---

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Crea el archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=/api/recetas
```

> El proxy de Vite redirige `/api` → `http://localhost:5000`, por lo que no es necesario configurar CORS para desarrollo.

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## 📡 Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/recetas/` | Listar todas las recetas |
| `GET` | `/api/recetas/:id` | Obtener una receta por ID |
| `POST` | `/api/recetas/` | Crear una nueva receta |
| `PATCH` | `/api/recetas/:id` | Actualizar parcialmente una receta |
| `PUT` | `/api/recetas/:id` | Reemplazar completamente una receta |
| `DELETE` | `/api/recetas/:id` | Eliminar una receta |

### Ejemplo de payload (POST / PATCH)

```json
{
  "titulo": "Arroz con leche",
  "tiempo": "30 minutos",
  "ingredientes": [
    { "nombre": "Arroz", "cantidad": 2, "unidad": "tazas" },
    { "nombre": "Leche", "cantidad": 500, "unidad": "ml" }
  ],
  "pasos": [
    "Hervir el arroz en agua durante 15 minutos.",
    "Agregar la leche y cocinar 10 minutos más a fuego bajo."
  ]
}
```

---

## 🛠️ Tecnologías utilizadas

### Backend
| Librería | Versión | Uso |
|----------|---------|-----|
| Express | 5.x | Framework HTTP |
| Mongoose | 9.x | ODM para MongoDB |
| dotenv | 17.x | Variables de entorno |
| cors | 2.x | CORS headers |
| nodemon | 3.x | Recarga en desarrollo |

### Frontend
| Librería | Versión | Uso |
|----------|---------|-----|
| React | 19.x | UI components |
| Vite | 7.x | Bundler / dev server |
| Tailwind CSS | 4.x | Utilidades CSS |
| Axios | 1.x | Cliente HTTP |
| React Router DOM | 7.x | Enrutamiento SPA |
| react-hot-toast | 2.x | Notificaciones toast |
| AOS | 2.x | Animaciones scroll |

---

## 📸 Capturas de pantalla

> Agrega aquí capturas del proyecto una vez publicado.

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos en el marco del programa **ADSO** del SENA.

---

<div align="center">
  Hecho con ❤️ usando el stack MERN
</div>
