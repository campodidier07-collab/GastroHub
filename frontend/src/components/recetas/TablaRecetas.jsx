/**
 * Tabla principal del catálogo de recetas.
 * @param {Array} recetas - Lista filtrada de recetas a mostrar.
 * @param {Function} alVerDetalle - Callback al hacer click en "Ver".
 * @param {Function} alEditar - Callback al hacer click en "Editar".
 * @param {Function} alEliminar - Callback al hacer click en "Eliminar".
 */
const TablaRecetas = ({ recetas, alVerDetalle, alEditar, alEliminar }) => {
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
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-gris-suave)' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="var(--color-texto-medio)" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-texto-oscuro)' }}>
                        No se encontraron recetas
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Intenta ajustar los filtros o crea una nueva receta.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--color-borde)' }}>
            {/* Versión de escritorio */}
            <div className="overflow-x-auto hidden md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ background: 'var(--color-gris-suave)', borderBottom: '1px solid var(--color-borde)' }}>
                            <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Receta</th>
                            <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Tiempo</th>
                            <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Ingredientes</th>
                            <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Pasos</th>
                            <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Creada</th>
                            <th className="text-right px-5 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: 'var(--color-texto-medio)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recetas.map((receta, idx) => (
                            <tr
                                key={receta._id}
                                className="border-t transition-colors duration-150 hover:bg-orange-50"
                                style={{
                                    borderColor: 'var(--color-borde)',
                                    background: idx % 2 === 0 ? '#fff' : 'var(--color-crema)',
                                }}
                            >
                                {/* Nombre */}
                                <td className="px-5 py-4">
                                    <span className="font-medium" style={{ color: 'var(--color-texto-oscuro)' }}>
                                        {receta.titulo}
                                    </span>
                                </td>

                                {/* Tiempo */}
                                <td className="px-5 py-4">
                                    <span
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{ background: 'var(--color-salmon-claro)', color: 'var(--color-primario-hover)' }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {receta.tiempo}
                                    </span>
                                </td>

                                {/* Ingredientes */}
                                <td className="px-5 py-4">
                                    <span
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{ background: 'var(--color-verde-menta)', color: '#27ae60' }}
                                    >
                                        {receta.ingredientes?.length || 0}
                                    </span>
                                </td>

                                {/* Pasos */}
                                <td className="px-5 py-4">
                                    <span
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{ background: 'var(--color-celeste)', color: '#2980b9' }}
                                    >
                                        {receta.pasos?.length || 0}
                                    </span>
                                </td>

                                {/* Fecha */}
                                <td className="px-5 py-4 text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                                    {formatearFecha(receta.createdAt)}
                                </td>

                                {/* Acciones */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            className="btn-ver"
                                            onClick={() => alVerDetalle(receta)}
                                            title="Ver detalles"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            Ver
                                        </button>
                                        <button
                                            className="btn-editar"
                                            onClick={() => alEditar(receta)}
                                            title="Editar receta"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            className="btn-peligro"
                                            onClick={() => alEliminar(receta)}
                                            title="Eliminar receta"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Versión móvil — tarjetas */}
            <div className="md:hidden flex flex-col divide-y" style={{ borderColor: 'var(--color-borde)' }}>
                {recetas.map((receta) => (
                    <div key={receta._id} className="p-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm" style={{ color: 'var(--color-texto-oscuro)' }}>
                                {receta.titulo}
                            </p>
                            <span
                                className="flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium"
                                style={{ background: 'var(--color-salmon-claro)', color: 'var(--color-primario-hover)' }}
                            >
                                {receta.tiempo}
                            </span>
                        </div>
                        <div className="flex gap-2 text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                            <span>{receta.ingredientes?.length || 0} ingredientes</span>
                            <span>•</span>
                            <span>{receta.pasos?.length || 0} pasos</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-ver flex-1 justify-center" onClick={() => alVerDetalle(receta)}>Ver</button>
                            <button className="btn-editar flex-1 justify-center" onClick={() => alEditar(receta)}>Editar</button>
                            <button className="btn-peligro flex-1 justify-center" onClick={() => alEliminar(receta)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TablaRecetas;
