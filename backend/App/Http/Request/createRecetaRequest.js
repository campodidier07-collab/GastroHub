const { validarPayloadReceta } = require('./recetaValidationRules');

const validateCreateReceta = (req) => {
    const { error, payloadSaneado } = validarPayloadReceta(req.body, {
        requiereTituloTiempo: true,
        mensajeBodyVacio: 'Para crear la receta debes enviar al menos titulo y tiempo'
    });

    if (error) {
        return { error };
    }

    return { validatedData: payloadSaneado };
};

module.exports = {
    validateCreateReceta
};
