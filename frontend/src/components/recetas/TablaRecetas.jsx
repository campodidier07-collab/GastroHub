const ESTILOS_DIFICULTAD = {
    'Fácil': { bg: '#e3f2eb', color: '#1f634c' },
    'Media': { bg: '#fef3e2', color: '#b45309' },
    'Alta': { bg: '#fde8e8', color: '#b91c1c' },
};

const ICONOS_CATEGORIA = {
    'Entrada': '🍤',
    'Plato Fuerte': '🍛',
    'Postre': '🍫',
    'Bebida': '🍹',
    'Ensalada': '🥗',
    'Sopa': '🍜',
    'Snack': '🥟',
    'Otro': '🍽️',
};

/**
 * Catálogo de recetas con soporte dual:
 * - Vista de cuadrícula de tarjetas gourmet ('grid')
 * - Vista de tabla ejecutiva ('tabla')
 */
const TablaRecetas = ({
    recetas,
    modoVista = 'grid',
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
            <div className="tarjeta flex flex-col items-center justify-center py-16 px-4 gap-4">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: 'var(--color-gris-suave)' }}
                >
                    🍽️
                </div>
                <div className="text-center">
                    <p className="font-bold text-base" style={{ color: 'var(--color-texto-oscuro)' }}>
                        No se encontraron recetas con esos criterios
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Ajusta los filtros de búsqueda o registra una nueva creación culinaria.
                    </p>
                </div>
            </div>
        );
    }

    // ─── MODO CUADRÍCULA DE TARJETAS GOURMET ────────────────────────────────
    if (modoVista === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recetas.map((receta) => {
                    const categoria = receta.categoria || 'Plato Fuerte';
                    const dificultad = receta.dificultad || 'Media';
                    const badgeDif = ESTILOS_DIFICULTAD[dificultad] || ESTILOS_DIFICULTAD.Media;
                    const iconoCat = ICONOS_CATEGORIA[categoria] || '🍽️';

                    return (
                        <article
                            key={receta._id}
                            className="tarjeta overflow-hidden flex flex-col justify-between group"
                        >
                            <div>
                                {/* Cabecera visual / imagen */}
                                <div
                                    className="relative h-44 w-full overflow-hidden flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--color-salmon-claro) 0%, var(--color-ambar-claro) 100%)',
                                    }}
                                >
                                    {receta.imagenUrl ? (
                                        <img
                                            src={receta.imagenUrl}
                                            alt={receta.titulo}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <span className="text-5xl select-none">{iconoCat}</span>
                                    )}

                                    {/* Badge de categoría */}
                                    <span
                                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.92)',
                                            color: 'var(--color-texto-oscuro)',
                                        }}
                                    >
                                        {iconoCat} {categoria}
                                    </span>

                                    {/* Botón Favorito */}
                                    <button
                                        type="button"
                                        onClick={() => alToggleFavorito?.(receta)}
                                        title={receta.favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 cursor-pointer"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.92)',
                                            color: receta.favorito ? '#f59e0b' : '#9ca3af',
                                        }}
                                    >
                                        <span className="text-base leading-none">{receta.favorito ? '★' : '☆'}</span>
                                    </button>
                                </div>

                                {/* Cuerpo de la tarjeta */}
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3
                                            className="font-bold text-base leading-snug line-clamp-2 cursor-pointer hover:underline"
                                            style={{ color: 'var(--color-texto-oscuro)' }}
                                            onClick={() => alVerDetalle(receta)}
                                        >
                                            {receta.titulo}
                                        </h3>
                                        <span
                                            className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                                            style={{ background: badgeDif.bg, color: badgeDif.color }}
                                        >
                                            {dificultad}
                                        </span>
                                    </div>

                                    {receta.descripcion && (
                                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--color-texto-medio)' }}>
                                            {receta.descripcion}
                                        </p>
                                    )}

                                    {/* Metadatos culinarios */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                                        <span
                                            className="px-2.5 py-1 rounded-lg font-medium"
                                            style={{ background: 'var(--color-gris-suave)', color: 'var(--color-texto-oscuro)' }}
                                        >
                                            ⏱️ {receta.tiempo}
                                        </span>
                                        <span
                                            className="px-2.5 py-1 rounded-lg font-medium"
                                            style={{ background: 'var(--color-gris-suave)' }}
                                        >
                                            👥 {receta.porciones || 4} porc.
                                        </span>
                                        {receta.calorias ? (
                                            <span
                                                className="px-2.5 py-1 rounded-lg font-medium"
                                                style={{ background: 'var(--color-gris-suave)' }}
                                            >
                                                🔥 {receta.calorias} kcal
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Pie de tarjeta con contadores y acciones */}
                            <div
                                className="px-5 py-3.5 border-t flex items-center justify-between gap-2"
                                style={{ borderColor: 'var(--color-borde)', background: 'var(--color-crema)' }}
                            >
                                <span className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>
                                    {receta.ingredientes?.length || 0} ingr. · {receta.pasos?.length || 0} pasos
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button className="btn-ver" onClick={() => alVerDetalle(receta)}>
                                        Ficha
                                    </button>
                                    <button className="btn-editar" onClick={() => alEditar(receta)}>
                                        Editar
                                    </button>
                                    <button className="btn-peligro" onClick={() => alEliminar(receta)}>
                                        Borrar
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
    return (
        <div className="tarjeta rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--color-borde)' }}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ background: 'var(--color-gris-suave)', borderBottom: '1px solid var(--color-borde)' }}>
                            <th className="text-center px-3 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>★</th>
                            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Receta</th>
                            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Categoría</th>
                            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Dificultad</th>
                            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Tiempo</th>
                            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Ingr. / Pasos</th>
                            <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Creada</th>
                            <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recetas.map((receta, idx) => {
                            const dificultad = receta.dificultad || 'Media';
                            const badgeDif = ESTILOS_DIFICULTAD[dificultad] || ESTILOS_DIFICULTAD.Media;
                            const categoria = receta.categoria || 'Plato Fuerte';

                            return (
                                <tr
                                    key={receta._id}
                                    className="border-t transition-colors duration-150"
                                    style={{
                                        borderColor: 'var(--color-borde)',
                                        background: idx % 2 === 0 ? '#fff' : 'var(--color-crema)',
                                    }}
                                >
                                    <td className="px-3 py-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => alToggleFavorito?.(receta)}
                                            className="text-base cursor-pointer"
                                            style={{ color: receta.favorito ? '#f59e0b' : '#cbd5e1' }}
                                            title="Alternar favorito"
                                        >
                                            {receta.favorito ? '★' : '☆'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
                                            {receta.titulo}
                                        </p>
                                        {receta.descripcion && (
                                            <p className="text-xs line-clamp-1 max-w-xs" style={{ color: 'var(--color-texto-medio)' }}>
                                                {receta.descripcion}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-xs font-medium" style={{ color: 'var(--color-texto-oscuro)' }}>
                                            {ICONOS_CATEGORIA[categoria] || '🍽️'} {categoria}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                            style={{ background: badgeDif.bg, color: badgeDif.color }}
                                        >
                                            {dificultad}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                            style={{ background: 'var(--color-salmon-claro)', color: 'var(--color-primario-hover)' }}
                                        >
                                            ⏱️ {receta.tiempo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                                        {receta.ingredientes?.length || 0} ingr. · {receta.pasos?.length || 0} pasos
                                    </td>
                                    <td className="px-4 py-4 text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                                        {formatearFecha(receta.createdAt)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 justify-end">
                                            <button className="btn-ver" onClick={() => alVerDetalle(receta)}>Ver</button>
                                            <button className="btn-editar" onClick={() => alEditar(receta)}>Editar</button>
                                            <button className="btn-peligro" onClick={() => alEliminar(receta)}>Eliminar</button>
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
