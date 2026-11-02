const { esObjectIdValido } = require('./recetaValidationRules');

const validateDestroyReceta = (req) => {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
        return { error: 'El id de la receta no es valido' };
    }

    return {};
};

module.exports = {
    validateDestroyReceta
};
