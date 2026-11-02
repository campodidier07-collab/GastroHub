const mongoose = require('mongoose');

const recetaSchema = mongoose.Schema({
    titulo: {type: String, required: true},
    tiempo: {type: String, required: true},
    ingredientes: [{
        nombre: String,
        cantidad: Number,
        unidad: String
    }],
    pasos: [String]
}, {timestamps: true});

module.exports = mongoose.model('Receta', recetaSchema);