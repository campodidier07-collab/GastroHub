import {
    Star,
    Clock,
    Users,
    Flame,
    Eye,
    Pencil,
    Trash2,
    ChefHat,
    ArrowUpDown,
    SearchX,
} from 'lucide-react';

const ESTILOS_DIFICULTAD = {
    'Fácil': {
        bg: 'var(--color-exito-bg)',
        color: 'var(--color-exito-texto)',
        border: 'rgba(16, 185, 129, 0.25)',
    },
    'Media': {
        bg: 'var(--color-advertencia-bg)',
        color: 'var(--color-advertencia-texto)',
        border: 'rgba(245, 158, 11, 0.25)',
    },
    'Alta': {
        bg: 'var(--color-error-bg)',
        color: 'var(--color-error-texto)',
        border: 'rgba(239, 68, 68, 0.25)',
    },
};

/**
 * Componente de visualización del catálogo con soporte dual:
 * - Vista de Cuadrícula de Tarjetas ('grid')
 * - Vista de Tabla Ejecutiva con cabeceras ordenables ('tabla')
 */
const TablaRecetas = ({
    recetas,
    modoVista = 'grid',
    ordenActual,
    alCambiarOrden,
    alVerDetalle,
    alEditar,
    alEliminar,
    alToggleFavorito,
}) => {
    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '—';
        return new Date(fechaISO).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (recetas.length === 0) {
        return (
            <div className="tarjeta flex flex-col items-center justify-center py-16 px-4 gap-3 text-center">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'var(--bg-secundario)', color: 'var(--texto-muted)' }}
                >
                    <SearchX className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--texto-primario)' }}>
                        No se encontraron fichas técnicas con esos parámetros
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--texto-muted)' }}>
                        Intenta ajustar los filtros de búsqueda o registra una nueva creación en el catálogo.
                    </p>
                </div>
            </div>
        );
    }

    // ─── MODO CUADRÍCULA DE TARJETAS PREMIUM ────────────────────────────────
    if (modoVista === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recetas.map((receta) => {
                    const categoria = receta.categoria || 'Plato Fuerte';
                    const dificultad = receta.dificultad || 'Media';
                    const badgeDif = ESTILOS_DIFICULTAD[dificultad] || ESTILOS_DIFICULTAD.Media;

                    return (
                        <article
                            key={receta._id}
                            className="tarjeta tarjeta-interactiva overflow-hidden flex flex-col justify-between group"
                        >
                            <div>
                                {/* Imagen de cabecera con overlay sutil */}
                                <div
                                    className="relative h-44 w-full overflow-hidden flex items-center justify-center"
                                    style={{ background: 'var(--bg-secundario)' }}
                                >
                                    {receta.imagenUrl ? (
                                        <img
                                            src={receta.imagenUrl}
                                            alt={receta.titulo}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <ChefHat className="w-10 h-10" style={{ color: 'var(--color-primario)' }} />
                                    )}

                                    <span
                                        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md border"
                                        style={{
                                            background: 'var(--bg-glass)',
                                            color: 'var(--texto-primario)',
                                            borderColor: 'var(--borde-sutil)',
                                        }}
                                    >
                                        {categoria}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => alToggleFavorito?.(receta)}
                                        aria-label={receta.favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border transition-transform hover:scale-105 cursor-pointer"
                                        style={{
                                            background: 'var(--bg-glass)',
                                            borderColor: 'var(--borde-sutil)',
                                        }}
                                    >
                                        <Star
                                            className={`w-4 h-4 ${receta.favorito ? 'fill-amber-400 text-amber-400' : ''}`}
                                            style={{ color: receta.favorito ? '#F59E0B' : 'var(--texto-muted)' }}
                                        />
                                    </button>
                                </div>

                                {/* Cuerpo */}
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-2.5">
                                        <h3
                                            onClick={() => alVerDetalle(receta)}
                                            className="font-bold text-sm sm:text-base leading-snug line-clamp-2 cursor-pointer hover:underline"
                                            style={{ color: 'var(--texto-primario)' }}
                                        >
                                            {receta.titulo}
                                        </h3>
                                        <span
                                            className="shrink-0 px-2 py-0.5 rounded-md text-[11px] font-semibold border"
                                            style={{
                                                background: badgeDif.bg,
                                                color: badgeDif.color,
                                                borderColor: badgeDif.border,
                                            }}
                                        >
                                            {dificultad}
                                        </span>
                                    </div>

                                    {receta.descripcion && (
                                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--texto-secundario)' }}>
                                            {receta.descripcion}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-medium" style={{ color: 'var(--texto-secundario)' }}>
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
                                            style={{ background: 'var(--bg-secundario)' }}
                                        >
                                            <Clock className="w-3 h-3" style={{ color: 'var(--color-primario)' }} />
                                            {receta.tiempo}
                                        </span>
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono-num"
                                            style={{ background: 'var(--bg-secundario)' }}
                                        >
                                            <Users className="w-3 h-3" />
                                            {receta.porciones || 4} porc.
                                        </span>
                                        {receta.calorias ? (
                                            <span
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono-num"
                                                style={{ background: 'var(--bg-secundario)' }}
                                            >
                                                <Flame className="w-3 h-3 text-amber-500" />
                                                {receta.calorias} kcal
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Pie de acciones */}
                            <div
                                className="px-5 py-3 border-t flex items-center justify-between gap-2"
                                style={{ borderColor: 'var(--borde-sutil)', background: 'var(--bg-secundario)' }}
                            >
                                <span className="text-[11px] font-mono-num font-medium" style={{ color: 'var(--texto-muted)' }}>
                                    {receta.ingredientes?.length || 0} insumos · {receta.pasos?.length || 0} pasos
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button type="button" className="btn-ver" onClick={() => alVerDetalle(receta)} title="Abrir ficha técnica">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Ficha</span>
                                    </button>
                                    <button type="button" className="btn-editar" onClick={() => alEditar(receta)} title="Editar receta">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button type="button" className="btn-peligro" onClick={() => alEliminar(receta)} title="Eliminar receta">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        );
    }

    // ─── MODO TABLA EJECUTIVA ───────────────────────────────────────────────
    const alternarOrdenColumna = (tipoAz, tipoZa) => {
        if (!alCambiarOrden) return;
        alCambiarOrden(ordenActual === tipoAz ? tipoZa : tipoAz);
    };

    return (
        <div className="tarjeta overflow-hidden" style={{ borderColor: 'var(--borde-sutil)' }}>
            <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                    <thead>
                        <tr style={{ background: 'var(--bg-secundario)', borderBottom: '1px solid var(--borde-sutil)' }}>
                            <th className="w-10 px-3 py-3 text-center font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                ★
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                <button
                                    type="button"
                                    onClick={() => alternarOrdenColumna('titulo_az', 'titulo_za')}
                                    className="inline-flex items-center gap-1 cursor-pointer hover:underline"
                                >
                                    <span>Ficha Técnica</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                Partida
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                Complejidad
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                Tiempo / Porc.
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                <button
                                    type="button"
                                    onClick={() => alternarOrdenColumna('mas_ingredientes', 'menos_ingredientes')}
                                    className="inline-flex items-center gap-1 cursor-pointer hover:underline"
                                >
                                    <span>Estructura</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                <button
                                    type="button"
                                    onClick={() => alternarOrdenColumna('reciente', 'antiguo')}
                                    className="inline-flex items-center gap-1 cursor-pointer hover:underline"
                                >
                                    <span>Registro</span>
                                    <ArrowUpDown className="w-3 h-3" />
                                </button>
                            </th>
                            <th className="text-right px-5 py-3 font-semibold text-[11px] uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--borde-sutil)' }}>
                        {recetas.map((receta) => {
                            const dificultad = receta.dificultad || 'Media';
                            const badgeDif = ESTILOS_DIFICULTAD[dificultad] || ESTILOS_DIFICULTAD.Media;
                            const categoria = receta.categoria || 'Plato Fuerte';

                            return (
                                <tr
                                    key={receta._id}
                                    className="transition-colors duration-150"
                                    style={{ background: 'var(--bg-card)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                                >
                                    <td className="px-3 py-3.5 text-center">
                                        <button
                                            type="button"
                                            onClick={() => alToggleFavorito?.(receta)}
                                            className="cursor-pointer p-1"
                                            aria-label="Alternar favorito"
                                        >
                                            <Star
                                                className={`w-4 h-4 ${receta.favorito ? 'fill-amber-400 text-amber-400' : ''}`}
                                                style={{ color: receta.favorito ? '#F59E0B' : 'var(--texto-muted)' }}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p
                                            onClick={() => alVerDetalle(receta)}
                                            className="font-bold cursor-pointer hover:underline"
                                            style={{ color: 'var(--texto-primario)' }}
                                        >
                                            {receta.titulo}
                                        </p>
                                        {receta.descripcion && (
                                            <p className="text-xs line-clamp-1 max-w-xs mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                                                {receta.descripcion}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className="px-2.5 py-1 rounded-md text-xs font-semibold border"
                                            style={{
                                                background: 'var(--bg-secundario)',
                                                color: 'var(--texto-primario)',
                                                borderColor: 'var(--borde-sutil)',
                                            }}
                                        >
                                            {categoria}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className="px-2.5 py-0.5 rounded-md text-xs font-semibold border"
                                            style={{
                                                background: badgeDif.bg,
                                                color: badgeDif.color,
                                                borderColor: badgeDif.border,
                                            }}
                                        >
                                            {dificultad}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-xs font-mono-num" style={{ color: 'var(--texto-secundario)' }}>
                                        <div>{receta.tiempo}</div>
                                        <div className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                            {receta.porciones || 4} porc. {receta.calorias ? `· ${receta.calorias} kcal` : ''}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-xs font-mono-num" style={{ color: 'var(--texto-secundario)' }}>
                                        {receta.ingredientes?.length || 0} ingr. · {receta.pasos?.length || 0} pasos
                                    </td>
                                    <td className="px-4 py-3.5 text-xs font-mono-num" style={{ color: 'var(--texto-muted)' }}>
                                        {formatearFecha(receta.createdAt)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <button type="button" className="btn-ver" onClick={() => alVerDetalle(receta)}>
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Ficha</span>
                                            </button>
                                            <button type="button" className="btn-editar" onClick={() => alEditar(receta)}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button type="button" className="btn-peligro" onClick={() => alEliminar(receta)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaRecetas;
