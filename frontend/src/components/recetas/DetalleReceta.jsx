/**
 * Vista de detalle de una receta.
 * @param {Object} receta - Objeto completo de la receta.
 */
const DetalleReceta = ({ receta }) => {
    if (!receta) return null;

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '—';
        return new Date(fechaISO).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Encabezado de la receta */}
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                    {receta.titulo}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-texto-medio)' }}>
                        {/* Ícono reloj */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="var(--color-primario)" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {receta.tiempo}
                    </span>
                    <span style={{ color: 'var(--color-borde)' }}>•</span>
                    <span className="text-sm" style={{ color: 'var(--color-texto-medio)' }}>
                        Creada el {formatearFecha(receta.createdAt)}
                    </span>
                </div>
            </div>

            {/* Ingredientes */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--color-verde-menta)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#27ae60" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Ingredientes ({receta.ingredientes?.length || 0})
                    </h4>
                </div>

                {receta.ingredientes?.length > 0 ? (
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-borde)' }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: 'var(--color-gris-suave)' }}>
                                    <th className="text-left px-4 py-2 font-medium text-xs" style={{ color: 'var(--color-texto-medio)' }}>Nombre</th>
                                    <th className="text-left px-4 py-2 font-medium text-xs" style={{ color: 'var(--color-texto-medio)' }}>Cantidad</th>
                                    <th className="text-left px-4 py-2 font-medium text-xs" style={{ color: 'var(--color-texto-medio)' }}>Unidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receta.ingredientes.map((ing, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-t"
                                        style={{ borderColor: 'var(--color-borde)', background: idx % 2 === 0 ? '#fff' : 'var(--color-crema)' }}
                                    >
                                        <td className="px-4 py-2" style={{ color: 'var(--color-texto-oscuro)' }}>{ing.nombre || '—'}</td>
                                        <td className="px-4 py-2" style={{ color: 'var(--color-texto-medio)' }}>{ing.cantidad ?? '—'}</td>
                                        <td className="px-4 py-2" style={{ color: 'var(--color-texto-medio)' }}>{ing.unidad || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: 'var(--color-texto-medio)' }}>Sin ingredientes registrados.</p>
                )}
            </div>

            {/* Pasos */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--color-celeste)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#2980b9" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Preparación ({receta.pasos?.length || 0} pasos)
                    </h4>
                </div>

                {receta.pasos?.length > 0 ? (
                    <ol className="flex flex-col gap-3">
                        {receta.pasos.map((paso, idx) => (
                            <li key={idx} className="flex gap-3 items-start">
                                <span
                                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                    style={{ background: 'var(--color-salmon-claro)', color: 'var(--color-primario)' }}
                                >
                                    {idx + 1}
                                </span>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-texto-oscuro)' }}>
                                    {paso}
                                </p>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-sm" style={{ color: 'var(--color-texto-medio)' }}>Sin pasos registrados.</p>
                )}
            </div>
        </div>
    );
};

export default DetalleReceta;
