const CATEGORIAS = [
    'Entrada',
    'Plato Fuerte',
    'Postre',
    'Bebida',
    'Ensalada',
    'Sopa',
    'Snack',
    'Otro',
];

const DIFICULTADES = ['Fácil', 'Media', 'Alta'];

/**
 * Panel avanzado de filtros multicriterio para el catálogo de GastroHub.
 */
const FiltrosRecetas = ({ filtros, alCambiarFiltros, alLimpiar }) => {
    const hayFiltrosActivos =
        filtros.busqueda ||
        filtros.categoria ||
        filtros.dificultad ||
        filtros.tiempoFiltro ||
        filtros.minIngredientes !== '' ||
        filtros.soloFavoritas ||
        filtros.ordenar !== 'reciente';

    return (
        <div
            className="tarjeta p-4 sm:p-5 mb-6"
            style={{ background: '#fff', border: '1px solid var(--color-borde)' }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                {/* Buscador multicriterio */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Buscar receta o ingrediente
                    </label>
                    <input
                        type="text"
                        value={filtros.busqueda}
                        onChange={(e) => alCambiarFiltros({ busqueda: e.target.value })}
                        placeholder="Ej: Risotto, trufa, salmón, chocolate..."
                        className="input-global"
                    />
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Categoría
                    </label>
                    <select
                        value={filtros.categoria || ''}
                        onChange={(e) => alCambiarFiltros({ categoria: e.target.value })}
                        className="input-global cursor-pointer"
                    >
                        <option value="">Todas</option>
                        {CATEGORIAS.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Dificultad */}
                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Dificultad
                    </label>
                    <select
                        value={filtros.dificultad || ''}
                        onChange={(e) => alCambiarFiltros({ dificultad: e.target.value })}
                        className="input-global cursor-pointer"
                    >
                        <option value="">Todas</option>
                        {DIFICULTADES.map((dif) => (
                            <option key={dif} value={dif}>{dif}</option>
                        ))}
                    </select>
                </div>

                {/* Tiempo o Mín. ingredientes */}
                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Tiempo (contiene)
                    </label>
                    <input
                        type="text"
                        value={filtros.tiempoFiltro || ''}
                        onChange={(e) => alCambiarFiltros({ tiempoFiltro: e.target.value })}
                        placeholder="Ej: 25 min"
                        className="input-global"
                    />
                </div>

                {/* Ordenar por */}
                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Ordenar por
                    </label>
                    <select
                        value={filtros.ordenar}
                        onChange={(e) => alCambiarFiltros({ ordenar: e.target.value })}
                        className="input-global cursor-pointer"
                    >
                        <option value="reciente">Más reciente</option>
                        <option value="antiguo">Más antiguo</option>
                        <option value="titulo_az">Título A-Z</option>
                        <option value="titulo_za">Título Z-A</option>
                        <option value="mas_ingredientes">Más ingredientes</option>
                        <option value="menos_ingredientes">Menos ingredientes</option>
                        <option value="menos_calorias">Menor calorías</option>
                    </select>
                </div>
            </div>

            {/* Barra secundaria: Mínimo de ingredientes + chip Favoritas + Limpiar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-borde)' }}>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => alCambiarFiltros({ soloFavoritas: !filtros.soloFavoritas })}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer"
                        style={{
                            background: filtros.soloFavoritas ? 'var(--color-ambar-claro)' : 'var(--color-gris-suave)',
                            color: filtros.soloFavoritas ? '#b45309' : 'var(--color-texto-medio)',
                            borderColor: filtros.soloFavoritas ? '#f59e0b' : 'var(--color-borde)',
                        }}
                    >
                        <span>{filtros.soloFavoritas ? '★' : '☆'}</span>
                        Solo Favoritas
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>
                            Mín. ingredientes:
                        </span>
                        <input
                            type="number"
                            min="0"
                            value={filtros.minIngredientes}
                            onChange={(e) => alCambiarFiltros({ minIngredientes: e.target.value })}
                            placeholder="0"
                            className="w-16 px-2.5 py-1 text-xs rounded-lg border bg-white"
                            style={{ borderColor: 'var(--color-borde)' }}
                        />
                    </div>
                </div>

                {hayFiltrosActivos && (
                    <button
                        onClick={alLimpiar}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        style={{ background: '#fde8e8', color: '#b91c1c', border: '1px solid #f8c9c9' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
};

export default FiltrosRecetas;
