const mongoose = require('mongoose');

const CATEGORIAS_VALIDAS = [
    'Entrada',
    'Plato Fuerte',
    'Postre',
    'Bebida',
    'Ensalada',
    'Sopa',
    'Snack',
    'Otro'
];

const DIFICULTADES_VALIDAS = ['Fácil', 'Media', 'Alta'];

const ingredienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del ingrediente es obligatorio'],
        trim: true
    },
    cantidad: {
        type: Number,
        min: [0, 'La cantidad no puede ser negativa']
    },
    unidad: {
        type: String,
        trim: true,
        default: ''
    }
}, { _id: false });

const recetaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título de la receta es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
        default: ''
    },
    categoria: {
        type: String,
        enum: {
            values: CATEGORIAS_VALIDAS,
            message: 'La categoría seleccionada no es válida'
        },
        default: 'Plato Fuerte'
    },
    dificultad: {
        type: String,
        enum: {
            values: DIFICULTADES_VALIDAS,
            message: 'La dificultad debe ser Fácil, Media o Alta'
        },
        default: 'Media'
    },
    tiempo: {
        type: String,
        required: [true, 'El tiempo de preparación es obligatorio'],
        trim: true
    },
    porciones: {
        type: Number,
        min: [1, 'Las porciones deben ser al menos 1'],
        default: 4
    },
    calorias: {
        type: Number,
        min: [0, 'Las calorías no pueden ser negativas'],
        default: null
    },
    imagenUrl: {
        type: String,
        trim: true,
        default: ''
    },
    favorito: {
        type: Boolean,
        default: false
    },
    ingredientes: {
        type: [ingredienteSchema],
        default: []
    },
    pasos: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Receta', recetaSchema);
module.exports.CATEGORIAS_VALIDAS = CATEGORIAS_VALIDAS;
module.exports.DIFICULTADES_VALIDAS = DIFICULTADES_VALIDAS;
