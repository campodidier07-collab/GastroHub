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
 * Obtener estadísticas globales del catálogo.
 * @returns {Promise<Object>} KPIs del catálogo.
 */
export const obtenerEstadisticasRecetas = async () => {
    const respuesta = await clienteHttp.get('/estadisticas');
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
 * Reemplazar completamente una receta existente (PUT).
 * @param {string} id - ID de la receta.
 * @param {Object} datosReemplazo - Receta completa.
 * @returns {Promise<Object>} Receta reemplazada.
 */
export const reemplazarReceta = async (id, datosReemplazo) => {
    const respuesta = await clienteHttp.put(`/${id}`, datosReemplazo);
    return respuesta.data;
};

/**
 * Alternar estado de favorito de una receta (PATCH /:id/favorito).
 * @param {string} id - ID de la receta.
 * @returns {Promise<Object>} Receta actualizada.
 */
export const alternarFavoritoReceta = async (id) => {
    const respuesta = await clienteHttp.patch(`/${id}/favorito`);
    return respuesta.data;
};

/**
 * Duplicar / clonar una ficha técnica existente en 1 clic (POST /:id/duplicar).
 * @param {string} id - ID de la receta original.
 * @returns {Promise<Object>} Nueva receta clonada.
 */
export const duplicarReceta = async (id) => {
    const respuesta = await clienteHttp.post(`/${id}/duplicar`);
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
