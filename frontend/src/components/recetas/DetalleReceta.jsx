import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { obtenerMetaEtiqueta, calcularEscandallo } from '../../utils/etiquetasGastronomicas';

const ESTILOS_DIFICULTAD = {
    'Fácil': { bg: 'var(--color-exito-bg)', color: 'var(--color-exito-texto)' },
    'Media': { bg: 'var(--color-advertencia-bg)', color: 'var(--color-advertencia-texto)' },
    'Alta': { bg: 'var(--color-error-bg)', color: 'var(--color-error-texto)' },
};

/**
 * Extrae el primer tiempo detectado en un paso de preparación (ej. "12 minutos", "90 segundos")
 * y devuelve los segundos totales y etiqueta legible.
 */
const detectarTiempoEnPaso = (textoPaso) => {
    if (!textoPaso || typeof textoPaso !== 'string') return null;
    const match = textoPaso.match(/(\d+)\s*(?:a\s*\d+\s*)?(minutos?|min|segundos?|seg)\b/i);
    if (!match) return null;

    const valor = parseInt(match[1], 10);
    if (Number.isNaN(valor) || valor <= 0) return null;

    const unidadRaw = match[2].toLowerCase();
    const esSegundos = unidadRaw.startsWith('seg');
    const segundosTotales = esSegundos ? valor : valor * 60;
    const etiqueta = esSegundos ? `${valor}s` : `${valor} min`;

    return { segundosTotales, etiqueta };
};

/**
 * Emite un aviso acústico suave mediante Web Audio API al finalizar el cronómetro de cocina.
 */
const reproducirAlarmaCocina = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
            gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.16);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.16);
            osc.stop(ctx.currentTime + idx * 0.16 + 0.35);
        });
    } catch {
        // Silencioso si el navegador bloquea audio sin interacción
    }
};

/**
 * Ficha Técnica Interactiva & Modo Cocina Pro de GastroHub.
 * Incluye Escalador Dinámico, Escandallo Financiero (Food Cost), Cronómetro en Vivo,
 * Etiquetas de Alérgenos, Clonación en 1 clic e Impresión Estandarizada.
 */
const DetalleReceta = ({ receta, alToggleFavorito, alEditar, alClonar }) => {
    const porcionesBase = receta?.porciones || 4;
    const [porcionesActuales, setPorcionesActuales] = useState(porcionesBase);
    const [foodCostObjetivo, setFoodCostObjetivo] = useState(30);
    const [ingredientesMarcados, setIngredientesMarcados] = useState({});
    const [pasosCompletados, setPasosCompletados] = useState({});

    // Estado del Cronómetro de Cocina en Vivo
    const [timerTotalSegundos, setTimerTotalSegundos] = useState(0);
    const [timerRestante, setTimerRestante] = useState(0);
    const [timerActivo, setTimerActivo] = useState(false);
    const [timerEtiqueta, setTimerEtiqueta] = useState('');

    useEffect(() => {
        if (!timerActivo) return undefined;

        const intervalo = setInterval(() => {
            setTimerRestante((prev) => {
                if (prev <= 1) {
                    setTimerActivo(false);
                    reproducirAlarmaCocina();
                    toast.success(`¡Tiempo completado! (${timerEtiqueta || 'Cronómetro de cocina'})`, {
                        duration: 5000,
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalo);
    }, [timerActivo, timerEtiqueta]);

    if (!receta) return null;

    const iniciarCronometro = (segundos, etiqueta) => {
        setTimerTotalSegundos(segundos);
        setTimerRestante(segundos);
        setTimerEtiqueta(etiqueta);
        setTimerActivo(true);
        toast.success(`Cronómetro iniciado: ${etiqueta}`);
    };

    const formatearMMSS = (segundos) => {
        const mins = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const factorEscala = porcionesActuales / porcionesBase;
    const dificultad = receta.dificultad || 'Media';
    const badgeDif = ESTILOS_DIFICULTAD[dificultad] || ESTILOS_DIFICULTAD.Media;
    const escandallo = calcularEscandallo(receta.costoPorPorcion, porcionesActuales, foodCostObjetivo);

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
    const progresoTimerPct = timerTotalSegundos > 0
        ? Math.round(((timerTotalSegundos - timerRestante) / timerTotalSegundos) * 100)
        : 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Hero Visual del Plato */}
            {receta.imagenUrl && (
                <div className="relative h-52 w-full rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--borde-sutil)' }}>
                    <img
                        src={receta.imagenUrl}
                        alt={receta.titulo}
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(9,13,22,0.8) 0%, transparent 65%)' }}
                    />
                    <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-black/55 backdrop-blur-md">
                            {receta.categoria || 'Plato Fuerte'}
                        </span>
                        <div className="flex items-center gap-2">
                            {escandallo && (
                                <span className="px-3 py-1 rounded-lg text-xs font-mono-num font-bold bg-emerald-600/85 backdrop-blur-md flex items-center gap-1.5">
                                    <i className="fa-solid fa-coins text-xs" aria-hidden="true" />
                                    <span>Costo: ${escandallo.costoUnitario.toFixed(2)} / porc.</span>
                                </span>
                            )}
                            {receta.calorias ? (
                                <span className="px-3 py-1 rounded-lg text-xs font-mono-num font-bold bg-black/55 backdrop-blur-md flex items-center gap-1.5">
                                    <i className="fa-solid fa-fire-flame-curved text-xs text-amber-400" aria-hidden="true" />
                                    <span>{Math.round(receta.calorias * factorEscala)} kcal lote ({receta.calorias} kcal/porc.)</span>
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Encabezado y Acciones Operativas */}
            <div className="flex flex-col gap-2.5">
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

                    <div className="flex flex-wrap items-center gap-2 no-print">
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
                        {alClonar && (
                            <button
                                type="button"
                                onClick={() => alClonar(receta)}
                                className="btn-secundario py-1.5 px-3 text-xs"
                                title="Crear variante duplicada de esta ficha"
                            >
                                <i className="fa-regular fa-clone text-xs" aria-hidden="true" />
                                <span>Clonar Ficha</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="btn-secundario py-1.5 px-3 text-xs"
                            title="Imprimir o guardar ficha técnica en PDF"
                        >
                            <i className="fa-solid fa-print text-xs" aria-hidden="true" />
                            <span>Imprimir / PDF</span>
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
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>
                        {receta.descripcion}
                    </p>
                )}

                {/* Etiquetas Dietéticas y Alérgenos */}
                {receta.etiquetas?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {receta.etiquetas.map((etiqueta) => {
                            const meta = obtenerMetaEtiqueta(etiqueta);
                            return (
                                <span
                                    key={etiqueta}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                                    style={{ background: meta.bg, color: meta.color }}
                                >
                                    <i className={`${meta.icono} text-[11px]`} aria-hidden="true" />
                                    <span>{meta.nombre}</span>
                                </span>
                            );
                        })}
                    </div>
                )}

                <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>
                    Documentada el {formatearFecha(receta.createdAt)} · Código Ficha #{String(receta._id).slice(-6).toUpperCase()}
                </p>
            </div>

            {/* Escalador Dinámico de Rendimiento */}
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
                        Ajusta las porciones para recalcular insumos y costos del lote en tiempo real.
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
                        onClick={() => setPorcionesActuales((p) => Math.min(100, p + 1))}
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

            {/* Simulador de Escandallo & Rentabilidad (Food Cost Calculator) */}
            {escandallo && (
                <div
                    className="p-4 rounded-2xl border flex flex-col gap-3.5"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)' }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-calculator text-xs" style={{ color: 'var(--color-exito)' }} aria-hidden="true" />
                            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--texto-primario)' }}>
                                Ingeniería de Costos & Rentabilidad (Escandallo)
                            </h4>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs no-print">
                            <span style={{ color: 'var(--texto-muted)' }}>Food Cost Objetivo:</span>
                            {[25, 28, 30, 35].map((pct) => (
                                <button
                                    key={pct}
                                    type="button"
                                    onClick={() => setFoodCostObjetivo(pct)}
                                    className="px-2 py-0.5 rounded-md font-mono-num text-[11px] font-bold border cursor-pointer transition-all"
                                    style={{
                                        background: foodCostObjetivo === pct ? 'var(--color-primario)' : 'var(--bg-secundario)',
                                        color: foodCostObjetivo === pct ? '#FFFFFF' : 'var(--texto-secundario)',
                                        borderColor: foodCostObjetivo === pct ? 'var(--color-primario)' : 'var(--borde-sutil)',
                                    }}
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl border" style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}>
                            <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>Costo / Porción</p>
                            <p className="text-base font-extrabold font-mono-num mt-0.5" style={{ color: 'var(--texto-primario)' }}>
                                ${escandallo.costoUnitario.toFixed(2)} <span className="text-[10px] font-normal">USD</span>
                            </p>
                        </div>

                        <div className="p-3 rounded-xl border" style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}>
                            <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                Costo Lote ({porcionesActuales} porc.)
                            </p>
                            <p className="text-base font-extrabold font-mono-num mt-0.5" style={{ color: 'var(--color-primario)' }}>
                                ${escandallo.costoLote.toFixed(2)} <span className="text-[10px] font-normal">USD</span>
                            </p>
                        </div>

                        <div className="p-3 rounded-xl border" style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}>
                            <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                Precio Carta Sugerido
                            </p>
                            <p className="text-base font-extrabold font-mono-num mt-0.5" style={{ color: 'var(--texto-primario)' }}>
                                ${escandallo.precioVentaSugerido.toFixed(2)} <span className="text-[10px] font-normal">USD</span>
                            </p>
                        </div>

                        <div className="p-3 rounded-xl border" style={{ background: 'var(--color-exito-bg)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                            <p className="text-[11px] font-semibold" style={{ color: 'var(--color-exito-texto)' }}>
                                Utilidad Bruta ({escandallo.margenBrutoPct}%)
                            </p>
                            <p className="text-base font-extrabold font-mono-num mt-0.5" style={{ color: 'var(--color-exito-texto)' }}>
                                +${escandallo.utilidadPorPlato.toFixed(2)} <span className="text-[10px] font-normal">/plato</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Widget de Cronómetro de Cocina en Vivo */}
            <div
                className="p-4 rounded-2xl border flex flex-col gap-3 no-print"
                style={{
                    background: timerActivo ? 'var(--color-primario-suave)' : 'var(--bg-secundario)',
                    borderColor: timerActivo ? 'var(--color-primario)' : 'var(--borde-sutil)',
                }}
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{
                                background: timerActivo ? 'var(--color-primario)' : 'var(--bg-card)',
                                color: timerActivo ? '#FFFFFF' : 'var(--color-primario)',
                            }}
                        >
                            <i className="fa-solid fa-stopwatch text-sm" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--texto-primario)' }}>
                                Cronómetro de Cocina en Vivo
                            </p>
                            <p className="text-[11px]" style={{ color: 'var(--texto-secundario)' }}>
                                {timerTotalSegundos > 0
                                    ? `${timerEtiqueta} · ${timerActivo ? 'En curso' : 'En pausa'}`
                                    : 'Pulsa cualquier tiempo en los pasos de abajo o inicia un temporizador rápido'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {timerTotalSegundos > 0 ? (
                            <>
                                <span
                                    className="px-3.5 py-1.5 rounded-xl font-mono-num text-lg font-extrabold border"
                                    style={{
                                        background: 'var(--bg-card)',
                                        borderColor: 'var(--borde-fuerte)',
                                        color: timerActivo ? 'var(--color-primario)' : 'var(--texto-primario)',
                                    }}
                                >
                                    {formatearMMSS(timerRestante)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setTimerActivo((a) => !a)}
                                    className="btn-primario py-1.5 px-3 text-xs"
                                >
                                    <i className={`fa-solid ${timerActivo ? 'fa-pause' : 'fa-play'} text-xs`} aria-hidden="true" />
                                    <span>{timerActivo ? 'Pausar' : 'Reanudar'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTimerTotalSegundos((t) => t + 60);
                                        setTimerRestante((r) => r + 60);
                                    }}
                                    className="btn-secundario py-1.5 px-2.5 text-xs font-mono-num"
                                >
                                    +1m
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTimerActivo(false);
                                        setTimerTotalSegundos(0);
                                        setTimerRestante(0);
                                        setTimerEtiqueta('');
                                    }}
                                    className="btn-secundario py-1.5 px-2.5 text-xs"
                                    aria-label="Reiniciar cronómetro"
                                >
                                    <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                {[
                                    { label: '1 min', seg: 60 },
                                    { label: '3 min', seg: 180 },
                                    { label: '5 min', seg: 300 },
                                    { label: '10 min', seg: 600 },
                                    { label: '15 min', seg: 900 },
                                ].map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => iniciarCronometro(preset.seg, `Temporizador ${preset.label}`)}
                                        className="px-2.5 py-1 rounded-lg border text-xs font-mono-num font-semibold cursor-pointer transition-colors"
                                        style={{
                                            background: 'var(--bg-card)',
                                            borderColor: 'var(--borde-sutil)',
                                            color: 'var(--texto-primario)',
                                        }}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {timerTotalSegundos > 0 && (
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-card)' }}>
                        <div
                            className="h-full transition-all duration-300"
                            style={{ width: `${progresoTimerPct}%`, background: 'var(--color-primario)' }}
                        />
                    </div>
                )}
            </div>

            {/* Tabla de Ingredientes (Mise en Place) */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--texto-primario)' }}>
                        <i className="fa-solid fa-utensils text-xs" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                        <span>Mise en Place ({receta.ingredientes?.length || 0} insumos)</span>
                    </h4>
                    <span className="text-[11px] no-print" style={{ color: 'var(--texto-muted)' }}>
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

            {/* Pasos de Preparación con Detector Inteligente de Tiempos */}
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
                    <div className="w-full h-2 rounded-full overflow-hidden mb-4 no-print" style={{ background: 'var(--bg-secundario)' }}>
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
                            const tiempoDetectado = detectarTiempoEnPaso(paso);

                            return (
                                <li
                                    key={idx}
                                    onClick={() => alternarPaso(idx)}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-all"
                                    style={{
                                        borderColor: completado ? 'rgba(16, 185, 129, 0.35)' : 'var(--borde-sutil)',
                                        background: completado ? 'var(--color-exito-bg)' : 'var(--bg-card)',
                                    }}
                                >
                                    <div className="flex gap-3 items-start flex-1">
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
                                    </div>

                                    {tiempoDetectado && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                iniciarCronometro(
                                                    tiempoDetectado.segundosTotales,
                                                    `Paso ${idx + 1} (${tiempoDetectado.etiqueta})`
                                                );
                                            }}
                                            className="self-end sm:self-center shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono-num font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 no-print"
                                            style={{
                                                background: 'var(--color-primario-suave)',
                                                color: 'var(--color-primario)',
                                                borderColor: 'rgba(234, 88, 12, 0.3)',
                                            }}
                                            title={`Iniciar cronómetro de ${tiempoDetectado.etiqueta} para el Paso ${idx + 1}`}
                                        >
                                            <i className="fa-solid fa-stopwatch text-xs" aria-hidden="true" />
                                            <span>Iniciar {tiempoDetectado.etiqueta}</span>
                                        </button>
                                    )}
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
