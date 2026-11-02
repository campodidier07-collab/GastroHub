const {
    esObjectIdValido,
    validarPayloadReceta
} = require('./recetaValidationRules');

const validateReplaceReceta = (req) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return { error: 'El id de la receta no es valido' };
    }

    const { error, payloadSaneado } = validarPayloadReceta(req.body, {
        requiereTituloTiempo: true,
        mensajeBodyVacio: 'Para reemplazar la receta debes enviar al menos titulo y tiempo'
    });

    if (error) {
        return { error };
    }

    return { validatedData: payloadSaneado };
};

module.exports = {
    validateReplaceReceta
};
