const {
    esObjectIdValido,
    validarPayloadReceta
} = require('./recetaValidationRules');

const validateUpdateReceta = (req) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return { error: 'El id de la receta no es valido' };
    }

    const { error, payloadSaneado } = validarPayloadReceta(req.body, {
        mensajeBodyVacio: 'Debes enviar al menos un campo para actualizar'
    });

    if (error) {
        return { error };
    }

    return { validatedData: payloadSaneado };
};

module.exports = {
    validateUpdateReceta
};
