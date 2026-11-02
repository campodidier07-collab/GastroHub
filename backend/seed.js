require('dotenv').config();
const mongoose = require('mongoose');
const Receta = require('./App/Models/Receta');
const { RECETAS_INICIALES } = require('./config/recetasIniciales');

const ejecutarSeed = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri || uri === 'tu_cadena_de_conexion_aqui') {
        console.log('ℹ️ [GastroHub Seed] MONGO_URI no definida. El servidor ya incluye estas 6 recetas gourmet en memoria automáticamente.');
        process.exit(0);
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Conectado a MongoDB para sembrar datos...');

        await Receta.deleteMany({});
        await Receta.insertMany(RECETAS_INICIALES);

        console.log(`🌱 Seed completado con éxito: ${RECETAS_INICIALES.length} recetas gourmet insertadas.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al ejecutar el seed:', error.message);
        process.exit(1);
    }
};

ejecutarSeed();

