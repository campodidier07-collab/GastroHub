/**
 * Panel de filtros para el catálogo de recetas.
 * @param {Object} filtros - Estado actual de los filtros.
 * @param {Function} alCambiarFiltros - Callback para actualizar los filtros.
 * @param {Function} alLimpiar - Callback para limpiar todos los filtros.
 */
const FiltrosRecetas = ({ filtros, alCambiarFiltros, alLimpiar }) => {
    const hayFiltrosActivos =
        filtros.busqueda ||
        filtros.tiempoFiltro ||
        filtros.minIngredientes !== '' ||
        filtros.ordenar !== 'reciente';

    return (
        <div
            className="tarjeta p-4 mb-5"
            style={{ background: 'var(--color-gris-suave)', border: '1px solid var(--color-borde)' }}
        >
            <div className="flex flex-wrap gap-3 items-end">

                {/* Buscador en tiempo real */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Buscar receta
                    </label>
                    <input
                        type="text"
                        value={filtros.busqueda}
                        onChange={(e) => alCambiarFiltros({ busqueda: e.target.value })}
                        placeholder="Nombre de la receta..."
                        className="input-global"
                    />
                </div>

                {/* Tiempo (contiene texto) */}
                <div className="w-40">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Tiempo (contiene)
                    </label>
                    <input
                        type="text"
                        value={filtros.tiempoFiltro || ''}
                        onChange={(e) => alCambiarFiltros({ tiempoFiltro: e.target.value })}
                        placeholder="Ej: 30 min"
                        className="input-global"
                    />
                </div>

                {/* Mínimo de ingredientes */}
                <div className="w-44">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Mín. ingredientes
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={filtros.minIngredientes}
                        onChange={(e) => alCambiarFiltros({ minIngredientes: e.target.value })}
                        placeholder="Ej: 3"
                        className="input-global"
                    />
                </div>

                {/* Ordenar por */}
                <div className="w-44">
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Ordenar por
                    </label>
                    <select
                        value={filtros.ordenar}
                        onChange={(e) => alCambiarFiltros({ ordenar: e.target.value })}
                        className="input-global cursor-pointer"
                        style={{ appearance: 'auto' }}
                    >
                        <option value="reciente">Más reciente</option>
                        <option value="antiguo">Más antiguo</option>
                        <option value="titulo_az">Título A-Z</option>
                        <option value="titulo_za">Título Z-A</option>
                        <option value="mas_ingredientes">Más ingredientes</option>
                        <option value="menos_ingredientes">Menos ingredientes</option>
                    </select>
                </div>

                {/* Botón limpiar filtros */}
                {hayFiltrosActivos && (
                    <button
                        onClick={alLimpiar}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                        style={{ background: '#fde8e8', color: '#c0392b', border: '1px solid #f5c6c6' }}
                        title="Limpiar todos los filtros"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
};

export default FiltrosRecetas;
