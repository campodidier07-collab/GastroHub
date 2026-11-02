import { createContext, useContext, useState, useCallback } from 'react';
import {
    obtenerRecetas as apiObtenerRecetas,
    crearReceta as apiCrearReceta,
    actualizarReceta as apiActualizarReceta,
    alternarFavoritoReceta as apiAlternarFavoritoReceta,
    duplicarReceta as apiDuplicarReceta,
    eliminarReceta as apiEliminarReceta,
} from '../services/recetaService';

const RecetaContext = createContext(null);

/**
 * Proveedor del contexto global de recetas de GastroHub.
 * Expone el estado y las acciones CRUD al árbol de componentes.
 */
export const RecetaProvider = ({ children }) => {
    const [listaRecetas, setListaRecetas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [errorGlobal, setErrorGlobal] = useState(null);

    const cargarRecetas = useCallback(async () => {
        setCargando(true);
        setErrorGlobal(null);
        try {
            const datos = await apiObtenerRecetas();
            setListaRecetas(datos);
        } catch (error) {
            setErrorGlobal('No se pudieron cargar las recetas. Verifica que el servidor de GastroHub esté activo.');
            console.error('Error al cargar recetas:', error);
        } finally {
            setCargando(false);
        }
    }, []);

    const agregarReceta = useCallback(async (datosNuevaReceta) => {
        const respuesta = await apiCrearReceta(datosNuevaReceta);
        setListaRecetas((prev) => [respuesta.receta, ...prev]);
        return respuesta;
    }, []);

    const modificarReceta = useCallback(async (id, datosActualizados) => {
        const respuesta = await apiActualizarReceta(id, datosActualizados);
        setListaRecetas((prev) =>
            prev.map((receta) => (receta._id === id ? respuesta.receta : receta))
        );
        return respuesta;
    }, []);

    const toggleFavorito = useCallback(async (id) => {
        const respuesta = await apiAlternarFavoritoReceta(id);
        setListaRecetas((prev) =>
            prev.map((receta) => (receta._id === id ? respuesta.receta : receta))
        );
        return respuesta.receta;
    }, []);

    const clonarReceta = useCallback(async (id) => {
        const respuesta = await apiDuplicarReceta(id);
        setListaRecetas((prev) => [respuesta.receta, ...prev]);
        return respuesta.receta;
    }, []);

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
        toggleFavorito,
        clonarReceta,
        borrarReceta,
    };

    return (
        <RecetaContext.Provider value={valor}>
            {children}
        </RecetaContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRecetas = () => {
    const contexto = useContext(RecetaContext);
    if (!contexto) {
        throw new Error('useRecetas debe usarse dentro de un <RecetaProvider>');
    }
    return contexto;
};
