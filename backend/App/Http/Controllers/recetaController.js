const mongoose = require('mongoose');
const Receta = require('../../Models/Receta');
const { usarModoMemoria } = require('../../../config/database');
const { RECETAS_INICIALES } = require('../../../config/recetasIniciales');
const { esObjectIdValido } = require('../Request/recetaValidationRules');
const { validateCreateReceta } = require('../Request/createRecetaRequest');
const { validateUpdateReceta } = require('../Request/updateRecetaRequest');
const { validateReplaceReceta } = require('../Request/replaceRecetaRequest');
const { validateDestroyReceta } = require('../Request/destroyRecetaRequest');

// Almacén en memoria inicializado con copia profunda de las recetas gourmet
let memoriaRecetas = structuredClone(RECETAS_INICIALES);

const resetearMemoriaRecetas = () => {
    memoriaRecetas = structuredClone(RECETAS_INICIALES);
};

const construirRecetaConDefaults = (datos, parcial = null) => {
    const ahora = new Date().toISOString();
    return {
        _id: parcial?._id || new mongoose.Types.ObjectId().toString(),
        titulo: datos.titulo,
        tiempo: datos.tiempo,
        descripcion: datos.descripcion ?? '',
        categoria: datos.categoria ?? 'Plato Fuerte',
        dificultad: datos.dificultad ?? 'Media',
        porciones: datos.porciones ?? 4,
        calorias: datos.calorias !== undefined ? datos.calorias : null,
        imagenUrl: datos.imagenUrl ?? '',
        favorito: datos.favorito ?? false,
        ingredientes: Array.isArray(datos.ingredientes) ? datos.ingredientes : [],
        pasos: Array.isArray(datos.pasos) ? datos.pasos : [],
        createdAt: parcial?.createdAt || ahora,
        updatedAt: ahora
    };
};

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

// GET /api/recetas
exports.obtenerRecetas = async (req, res) => {
    try {
        if (usarModoMemoria()) {
            const ordenadas = [...memoriaRecetas].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            return res.status(200).json(ordenadas);
        }

        const recetas = await Receta.find().sort({ createdAt: -1 });
        return res.status(200).json(recetas);
    } catch (error) {
        return res.status(500).json({ error: 'Hubo un error al obtener las recetas' });
    }
};

// GET /api/recetas/estadisticas
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const lista = usarModoMemoria()
            ? memoriaRecetas
            : await Receta.find().lean();

        const totalRecetas = lista.length;
        const totalFavoritas = lista.filter((r) => Boolean(r.favorito)).length;
        const porCategoria = lista.reduce((acc, r) => {
            const cat = r.categoria || 'Plato Fuerte';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});
        const porDificultad = lista.reduce((acc, r) => {
            const dif = r.dificultad || 'Media';
            acc[dif] = (acc[dif] || 0) + 1;
            return acc;
        }, {});

        return res.status(200).json({
            totalRecetas,
            totalFavoritas,
            categoriasActivas: Object.keys(porCategoria).length,
            porCategoria,
            porDificultad
        });
    } catch (error) {
        return res.status(500).json({ error: 'No se pudieron calcular las estadisticas' });
    }
};

// GET /api/recetas/:id
exports.obtenerRecetaPorId = async (req, res) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return res.status(400).json({ error: 'El ID proporcionado no es válido' });
    }

    try {
        if (usarModoMemoria()) {
            const receta = memoriaRecetas.find((r) => String(r._id) === id);
            if (!receta) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }
            return res.status(200).json(receta);
        }

        const receta = await Receta.findById(id);

        if (!receta) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        return res.status(200).json(receta);
    } catch (error) {
        return res.status(500).json({ error: 'Surgió un error inesperado' });
    }
};

// POST /api/recetas
exports.crearReceta = async (req, res) => {
    const { error, validatedData } = validateCreateReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        if (usarModoMemoria()) {
            const nuevaReceta = construirRecetaConDefaults(validatedData);
            memoriaRecetas.unshift(nuevaReceta);
            return res.status(201).json({ mensaje: 'Receta Creada', receta: nuevaReceta });
        }

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

// PATCH /api/recetas/:id
exports.updateReceta = async (req, res) => {
    const { id } = req.params;
    const { error, validatedData } = validateUpdateReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        if (usarModoMemoria()) {
            const idx = memoriaRecetas.findIndex((r) => String(r._id) === id);
            if (idx === -1) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }

            const actualizada = {
                ...memoriaRecetas[idx],
                ...validatedData,
                updatedAt: new Date().toISOString()
            };
            memoriaRecetas[idx] = actualizada;
            return res.status(200).json({
                mensaje: 'Receta actualizada',
                receta: actualizada
            });
        }

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

// PUT /api/recetas/:id (Reemplazo completo real de los campos de la receta)
exports.replaceReceta = async (req, res) => {
    const { id } = req.params;
    const { error, validatedData } = validateReplaceReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    const datosReemplazo = {
        titulo: validatedData.titulo,
        tiempo: validatedData.tiempo,
        descripcion: validatedData.descripcion ?? '',
        categoria: validatedData.categoria ?? 'Plato Fuerte',
        dificultad: validatedData.dificultad ?? 'Media',
        porciones: validatedData.porciones ?? 4,
        calorias: validatedData.calorias !== undefined ? validatedData.calorias : null,
        imagenUrl: validatedData.imagenUrl ?? '',
        favorito: validatedData.favorito ?? false,
        ingredientes: validatedData.ingredientes ?? [],
        pasos: validatedData.pasos ?? []
    };

    try {
        if (usarModoMemoria()) {
            const idx = memoriaRecetas.findIndex((r) => String(r._id) === id);
            if (idx === -1) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }

            const reemplazada = construirRecetaConDefaults(datosReemplazo, memoriaRecetas[idx]);
            memoriaRecetas[idx] = reemplazada;
            return res.status(200).json({
                mensaje: 'Receta reemplazada',
                receta: reemplazada
            });
        }

        const recetaReemplazada = await Receta.findByIdAndUpdate(
            id,
            datosReemplazo,
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

// PATCH /api/recetas/:id/favorito
exports.toggleFavorito = async (req, res) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return res.status(400).json({ error: 'El id de la receta no es valido' });
    }

    try {
        if (usarModoMemoria()) {
            const idx = memoriaRecetas.findIndex((r) => String(r._id) === id);
            if (idx === -1) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }

            memoriaRecetas[idx] = {
                ...memoriaRecetas[idx],
                favorito: !memoriaRecetas[idx].favorito,
                updatedAt: new Date().toISOString()
            };

            return res.status(200).json({
                mensaje: 'Estado de favorito actualizado',
                receta: memoriaRecetas[idx]
            });
        }

        const receta = await Receta.findById(id);
        if (!receta) {
            return res.status(404).json({ error: 'Receta no encontrada' });
        }

        receta.favorito = !receta.favorito;
        await receta.save();

        return res.status(200).json({
            mensaje: 'Estado de favorito actualizado',
            receta
        });
    } catch (error) {
        return res.status(500).json({ error: 'Surgio un error inesperado' });
    }
};

// DELETE /api/recetas/:id
exports.destroyReceta = async (req, res) => {
    const { id } = req.params;
    const { error } = validateDestroyReceta(req);
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        if (usarModoMemoria()) {
            const idx = memoriaRecetas.findIndex((r) => String(r._id) === id);
            if (idx === -1) {
                return res.status(404).json({ error: 'Receta no encontrada' });
            }

            const [recetaEliminada] = memoriaRecetas.splice(idx, 1);
            return res.status(200).json({
                mensaje: 'Receta eliminada',
                receta: recetaEliminada
            });
        }

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

exports.resetearMemoriaRecetas = resetearMemoriaRecetas;
