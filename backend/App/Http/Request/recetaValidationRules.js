const mongoose = require('mongoose');
const { CATEGORIAS_VALIDAS, DIFICULTADES_VALIDAS } = require('../../Models/Receta');

const CAMPOS_RECETA_PERMITIDOS = [
    'titulo',
    'tiempo',
    'descripcion',
    'categoria',
    'dificultad',
    'porciones',
    'calorias',
    'costoPorPorcion',
    'etiquetas',
    'imagenUrl',
    'favorito',
    'ingredientes',
    'pasos'
];
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
            && (typeof ingrediente.cantidad !== 'number' || Number.isNaN(ingrediente.cantidad) || ingrediente.cantidad < 0)
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

    if (Object.prototype.hasOwnProperty.call(payload, 'titulo')) {
        if (typeof payload.titulo !== 'string' || !payload.titulo.trim()) {
            return { error: 'El campo titulo debe ser texto no vacio' };
        }
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'tiempo')) {
        if (typeof payload.tiempo !== 'string' || !payload.tiempo.trim()) {
            return { error: 'El campo tiempo debe ser texto no vacio' };
        }
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, 'descripcion')
        && typeof payload.descripcion !== 'string'
    ) {
        return { error: 'El campo descripcion debe ser texto' };
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'categoria')) {
        if (typeof payload.categoria !== 'string' || !CATEGORIAS_VALIDAS.includes(payload.categoria)) {
            return { error: `La categoria debe ser una de: ${CATEGORIAS_VALIDAS.join(', ')}` };
        }
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'dificultad')) {
        if (typeof payload.dificultad !== 'string' || !DIFICULTADES_VALIDAS.includes(payload.dificultad)) {
            return { error: `La dificultad debe ser una de: ${DIFICULTADES_VALIDAS.join(', ')}` };
        }
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'porciones')) {
        if (
            typeof payload.porciones !== 'number'
            || Number.isNaN(payload.porciones)
            || payload.porciones < 1
        ) {
            return { error: 'El campo porciones debe ser un numero mayor o igual a 1' };
        }
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, 'calorias')
        && payload.calorias !== null
    ) {
        if (
            typeof payload.calorias !== 'number'
            || Number.isNaN(payload.calorias)
            || payload.calorias < 0
        ) {
            return { error: 'El campo calorias debe ser un numero mayor o igual a 0' };
        }
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, 'costoPorPorcion')
        && payload.costoPorPorcion !== null
    ) {
        if (
            typeof payload.costoPorPorcion !== 'number'
            || Number.isNaN(payload.costoPorPorcion)
            || payload.costoPorPorcion < 0
        ) {
            return { error: 'El campo costoPorPorcion debe ser un numero mayor o igual a 0' };
        }
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'etiquetas')) {
        if (
            !Array.isArray(payload.etiquetas)
            || !payload.etiquetas.every((etiqueta) => typeof etiqueta === 'string')
        ) {
            return { error: 'El campo etiquetas debe ser un arreglo de textos' };
        }
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, 'imagenUrl')
        && typeof payload.imagenUrl !== 'string'
    ) {
        return { error: 'El campo imagenUrl debe ser texto' };
    }

    if (
        Object.prototype.hasOwnProperty.call(payload, 'favorito')
        && typeof payload.favorito !== 'boolean'
    ) {
        return { error: 'El campo favorito debe ser booleano' };
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
        if (typeof payload[campo] === 'string') {
            payloadSaneado[campo] = payload[campo].trim();
        } else {
            payloadSaneado[campo] = payload[campo];
        }
    }

    return { payloadSaneado };
};

module.exports = {
    CAMPOS_RECETA_PERMITIDOS,
    esObjectIdValido,
    validarPayloadReceta
};
