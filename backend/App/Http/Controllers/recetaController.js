const Receta = require('../../Models/Receta');
const { validateCreateReceta } = require('../Request/createRecetaRequest');
const { validateUpdateReceta } = require('../Request/updateRecetaRequest');
const { validateReplaceReceta } = require('../Request/replaceRecetaRequest');
const { validateDestroyReceta } = require('../Request/destroyRecetaRequest');

const normalizarErroresMongoose = (error) => {
    if (error.name !== 'ValidationError') {
        return null;
    }

    const detalles = Object.values(error.errors).map((detalle) => detalle.message);

    return {
        error: 'Datos de receta invalidos',
        detalles
    };
};

//Funcion Index
exports.obtenerRecetas = async (req, res) => {
    try {
        const recetas = await Receta.find();
        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener las recetas' });
    }
};

//Funcion Show (obtener una receta por ID)
exports.obtenerRecetaPorId = async (req, res) => {
    const { id } = req.params;
    const { esObjectIdValido } = require('../Request/recetaValidationRules');

    if (!esObjectIdValido(id)) {
        return res.status(400).json({ error: 'El ID proporcionado no es válido' });
    }

    try {
        const receta = await Receta.findById(id);

        if (!receta) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        return res.status(200).json(receta);
    } catch (error) {
        return res.status(500).json({ error: 'Surgió un error inesperado' });
    }
};

//Funcion Create
exports.crearReceta = async (req, res) => {
    const { error, validatedData } = validateCreateReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const nuevaReceta = new Receta(validatedData);
        await nuevaReceta.save();
        return res.status(201).json({ mensaje: 'Receta Creada', receta: nuevaReceta });
    } catch (error) {
        const errorMongoose = normalizarErroresMongoose(error);
        if (errorMongoose) {
            return res.status(400).json(errorMongoose);
        }

        return res.status(500).json({ error: 'Surgio un error inesperado' });
    }
};

//Funcion Update
exports.updateReceta = async (req, res) => {
    const { id } = req.params;
    const { error, validatedData } = validateUpdateReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const recetaActualizada = await Receta.findByIdAndUpdate(
            id,
            validatedData,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        if (!recetaActualizada) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        return res.status(200).json({
            mensaje: 'Receta actualizada',
            receta: recetaActualizada
        });
    } catch (error) {
        const errorMongoose = normalizarErroresMongoose(error);
        if (errorMongoose) {
            return res.status(400).json(errorMongoose);
        }

        return res.status(500).json({ error: 'Surgio un error inesperado' });
    }
};

//Funcion Replace
exports.replaceReceta = async (req, res) => {
    const { id } = req.params;
    const { error, validatedData } = validateReplaceReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const recetaReemplazada = await Receta.findByIdAndUpdate(
            id,
            validatedData,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        if (!recetaReemplazada) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        return res.status(200).json({
            mensaje: 'Receta reemplazada',
            receta: recetaReemplazada
        });
    } catch (error) {
        const errorMongoose = normalizarErroresMongoose(error);
        if (errorMongoose) {
            return res.status(400).json(errorMongoose);
        }

        return res.status(500).json({ error: 'Surgio un error inesperado' });
    }
};

//Eliminar Receta
exports.destroyReceta = async (req, res) => {
    const { id } = req.params;
    const { error } = validateDestroyReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const recetaEliminada = await Receta.findByIdAndDelete(id);

        if (!recetaEliminada) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        return res.status(200).json({
            mensaje: 'Receta eliminada',
            receta: recetaEliminada
        });
    } catch (error) {
        return res.status(500).json({ error: 'Surgio un error inesperado' });
    }
};
