import { CATALOGO_ETIQUETAS } from '../../utils/etiquetasGastronomicas';

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
 * Barra de filtros empresariales con iconografía Font Awesome unificada.
 */
const FiltrosRecetas = ({ filtros, alCambiarFiltros, alLimpiar }) => {
    const hayFiltrosActivos =
        filtros.busqueda ||
        filtros.categoria ||
        filtros.dificultad ||
        filtros.etiqueta ||
        filtros.tiempoFiltro ||
        filtros.minIngredientes !== '' ||
        filtros.soloFavoritas ||
        filtros.ordenar !== 'reciente';

    return (
        <section
            aria-label="Filtros del catálogo"
            className="tarjeta p-4 sm:p-5 mb-6"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)' }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 items-end">
                <div className="sm:col-span-2">
                    <label
                        htmlFor="filtro-busqueda"
                        className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--texto-secundario)' }}
                    >
                        <i className="fa-solid fa-magnifying-glass text-[11px]" aria-hidden="true" />
                        <span>Búsqueda por plato o insumo</span>
                    </label>
                    <input
                        id="filtro-busqueda"
                        type="search"
                        value={filtros.busqueda}
                        onChange={(e) => alCambiarFiltros({ busqueda: e.target.value })}
                        placeholder="Ej: Risotto, trufa, salmón, cacao..."
                        className="input-global"
                    />
                </div>

                <div>
                    <label
                        htmlFor="filtro-categoria"
                        className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--texto-secundario)' }}
                    >
                        <i className="fa-solid fa-filter text-[11px]" aria-hidden="true" />
                        <span>Partida / Categoría</span>
                    </label>
                    <select
                        id="filtro-categoria"
                        value={filtros.categoria || ''}
                        onChange={(e) => alCambiarFiltros({ categoria: e.target.value })}
                        className="input-global cursor-pointer"
                    >
                        <option value="">Todas las partidas</option>
                        {CATEGORIAS.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="filtro-dificultad"
                        className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--texto-secundario)' }}
                    >
                        <i className="fa-solid fa-layer-group text-[11px]" aria-hidden="true" />
                        <span>Complejidad</span>
                    </label>
                    <select
                        id="filtro-dificultad"
                        value={filtros.dificultad || ''}
                        onChange={(e) => alCambiarFiltros({ dificultad: e.target.value })}
                        className="input-global cursor-pointer"
                    >
                        <option value="">Cualquier nivel</option>
                        {DIFICULTADES.map((dif) => (
                            <option key={dif} value={dif}>{dif}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="filtro-tiempo"
                        className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--texto-secundario)' }}
                    >
                        <i className="fa-regular fa-clock text-[11px]" aria-hidden="true" />
                        <span>Tiempo estimado</span>
                    </label>
                    <input
                        id="filtro-tiempo"
                        type="text"
                        value={filtros.tiempoFiltro || ''}
                        onChange={(e) => alCambiarFiltros({ tiempoFiltro: e.target.value })}
                        placeholder="Ej: 25 min"
                        className="input-global"
                    />
                </div>

                <div>
                    <label
                        htmlFor="filtro-orden"
                        className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--texto-secundario)' }}
                    >
                        <i className="fa-solid fa-arrow-up-wide-short text-[11px]" aria-hidden="true" />
                        <span>Ordenar por</span>
                    </label>
                    <select
                        id="filtro-orden"
                        value={filtros.ordenar}
                        onChange={(e) => alCambiarFiltros({ ordenar: e.target.value })}
                        className="input-global cursor-pointer"
                    >
                        <option value="reciente">Más reciente</option>
                        <option value="antiguo">Más antiguo</option>
                        <option value="titulo_az">Nombre (A → Z)</option>
                        <option value="titulo_za">Nombre (Z → A)</option>
                        <option value="mas_ingredientes">Mayor n.º insumos</option>
                        <option value="menos_ingredientes">Menor n.º insumos</option>
                        <option value="menos_calorias">Menor densidad kcal</option>
                        <option value="menor_costo">Menor costo / porción</option>
                        <option value="mayor_costo">Mayor costo / porción</option>
                    </select>
                </div>
            </div>

            <div
                className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3.5 border-t"
                style={{ borderColor: 'var(--borde-sutil)' }}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => alCambiarFiltros({ soloFavoritas: !filtros.soloFavoritas })}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer"
                        style={{
                            background: filtros.soloFavoritas ? 'var(--color-advertencia-bg)' : 'var(--bg-secundario)',
                            color: filtros.soloFavoritas ? 'var(--color-advertencia-texto)' : 'var(--texto-secundario)',
                            borderColor: filtros.soloFavoritas ? 'rgba(245, 158, 11, 0.35)' : 'var(--borde-sutil)',
                        }}
                    >
                        <i
                            className={`${filtros.soloFavoritas ? 'fa-solid text-amber-400' : 'fa-regular'} fa-star text-xs`}
                            aria-hidden="true"
                        />
                        <span>Solo Favoritas del Chef</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="filtro-min-ing"
                            className="text-xs font-medium"
                            style={{ color: 'var(--texto-secundario)' }}
                        >
                            Mín. insumos:
                        </label>
                        <input
                            id="filtro-min-ing"
                            type="number"
                            min="0"
                            value={filtros.minIngredientes}
                            onChange={(e) => alCambiarFiltros({ minIngredientes: e.target.value })}
                            placeholder="0"
                            className="w-16 px-2.5 py-1 text-xs font-mono-num rounded-lg border outline-none"
                            style={{
                                background: 'var(--bg-input)',
                                borderColor: 'var(--borde-sutil)',
                                color: 'var(--texto-primario)',
                            }}
                        />
                    </div>

                    {/* Filtro Rápido por Etiqueta Dietética / Alérgeno */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {CATALOGO_ETIQUETAS.slice(0, 5).map((etq) => {
                            const activa = filtros.etiqueta === etq.nombre;
                            return (
                                <button
                                    key={etq.nombre}
                                    type="button"
                                    onClick={() =>
                                        alCambiarFiltros({
                                            etiqueta: activa ? '' : etq.nombre,
                                        })
                                    }
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border inline-flex items-center gap-1 transition-all cursor-pointer"
                                    style={{
                                        background: activa ? etq.bg : 'var(--bg-secundario)',
                                        color: activa ? etq.color : 'var(--texto-secundario)',
                                        borderColor: activa ? etq.color : 'var(--borde-sutil)',
                                    }}
                                >
                                    <i className={`${etq.icono} text-[10px]`} aria-hidden="true" />
                                    <span>{etq.nombre}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {hayFiltrosActivos && (
                    <button
                        type="button"
                        onClick={alLimpiar}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        style={{
                            background: 'var(--color-error-bg)',
                            color: 'var(--color-error-texto)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                        }}
                    >
                        <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
                        <span>Restablecer filtros</span>
                    </button>
                )}
            </div>
        </section>
    );
};

export default FiltrosRecetas;
