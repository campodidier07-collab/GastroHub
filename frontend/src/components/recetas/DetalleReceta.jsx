import { useState } from 'react';

const ESTILOS_DIFICULTAD = {
    'Fácil': { bg: 'var(--color-exito-bg)', color: 'var(--color-exito-texto)' },
    'Media': { bg: 'var(--color-advertencia-bg)', color: 'var(--color-advertencia-texto)' },
    'Alta': { bg: 'var(--color-error-bg)', color: 'var(--color-error-texto)' },
};

/**
 * Ficha Técnica Interactiva & Modo Cocina de GastroHub con Font Awesome.
 */
const DetalleReceta = ({ receta, alToggleFavorito, alEditar }) => {
    const porcionesBase = receta?.porciones || 4;
    const [porcionesActuales, setPorcionesActuales] = useState(porcionesBase);
    const [ingredientesMarcados, setIngredientesMarcados] = useState({});
    const [pasosCompletados, setPasosCompletados] = useState({});

    if (!receta) return null;

    const factorEscala = porcionesActuales / porcionesBase;
    const dificultad = receta.dificultad || 'Media';
    const badgeDif = ESTILOS_DIFICULTAD[dificultad] || ESTILOS_DIFICULTAD.Media;

    const formatearCantidadEscalada = (cantidad) => {
        if (cantidad === undefined || cantidad === null || cantidad === '') return 'Al gusto';
        const valor = Number(cantidad) * factorEscala;
        if (Number.isNaN(valor)) return cantidad;
        return Number.isInteger(valor) ? valor : Number(valor.toFixed(1));
    };

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '—';
        return new Date(fechaISO).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const alternarIngrediente = (idx) => {
        setIngredientesMarcados((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const alternarPaso = (idx) => {
        setPasosCompletados((prev) => ({ ...prev, [idx]: !prev[idx] }));
    };

    const totalPasos = receta.pasos?.length || 0;
    const cantidadPasosListos = Object.values(pasosCompletados).filter(Boolean).length;
    const porcentajeProgreso = totalPasos > 0 ? Math.round((cantidadPasosListos / totalPasos) * 100) : 0;

    return (
        <div className="flex flex-col gap-6">
            {receta.imagenUrl && (
                <div className="relative h-52 w-full rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--borde-sutil)' }}>
                    <img
                        src={receta.imagenUrl}
                        alt={receta.titulo}
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(9,13,22,0.75) 0%, transparent 65%)' }}
                    />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-black/55 backdrop-blur-md">
                            {receta.categoria || 'Plato Fuerte'}
                        </span>
                        {receta.calorias ? (
                            <span className="px-3 py-1 rounded-lg text-xs font-mono-num font-bold bg-black/55 backdrop-blur-md flex items-center gap-1.5">
                                <i className="fa-solid fa-fire-flame-curved text-xs text-amber-400" aria-hidden="true" />
                                <span>{Math.round(receta.calorias * factorEscala)} kcal totales ({receta.calorias} kcal/porc.)</span>
                            </span>
                        ) : null}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                                className="px-2.5 py-0.5 rounded-md text-xs font-bold"
                                style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                            >
                                {receta.categoria || 'Plato Fuerte'}
                            </span>
                            <span
                                className="px-2.5 py-0.5 rounded-md text-xs font-bold"
                                style={{ background: badgeDif.bg, color: badgeDif.color }}
                            >
                                Complejidad {dificultad}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-mono-num" style={{ color: 'var(--texto-secundario)' }}>
                                <i className="fa-regular fa-clock text-xs" aria-hidden="true" />
                                <span>{receta.tiempo}</span>
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--texto-primario)' }}>
                            {receta.titulo}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 no-print">
                        {alToggleFavorito && (
                            <button
                                type="button"
                                onClick={() => alToggleFavorito(receta)}
                                className="btn-secundario py-1.5 px-3 text-xs"
                            >
                                <i
                                    className={`${receta.favorito ? 'fa-solid text-amber-400' : 'fa-regular'} fa-star text-xs`}
                                    aria-hidden="true"
                                />
                                <span>{receta.favorito ? 'Favorita' : 'Destacar'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="btn-secundario py-1.5 px-3 text-xs"
                            title="Imprimir ficha técnica"
                        >
                            <i className="fa-solid fa-print text-xs" aria-hidden="true" />
                            <span>Imprimir</span>
                        </button>
                        {alEditar && (
                            <button
                                type="button"
                                onClick={() => alEditar(receta)}
                                className="btn-editar"
                            >
                                <i className="fa-solid fa-pen text-xs" aria-hidden="true" />
                                <span>Editar</span>
                            </button>
                        )}
                    </div>
                </div>

                {receta.descripcion && (
                    <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--texto-secundario)' }}>
                        {receta.descripcion}
                    </p>
                )}

                <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>
                    Documentada el {formatearFecha(receta.createdAt)}
                </p>
            </div>

            {/* Escalador de Rendimiento */}
            <div
                className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3"
                style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
            >
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--color-primario)' }}>
                        <i className="fa-solid fa-scale-balanced text-xs" aria-hidden="true" />
                        <span>Escalador Dinámico de Rendimiento</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
                        Modifica las porciones para recalcular todas las cantidades de mise en place en tiempo real.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPorcionesActuales((p) => Math.max(1, p - 1))}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)', color: 'var(--texto-primario)' }}
                        aria-label="Disminuir porciones"
                    >
                        <i className="fa-solid fa-minus text-xs" aria-hidden="true" />
                    </button>
                    <span
                        className="px-3.5 py-1 rounded-lg border text-xs font-mono-num font-bold"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)', color: 'var(--texto-primario)' }}
                    >
                        {porcionesActuales} {porcionesActuales === 1 ? 'porción' : 'porciones'}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPorcionesActuales((p) => Math.min(50, p + 1))}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer"
                        style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)', color: 'var(--texto-primario)' }}
                        aria-label="Aumentar porciones"
                    >
                        <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                    </button>
                    {porcionesActuales !== porcionesBase && (
                        <button
                            type="button"
                            onClick={() => setPorcionesActuales(porcionesBase)}
                            className="inline-flex items-center gap-1 text-xs font-semibold ml-1 cursor-pointer"
                            style={{ color: 'var(--color-primario)' }}
                        >
                            <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
                            <span>Base ({porcionesBase})</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Ingredientes */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--texto-primario)' }}>
                        <i className="fa-solid fa-utensils text-xs" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                        <span>Mise en Place ({receta.ingredientes?.length || 0} insumos)</span>
                    </h4>
                    <span className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                        Haz clic en cada insumo para marcarlo como listo
                    </span>
                </div>

                {receta.ingredientes?.length > 0 ? (
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--borde-sutil)' }}>
                        <table className="w-full text-xs sm:text-sm">
                            <thead>
                                <tr style={{ background: 'var(--bg-secundario)' }}>
                                    <th className="w-10 px-3 py-2.5 text-center text-xs font-semibold" style={{ color: 'var(--texto-muted)' }}>✓</th>
                                    <th className="text-left px-4 py-2.5 font-semibold text-xs" style={{ color: 'var(--texto-muted)' }}>Insumo</th>
                                    <th className="text-left px-4 py-2.5 font-semibold text-xs" style={{ color: 'var(--texto-muted)' }}>Cantidad Escalada</th>
                                    <th className="text-left px-4 py-2.5 font-semibold text-xs" style={{ color: 'var(--texto-muted)' }}>Unidad</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y" style={{ borderColor: 'var(--borde-sutil)' }}>
                                {receta.ingredientes.map((ing, idx) => {
                                    const marcado = Boolean(ingredientesMarcados[idx]);
                                    return (
                                        <tr
                                            key={idx}
                                            onClick={() => alternarIngrediente(idx)}
                                            className="cursor-pointer transition-colors"
                                            style={{
                                                background: marcado ? 'var(--color-exito-bg)' : 'var(--bg-card)',
                                                textDecoration: marcado ? 'line-through' : 'none',
                                                opacity: marcado ? 0.78 : 1,
                                            }}
                                        >
                                            <td className="px-3 py-2.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={marcado}
                                                    onChange={() => {}}
                                                    className="cursor-pointer accent-emerald-600"
                                                />
                                            </td>
                                            <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--texto-primario)' }}>
                                                {ing.nombre || '—'}
                                            </td>
                                            <td className="px-4 py-2.5 font-mono-num font-bold" style={{ color: 'var(--color-primario)' }}>
                                                {formatearCantidadEscalada(ing.cantidad)}
                                            </td>
                                            <td className="px-4 py-2.5" style={{ color: 'var(--texto-secundario)' }}>
                                                {ing.unidad || '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>Sin insumos registrados.</p>
                )}
            </div>

            {/* Pasos */}
            <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--texto-primario)' }}>
                        <i className="fa-solid fa-circle-check text-xs" style={{ color: 'var(--color-exito)' }} aria-hidden="true" />
                        <span>Protocolo Paso a Paso ({cantidadPasosListos}/{totalPasos})</span>
                    </h4>
                    <span className="text-xs font-mono-num font-bold" style={{ color: 'var(--color-exito-texto)' }}>
                        {porcentajeProgreso}% completado
                    </span>
                </div>

                {totalPasos > 0 && (
                    <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: 'var(--bg-secundario)' }}>
                        <div
                            className="h-full transition-all duration-300"
                            style={{ width: `${porcentajeProgreso}%`, background: 'var(--color-exito)' }}
                        />
                    </div>
                )}

                {receta.pasos?.length > 0 ? (
                    <ol className="flex flex-col gap-2.5">
                        {receta.pasos.map((paso, idx) => {
                            const completado = Boolean(pasosCompletados[idx]);
                            return (
                                <li
                                    key={idx}
                                    onClick={() => alternarPaso(idx)}
                                    className="flex gap-3 items-start p-3.5 rounded-xl border cursor-pointer transition-all"
                                    style={{
                                        borderColor: completado ? 'rgba(16, 185, 129, 0.35)' : 'var(--borde-sutil)',
                                        background: completado ? 'var(--color-exito-bg)' : 'var(--bg-card)',
                                    }}
                                >
                                    <span
                                        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono-num font-bold mt-0.5"
                                        style={{
                                            background: completado ? 'var(--color-exito)' : 'var(--color-primario-suave)',
                                            color: completado ? '#FFFFFF' : 'var(--color-primario)',
                                        }}
                                    >
                                        {completado ? <i className="fa-solid fa-check text-[10px]" aria-hidden="true" /> : idx + 1}
                                    </span>
                                    <p
                                        className="text-xs sm:text-sm leading-relaxed flex-1"
                                        style={{
                                            color: 'var(--texto-primario)',
                                            textDecoration: completado ? 'line-through' : 'none',
                                        }}
                                    >
                                        {paso}
                                    </p>
                                </li>
                            );
                        })}
                    </ol>
                ) : (
                    <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>Sin pasos registrados.</p>
                )}
            </div>
        </div>
    );
};

export default DetalleReceta;
