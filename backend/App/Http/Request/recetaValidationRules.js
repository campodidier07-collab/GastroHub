const mongoose = require('mongoose');

const CAMPOS_RECETA_PERMITIDOS = ['titulo', 'tiempo', 'ingredientes', 'pasos'];
const CAMPOS_INGREDIENTE_PERMITIDOS = ['nombre', 'cantidad', 'unidad'];

const esObjetoPlano = (valor) => (
    valor !== null
    && typeof valor === 'object'
    && !Array.isArray(valor)
);

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const validarIngredientes = (ingredientes) => {
    if (!Array.isArray(ingredientes)) {
        return 'El campo ingredientes debe ser un arreglo';
    }

    for (const ingrediente of ingredientes) {
        if (!esObjetoPlano(ingrediente)) {
            return 'Cada ingrediente debe ser un objeto';
        }

        const camposInvalidos = Object.keys(ingrediente)
            .filter((campo) => !CAMPOS_INGREDIENTE_PERMITIDOS.includes(campo));

        if (camposInvalidos.length > 0) {
            return `Campos invalidos en ingredientes: ${camposInvalidos.join(', ')}`;
        }

        if (
            Object.prototype.hasOwnProperty.call(ingrediente, 'nombre')
            && typeof ingrediente.nombre !== 'string'
        ) {
            return 'El nombre de cada ingrediente debe ser texto';
        }

        if (
            Object.prototype.hasOwnProperty.call(ingrediente, 'cantidad')
            && (typeof ingrediente.cantidad !== 'number' || Number.isNaN(ingrediente.cantidad))
        ) {
            return 'La cantidad de cada ingrediente debe ser numerica';
        }

        if (
            Object.prototype.hasOwnProperty.call(ingrediente, 'unidad')
            && typeof ingrediente.unidad !== 'string'
        ) {
            return 'La unidad de cada ingrediente debe ser texto';
        }
    }

    return null;
};

const validarPasos = (pasos) => {
    if (!Array.isArray(pasos)) {
        return 'El campo pasos debe ser un arreglo';
    }

    if (!pasos.every((paso) => typeof paso === 'string')) {
        return 'Cada paso debe ser texto';
    }

    return null;
};

const validarPayloadReceta = (payload, opciones = {}) => {
    const {
        requiereTituloTiempo = false,
        mensajeBodyVacio = 'Debes enviar al menos un campo para actualizar'
    } = opciones;

    if (!esObjetoPlano(payload)) {
        return { error: 'El cuerpo de la solicitud debe ser un objeto JSON valido' };
    }

    const llavesPayload = Object.keys(payload);
    if (llavesPayload.length === 0) {
        return { error: mensajeBodyVacio };
    }

    const camposInvalidos = llavesPayload
        .filter((campo) => !CAMPOS_RECETA_PERMITIDOS.includes(campo));

    if (camposInvalidos.length > 0) {
        return { error: `Campos no permitidos: ${camposInvalidos.join(', ')}` };
    }

    if (requiereTituloTiempo) {
        const faltantes = ['titulo', 'tiempo'].filter(
            (campo) => !Object.prototype.hasOwnProperty.call(payload, campo)
        );

        if (faltantes.length > 0) {
            return { error: `Faltan campos obligatorios: ${faltantes.join(', ')}` };
        }
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, 'titulo')
        && typeof payload.titulo !== 'string'
    ) {
        return { error: 'El campo titulo debe ser texto' };
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, 'tiempo')
        && typeof payload.tiempo !== 'string'
    ) {
        return { error: 'El campo tiempo debe ser texto' };
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'ingredientes')) {
        const errorIngredientes = validarIngredientes(payload.ingredientes);
        if (errorIngredientes) {
            return { error: errorIngredientes };
        }
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'pasos')) {
        const errorPasos = validarPasos(payload.pasos);
        if (errorPasos) {
            return { error: errorPasos };
        }
    }

    const payloadSaneado = {};
    for (const campo of llavesPayload) {
        payloadSaneado[campo] = payload[campo];
    }

    return { payloadSaneado };
};

module.exports = {
    esObjectIdValido,
    validarPayloadReceta
};
