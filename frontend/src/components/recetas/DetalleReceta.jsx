import { useState } from 'react';

const ESTILOS_DIFICULTAD = {
    'Fácil': { bg: '#e3f2eb', color: '#1f634c' },
    'Media': { bg: '#fef3e2', color: '#b45309' },
    'Alta': { bg: '#fde8e8', color: '#b91c1c' },
};

/**
 * Vista interactiva de Ficha Técnica de Receta en GastroHub.
 * Incluye escalador dinámico de porciones, checklist de ingredientes/pasos y botón de impresión.
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
            {/* Imagen de cabecera si existe */}
            {receta.imagenUrl && (
                <div className="relative h-52 w-full rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--color-borde)' }}>
                    <img
                        src={receta.imagenUrl}
                        alt={receta.titulo}
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(31,29,26,0.55) 0%, transparent 60%)' }}
                    />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 backdrop-blur-sm">
                            {receta.categoria || 'Plato Fuerte'}
                        </span>
                        {receta.calorias ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 backdrop-blur-sm">
                                🔥 {Math.round(receta.calorias * factorEscala)} kcal totales ({receta.calorias} kcal / base)
                            </span>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Encabezado y acciones rápidas */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                                style={{ background: 'var(--color-salmon-claro)', color: 'var(--color-primario-hover)' }}
                            >
                                {receta.categoria || 'Plato Fuerte'}
                            </span>
                            <span
                                className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                                style={{ background: badgeDif.bg, color: badgeDif.color }}
                            >
                                Dificultad {dificultad}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                                ⏱️ {receta.tiempo}
                            </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: 'var(--color-texto-oscuro)' }}>
                            {receta.titulo}
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 no-print">
                        {alToggleFavorito && (
                            <button
                                type="button"
                                onClick={() => alToggleFavorito(receta)}
                                className="px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer"
                                style={{
                                    background: receta.favorito ? 'var(--color-ambar-claro)' : '#fff',
                                    color: receta.favorito ? '#b45309' : 'var(--color-texto-medio)',
                                    borderColor: receta.favorito ? '#f59e0b' : 'var(--color-borde)',
                                }}
                            >
                                {receta.favorito ? '★ Favorita' : '☆ Favorito'}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                            style={{ background: '#fff', borderColor: 'var(--color-borde)', color: 'var(--color-texto-oscuro)' }}
                            title="Imprimir ficha técnica"
                        >
                            🖨️ Imprimir
                        </button>
                        {alEditar && (
                            <button
                                type="button"
                                onClick={() => alEditar(receta)}
                                className="btn-editar"
                            >
                                Editar
                            </button>
                        )}
                    </div>
                </div>

                {receta.descripcion && (
                    <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--color-texto-medio)' }}>
                        {receta.descripcion}
                    </p>
                )}

                <p className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                    Registrada el {formatearFecha(receta.createdAt)}
                </p>
            </div>

            {/* Escalador Dinámico de Porciones */}
            <div
                className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3"
                style={{ background: 'var(--color-crema)', borderColor: 'var(--color-borde)' }}
            >
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primario)' }}>
                        Calculadora de Rendimiento (Mise en Place)
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                        Ajusta las porciones para recalcular automáticamente las cantidades de ingredientes.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPorcionesActuales((p) => Math.max(1, p - 1))}
                        className="w-8 h-8 rounded-lg border font-bold text-sm flex items-center justify-center bg-white cursor-pointer"
                        style={{ borderColor: 'var(--color-borde)' }}
                    >
                        −
                    </button>
                    <span className="px-3 py-1 rounded-lg bg-white border text-sm font-extrabold" style={{ borderColor: 'var(--color-borde)' }}>
                        {porcionesActuales} {porcionesActuales === 1 ? 'porción' : 'porciones'}
                    </span>
                    <button
                        type="button"
                        onClick={() => setPorcionesActuales((p) => Math.min(50, p + 1))}
                        className="w-8 h-8 rounded-lg border font-bold text-sm flex items-center justify-center bg-white cursor-pointer"
                        style={{ borderColor: 'var(--color-borde)' }}
                    >
                        +
                    </button>
                    {porcionesActuales !== porcionesBase && (
                        <button
                            type="button"
                            onClick={() => setPorcionesActuales(porcionesBase)}
                            className="text-xs font-semibold underline ml-1 cursor-pointer"
                            style={{ color: 'var(--color-primario)' }}
                        >
                            Restablecer ({porcionesBase})
                        </button>
                    )}
                </div>
            </div>

            {/* Ingredientes interactivos */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        🥗 Ingredientes ({receta.ingredientes?.length || 0})
                    </h4>
                    <span className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                        Haz clic en una fila para marcar tu mise en place
                    </span>
                </div>

                {receta.ingredientes?.length > 0 ? (
                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-borde)' }}>
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ background: 'var(--color-gris-suave)' }}>
                                    <th className="w-10 px-3 py-2 text-center text-xs font-semibold" style={{ color: 'var(--color-texto-medio)' }}>✓</th>
                                    <th className="text-left px-4 py-2 font-semibold text-xs" style={{ color: 'var(--color-texto-medio)' }}>Ingrediente</th>
                                    <th className="text-left px-4 py-2 font-semibold text-xs" style={{ color: 'var(--color-texto-medio)' }}>Cantidad escalada</th>
                                    <th className="text-left px-4 py-2 font-semibold text-xs" style={{ color: 'var(--color-texto-medio)' }}>Unidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receta.ingredientes.map((ing, idx) => {
                                    const marcado = Boolean(ingredientesMarcados[idx]);
                                    return (
                                        <tr
                                            key={idx}
                                            onClick={() => alternarIngrediente(idx)}
                                            className="border-t cursor-pointer transition-colors"
                                            style={{
                                                borderColor: 'var(--color-borde)',
                                                background: marcado ? 'var(--color-verde-menta)' : idx % 2 === 0 ? '#fff' : 'var(--color-crema)',
                                                textDecoration: marcado ? 'line-through' : 'none',
                                                opacity: marcado ? 0.75 : 1,
                                            }}
                                        >
                                            <td className="px-3 py-2.5 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={marcado}
                                                    onChange={() => {}}
                                                    className="cursor-pointer accent-emerald-700"
                                                />
                                            </td>
                                            <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--color-texto-oscuro)' }}>
                                                {ing.nombre || '—'}
                                            </td>
                                            <td className="px-4 py-2.5 font-bold" style={{ color: 'var(--color-primario-hover)' }}>
                                                {formatearCantidadEscalada(ing.cantidad)}
                                            </td>
                                            <td className="px-4 py-2.5" style={{ color: 'var(--color-texto-medio)' }}>
                                                {ing.unidad || '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: 'var(--color-texto-medio)' }}>Sin ingredientes registrados.</p>
                )}
            </div>

            {/* Pasos interactivos con barra de progreso */}
            <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h4 className="text-sm font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        👨‍🍳 Ejecución Paso a Paso ({cantidadPasosListos}/{totalPasos} completados)
                    </h4>
                    <span className="text-xs font-bold" style={{ color: 'var(--color-secundario)' }}>
                        {porcentajeProgreso}% completado
                    </span>
                </div>

                {totalPasos > 0 && (
                    <div className="w-full h-2 rounded-full overflow-hidden mb-4" style={{ background: 'var(--color-gris-suave)' }}>
                        <div
                            className="h-full transition-all duration-300"
                            style={{ width: `${porcentajeProgreso}%`, background: 'var(--color-secundario)' }}
                        />
                    </div>
                )}

                {receta.pasos?.length > 0 ? (
                    <ol className="flex flex-col gap-3">
                        {receta.pasos.map((paso, idx) => {
                            const completado = Boolean(pasosCompletados[idx]);
                            return (
                                <li
                                    key={idx}
                                    onClick={() => alternarPaso(idx)}
                                    className="flex gap-3 items-start p-3 rounded-xl border cursor-pointer transition-all"
                                    style={{
                                        borderColor: completado ? '#bfe0d1' : 'var(--color-borde)',
                                        background: completado ? 'var(--color-verde-menta)' : '#fff',
                                    }}
                                >
                                    <span
                                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                        style={{
                                            background: completado ? 'var(--color-secundario)' : 'var(--color-salmon-claro)',
                                            color: completado ? '#fff' : 'var(--color-primario)',
                                        }}
                                    >
                                        {completado ? '✓' : idx + 1}
                                    </span>
                                    <p
                                        className="text-sm leading-relaxed flex-1"
                                        style={{
                                            color: 'var(--color-texto-oscuro)',
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
                    <p className="text-sm" style={{ color: 'var(--color-texto-medio)' }}>Sin pasos registrados.</p>
                )}
            </div>
        </div>
    );
};

export default DetalleReceta;
