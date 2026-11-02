require('dotenv').config();
const express = require('express');
const cors = require('cors');
const api = require('./Routes/api');
const conectarDB = require('./config/database');
const { usarModoMemoria } = require('./config/database');

const app = express();

// Cabeceras de seguridad básicas
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Endpoint de salud y estado del servicio
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'GastroHub API',
        storage: usarModoMemoria() ? 'memory-fallback' : 'mongodb',
        timestamp: new Date().toISOString()
    });
});

// Rutas principales de la API
app.use('/api/recetas', api);

// Manejador de rutas no encontradas (404 JSON)
app.use((req, res) => {
    res.status(404).json({
        error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Middleware global de errores (ej. JSON malformado en el body)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'El cuerpo de la solicitud contiene JSON malformado'
        });
    }

    return res.status(500).json({
        error: 'Error interno del servidor'
    });
});

const iniciarServidor = async () => {
    await conectarDB();
    const PORT = process.env.PORT || 5000;
    return app.listen(PORT, () => {
        console.log(`🚀 [GastroHub API] Servidor activo en http://localhost:${PORT}`);
    });
};

if (require.main === module) {
    iniciarServidor();
}

module.exports = app;
module.exports.iniciarServidor = iniciarServidor;
