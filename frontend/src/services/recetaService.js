import axios from 'axios';

// URL base de la API (definida en .env)
const URL_BASE = import.meta.env.VITE_API_URL || '/api/recetas';

// Instancia de axios configurada
const clienteHttp = axios.create({
    baseURL: URL_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Obtener todas las recetas.
 * @returns {Promise<Array>} Lista de recetas.
 */
export const obtenerRecetas = async () => {
    const respuesta = await clienteHttp.get('/');
    return respuesta.data;
};

/**
 * Obtener una receta por su ID.
 * @param {string} id - ID de la receta en MongoDB.
 * @returns {Promise<Object>} Receta encontrada.
 */
export const obtenerRecetaPorId = async (id) => {
    const respuesta = await clienteHttp.get(`/${id}`);
    return respuesta.data;
};

/**
 * Crear una nueva receta.
 * @param {Object} datosReceta - Datos de la nueva receta.
 * @returns {Promise<Object>} Receta creada.
 */
export const crearReceta = async (datosReceta) => {
    const respuesta = await clienteHttp.post('/', datosReceta);
    return respuesta.data;
};

/**
 * Actualizar parcialmente una receta existente (PATCH).
 * @param {string} id - ID de la receta.
 * @param {Object} datosActualizados - Campos a actualizar.
 * @returns {Promise<Object>} Receta actualizada.
 */
export const actualizarReceta = async (id, datosActualizados) => {
    const respuesta = await clienteHttp.patch(`/${id}`, datosActualizados);
    return respuesta.data;
};

/**
 * Eliminar una receta por su ID.
 * @param {string} id - ID de la receta a eliminar.
 * @returns {Promise<Object>} Mensaje de confirmación.
 */
export const eliminarReceta = async (id) => {
    const respuesta = await clienteHttp.delete(`/${id}`);
    return respuesta.data;
};
