import { createContext, useContext, useState, useCallback } from 'react';
import {
    obtenerRecetas as apiObtenerRecetas,
    crearReceta as apiCrearReceta,
    actualizarReceta as apiActualizarReceta,
    eliminarReceta as apiEliminarReceta,
} from '../services/recetaService';

// ─── Creación del contexto ────────────────────────────────────────────────────
const RecetaContext = createContext(null);

/**
 * Proveedor del contexto global de recetas.
 * Expone el estado y las acciones CRUD al árbol de componentes.
 */
export const RecetaProvider = ({ children }) => {
    const [listaRecetas, setListaRecetas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [errorGlobal, setErrorGlobal] = useState(null);

    // ── Cargar todas las recetas desde la API ──────────────────────────────
    const cargarRecetas = useCallback(async () => {
        setCargando(true);
        setErrorGlobal(null);
        try {
            const datos = await apiObtenerRecetas();
            setListaRecetas(datos);
        } catch (error) {
            setErrorGlobal('No se pudieron cargar las recetas. Verifica tu conexión.');
            console.error('Error al cargar recetas:', error);
        } finally {
            setCargando(false);
        }
    }, []);

    // ── Crear una nueva receta ─────────────────────────────────────────────
    const agregarReceta = useCallback(async (datosNuevaReceta) => {
        const respuesta = await apiCrearReceta(datosNuevaReceta);
        setListaRecetas((prev) => [respuesta.receta, ...prev]);
        return respuesta;
    }, []);

    // ── Actualizar una receta existente ────────────────────────────────────
    const modificarReceta = useCallback(async (id, datosActualizados) => {
        const respuesta = await apiActualizarReceta(id, datosActualizados);
        setListaRecetas((prev) =>
            prev.map((receta) => (receta._id === id ? respuesta.receta : receta))
        );
        return respuesta;
    }, []);

    // ── Eliminar una receta ────────────────────────────────────────────────
    const borrarReceta = useCallback(async (id) => {
        await apiEliminarReceta(id);
        setListaRecetas((prev) => prev.filter((receta) => receta._id !== id));
    }, []);

    const valor = {
        listaRecetas,
        cargando,
        errorGlobal,
        cargarRecetas,
        agregarReceta,
        modificarReceta,
        borrarReceta,
    };

    return (
        <RecetaContext.Provider value={valor}>
            {children}
        </RecetaContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto de recetas.
 * Lanza un error si se usa fuera del RecetaProvider.
 */
export const useRecetas = () => {
    const contexto = useContext(RecetaContext);
    if (!contexto) {
        throw new Error('useRecetas debe usarse dentro de un <RecetaProvider>');
    }
    return contexto;
};
