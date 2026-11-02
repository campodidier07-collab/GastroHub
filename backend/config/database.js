const mongoose = require('mongoose');
const Receta = require('../App/Models/Receta');
const { RECETAS_INICIALES } = require('./recetasIniciales');

let modoMemoriaActivo = false;

const conectarBD = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri || uri === 'tu_cadena_de_conexion_aqui') {
        modoMemoriaActivo = true;
        console.log('⚡ [GastroHub DB] MONGO_URI no configurada — ejecutando con almacén en memoria pre-poblado.');
        return { modo: 'memoria' };
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        modoMemoriaActivo = false;
        console.log('✅ [GastroHub DB] Conectado a MongoDB correctamente.');

        const totalRecetas = await Receta.countDocuments();
        if (totalRecetas === 0) {
            await Receta.insertMany(RECETAS_INICIALES);
            console.log(`🌱 [GastroHub DB] Se sembraron ${RECETAS_INICIALES.length} recetas gourmet iniciales.`);
        }

        return { modo: 'mongodb' };
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ [GastroHub DB] Error crítico al conectar a MongoDB:', error.message);
            process.exit(1);
        }

        modoMemoriaActivo = true;
        console.warn('⚠️ [GastroHub DB] No se pudo conectar a MongoDB local/remoto. Activando almacén en memoria de respaldo.');
        return { modo: 'memoria' };
    }
};

const usarModoMemoria = () => modoMemoriaActivo || mongoose.connection.readyState !== 1;

const activarModoMemoria = (estado = true) => {
    modoMemoriaActivo = estado;
};

module.exports = conectarBD;
module.exports.usarModoMemoria = usarModoMemoria;
module.exports.activarModoMemoria = activarModoMemoria;
