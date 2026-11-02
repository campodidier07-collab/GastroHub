const mongoose = require('mongoose');

const conectarBD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('BD conectada correctamente');
    } catch (error) {
        console.log('Surgio un error insesperado', error);
        process.exit(1);
    }
};

module.exports = conectarBD;