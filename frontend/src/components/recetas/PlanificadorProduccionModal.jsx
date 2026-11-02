import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';

/**
 * Planificador de Producción & Generador de Lista de Compras Consolidada (Mise en Place).
 * Permite seleccionar múltiples recetas y escalar porciones para eventos o servicios,
 * consolidando automáticamente cantidades de insumos y presupuesto financiero.
 */
const PlanificadorProduccionModal = ({ abierto, alCerrar, recetas = [] }) => {
    // Mapa { [recetaId]: porcionesAProducir }
    const [seleccion, setSeleccion] = useState(() => {
        const inicial = {};
        recetas.slice(0, 2).forEach((r) => {
            inicial[r._id] = r.porciones || 4;
        });
        return inicial;
    });

    const [insumosEnStock, setInsumosEnStock] = useState({});

    const alternarReceta = (receta) => {
        setSeleccion((prev) => {
            const copia = { ...prev };
            if (copia[receta._id]) {
                delete copia[receta._id];
            } else {
                copia[receta._id] = receta.porciones || 4;
            }
            return copia;
        });
    };

    const cambiarPorciones = (id, nuevasPorciones) => {
        const valor = Math.max(1, Math.min(200, Number(nuevasPorciones) || 1));
        setSeleccion((prev) => ({
            ...prev,
            [id]: valor,
        }));
    };

    const seleccionarTodas = () => {
        const todas = {};
        recetas.forEach((r) => {
            todas[r._id] = r.porciones || 4;
        });
        setSeleccion(todas);
    };

    const limpiarSeleccion = () => {
        setSeleccion({});
        setInsumosEnStock({});
    };

    // Consolidación de ingredientes y presupuesto
    const consolidado = useMemo(() => {
        const mapaInsumos = {};
        let totalPorciones = 0;
        let costoTotalInsumos = 0;

        recetas.forEach((receta) => {
            const porcionesObjetivo = seleccion[receta._id];
            if (!porcionesObjetivo) return;

            totalPorciones += porcionesObjetivo;
            const porcionesBase = receta.porciones || 4;
            const factor = porcionesObjetivo / porcionesBase;

            if (typeof receta.costoPorPorcion === 'number' && receta.costoPorPorcion > 0) {
                costoTotalInsumos += receta.costoPorPorcion * porcionesObjetivo;
            }

            (receta.ingredientes || []).forEach((ing) => {
                if (!ing.nombre?.trim()) return;
                const nombreNormalizado = ing.nombre.trim().toLowerCase();
                const unidadNormalizada = (ing.unidad || '').trim().toLowerCase();
                const clave = `${nombreNormalizado}__${unidadNormalizada}`;

                const cantidadEscalada =
                    typeof ing.cantidad === 'number' && !Number.isNaN(ing.cantidad)
                        ? ing.cantidad * factor
                        : 0;

                if (!mapaInsumos[clave]) {
                    mapaInsumos[clave] = {
                        clave,
                        nombre: ing.nombre.trim(),
                        unidad: ing.unidad || 'unid.',
                        cantidadTotal: 0,
                        recetasOrigen: [],
                    };
                }

                mapaInsumos[clave].cantidadTotal += cantidadEscalada;
                if (!mapaInsumos[clave].recetasOrigen.includes(receta.titulo)) {
                    mapaInsumos[clave].recetasOrigen.push(receta.titulo);
                }
            });
        });

        const listaInsumos = Object.values(mapaInsumos)
            .map((item) => ({
                ...item,
                cantidadFormateada:
                    item.cantidadTotal > 0
                        ? Number.isInteger(item.cantidadTotal)
                            ? item.cantidadTotal
                            : Number(item.cantidadTotal.toFixed(1))
                        : 'Al gusto',
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

        const ingresoProyectado = costoTotalInsumos > 0 ? costoTotalInsumos / 0.3 : 0;
        const utilidadBruta = ingresoProyectado - costoTotalInsumos;

        return {
            recetasActivas: Object.keys(seleccion).length,
            totalPorciones,
            costoTotalInsumos: Number(costoTotalInsumos.toFixed(2)),
            ingresoProyectado: Number(ingresoProyectado.toFixed(2)),
            utilidadBruta: Number(utilidadBruta.toFixed(2)),
            listaInsumos,
        };
    }, [recetas, seleccion]);

    const copiarOrdenCompra = async () => {
        if (consolidado.listaInsumos.length === 0) {
            toast.error('Selecciona al menos una receta para generar la orden');
            return;
        }

        const lineasRecetas = recetas
            .filter((r) => seleccion[r._id])
            .map((r) => `• ${r.titulo}: ${seleccion[r._id]} porciones`)
            .join('\n');

        const lineasInsumos = consolidado.listaInsumos
            .map((ins) => {
                const estado = insumosEnStock[ins.clave] ? '[EN STOCK]' : '[COMPRAR]';
                return `${estado} ${ins.nombre}: ${ins.cantidadFormateada} ${ins.unidad}`;
            })
            .join('\n');

        const texto = [
            '=== ORDEN DE PRODUCCIÓN & MISE EN PLACE — GASTROHUB ===',
            `Fecha: ${new Date().toLocaleDateString('es-CO')}`,
            `Total producción: ${consolidado.totalPorciones} porciones (${consolidado.recetasActivas} fichas)`,
            `Presupuesto estimado de insumos: $${consolidado.costoTotalInsumos.toFixed(2)} USD`,
            '',
            '--- PLATOS PROGRAMADOS ---',
            lineasRecetas,
            '',
            '--- LISTA CONSOLIDADA DE INSUMOS ---',
            lineasInsumos,
        ].join('\n');

        try {
            await navigator.clipboard.writeText(texto);
            toast.success('Orden de compra copiada al portapapeles');
        } catch {
            toast.error('No se pudo copiar automáticamente');
        }
    };

    return (
        <Modal
            abierto={abierto}
            alCerrar={alCerrar}
            titulo="Planificador de Producción & Lista de Compras (Mise en Place)"
            subtitulo="Selecciona los platos del servicio y las porciones a producir para consolidar insumos y costos automáticamente"
            tamano="xl"
        >
            <div className="flex flex-col gap-6">
                {/* Tarjetas de Resumen Financiero y Operativo del Servicio */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div
                        className="p-4 rounded-xl border"
                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                    >
                        <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--texto-muted)' }}>
                            <span>Volumen de Servicio</span>
                            <i className="fa-solid fa-utensils" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                        </div>
                        <p className="text-2xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                            {consolidado.totalPorciones} <span className="text-xs font-normal">porc.</span>
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                            En {consolidado.recetasActivas} {consolidado.recetasActivas === 1 ? 'ficha activa' : 'fichas activas'}
                        </p>
                    </div>

                    <div
                        className="p-4 rounded-xl border"
                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                    >
                        <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--texto-muted)' }}>
                            <span>Costo Total Insumos</span>
                            <i className="fa-solid fa-coins text-amber-500" aria-hidden="true" />
                        </div>
                        <p className="text-2xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                            ${consolidado.costoTotalInsumos.toFixed(2)}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                            Presupuesto de compra directo
                        </p>
                    </div>

                    <div
                        className="p-4 rounded-xl border"
                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                    >
                        <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--texto-muted)' }}>
                            <span>Venta Sugerida (Carta)</span>
                            <i className="fa-solid fa-receipt" style={{ color: 'var(--color-info)' }} aria-hidden="true" />
                        </div>
                        <p className="text-2xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                            ${consolidado.ingresoProyectado.toFixed(2)}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                            Basado en Food Cost del 30%
                        </p>
                    </div>

                    <div
                        className="p-4 rounded-xl border"
                        style={{ background: 'var(--color-exito-bg)', borderColor: 'rgba(16, 185, 129, 0.28)' }}
                    >
                        <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--color-exito-texto)' }}>
                            <span className="font-semibold">Utilidad Bruta Servicio</span>
                            <i className="fa-solid fa-arrow-trend-up" aria-hidden="true" />
                        </div>
                        <p className="text-2xl font-extrabold font-mono-num" style={{ color: 'var(--color-exito-texto)' }}>
                            +${consolidado.utilidadBruta.toFixed(2)}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-exito-texto)' }}>
                            Margen operativo del 70%
                        </p>
                    </div>
                </div>

                {/* Dos columnas: Selector de Recetas y Lista Consolidada */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Columna Izquierda: Platos a producir */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--texto-primario)' }}>
                                <i className="fa-solid fa-clipboard-check" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                                <span>1. Platos a Producir</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={seleccionarTodas}
                                    className="text-[11px] font-semibold cursor-pointer hover:underline"
                                    style={{ color: 'var(--color-primario)' }}
                                >
                                    Todas
                                </button>
                                <span style={{ color: 'var(--texto-muted)' }}>·</span>
                                <button
                                    type="button"
                                    onClick={limpiarSeleccion}
                                    className="text-[11px] font-semibold cursor-pointer hover:underline"
                                    style={{ color: 'var(--texto-muted)' }}
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                            {recetas.map((receta) => {
                                const activa = Boolean(seleccion[receta._id]);
                                const porcionesActuales = seleccion[receta._id] || receta.porciones || 4;

                                return (
                                    <div
                                        key={receta._id}
                                        className="p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5"
                                        style={{
                                            background: activa ? 'var(--color-primario-suave)' : 'var(--bg-secundario)',
                                            borderColor: activa ? 'var(--color-primario)' : 'var(--borde-sutil)',
                                        }}
                                    >
                                        <label className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={activa}
                                                onChange={() => alternarReceta(receta)}
                                                className="cursor-pointer accent-orange-600"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold truncate" style={{ color: 'var(--texto-primario)' }}>
                                                    {receta.titulo}
                                                </p>
                                                <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                                    {receta.categoria} {receta.costoPorPorcion ? `· $${receta.costoPorPorcion.toFixed(2)}/porc.` : ''}
                                                </p>
                                            </div>
                                        </label>

                                        {activa && (
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => cambiarPorciones(receta._id, porcionesActuales - 2)}
                                                    className="w-6 h-6 rounded-md border flex items-center justify-center text-[10px] cursor-pointer"
                                                    style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)' }}
                                                    aria-label="Reducir porciones"
                                                >
                                                    <i className="fa-solid fa-minus" aria-hidden="true" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    value={porcionesActuales}
                                                    onChange={(e) => cambiarPorciones(receta._id, e.target.value)}
                                                    className="w-12 text-center py-0.5 text-xs font-mono-num font-bold rounded-md border"
                                                    style={{
                                                        background: 'var(--bg-card)',
                                                        borderColor: 'var(--borde-sutil)',
                                                        color: 'var(--texto-primario)',
                                                    }}
                                                    aria-label={`Porciones para ${receta.titulo}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => cambiarPorciones(receta._id, porcionesActuales + 2)}
                                                    className="w-6 h-6 rounded-md border flex items-center justify-center text-[10px] cursor-pointer"
                                                    style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)' }}
                                                    aria-label="Aumentar porciones"
                                                >
                                                    <i className="fa-solid fa-plus" aria-hidden="true" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Columna Derecha: Lista Consolidada de Insumos */}
                    <div className="lg:col-span-7 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--texto-primario)' }}>
                                <i className="fa-solid fa-cart-flatbed" style={{ color: 'var(--color-exito)' }} aria-hidden="true" />
                                <span>2. Insumos Consolidados ({consolidado.listaInsumos.length})</span>
                            </h3>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={copiarOrdenCompra}
                                    className="btn-secundario py-1 px-2.5 text-xs"
                                >
                                    <i className="fa-regular fa-copy text-xs" aria-hidden="true" />
                                    <span>Copiar Orden</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="btn-primario py-1 px-2.5 text-xs"
                                >
                                    <i className="fa-solid fa-print text-xs" aria-hidden="true" />
                                    <span>Imprimir</span>
                                </button>
                            </div>
                        </div>

                        {consolidado.listaInsumos.length > 0 ? (
                            <div
                                className="rounded-xl border overflow-hidden max-h-80 overflow-y-auto"
                                style={{ borderColor: 'var(--borde-sutil)' }}
                            >
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr style={{ background: 'var(--bg-secundario)' }}>
                                            <th className="w-9 px-2.5 py-2.5 text-center font-semibold" style={{ color: 'var(--texto-muted)' }}>Stock</th>
                                            <th className="text-left px-3 py-2.5 font-semibold" style={{ color: 'var(--texto-muted)' }}>Insumo Consolidado</th>
                                            <th className="text-left px-3 py-2.5 font-semibold" style={{ color: 'var(--texto-muted)' }}>Total Requerido</th>
                                            <th className="text-left px-3 py-2.5 font-semibold hidden sm:table-cell" style={{ color: 'var(--texto-muted)' }}>Usado en</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y" style={{ borderColor: 'var(--borde-sutil)' }}>
                                        {consolidado.listaInsumos.map((insumo) => {
                                            const enStock = Boolean(insumosEnStock[insumo.clave]);
                                            return (
                                                <tr
                                                    key={insumo.clave}
                                                    onClick={() =>
                                                        setInsumosEnStock((prev) => ({
                                                            ...prev,
                                                            [insumo.clave]: !prev[insumo.clave],
                                                        }))
                                                    }
                                                    className="cursor-pointer transition-colors"
                                                    style={{
                                                        background: enStock ? 'var(--color-exito-bg)' : 'var(--bg-card)',
                                                        textDecoration: enStock ? 'line-through' : 'none',
                                                        opacity: enStock ? 0.72 : 1,
                                                    }}
                                                >
                                                    <td className="px-2.5 py-2.5 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={enStock}
                                                            onChange={() => {}}
                                                            className="cursor-pointer accent-emerald-600"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2.5 font-semibold" style={{ color: 'var(--texto-primario)' }}>
                                                        {insumo.nombre}
                                                    </td>
                                                    <td className="px-3 py-2.5 font-mono-num font-bold" style={{ color: 'var(--color-primario)' }}>
                                                        {insumo.cantidadFormateada} {insumo.unidad}
                                                    </td>
                                                    <td className="px-3 py-2.5 hidden sm:table-cell truncate max-w-[180px]" style={{ color: 'var(--texto-muted)' }}>
                                                        {insumo.recetasOrigen.join(', ')}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div
                                className="p-8 rounded-xl border text-center flex flex-col items-center justify-center gap-2"
                                style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                            >
                                <i className="fa-solid fa-basket-shopping text-xl" style={{ color: 'var(--texto-muted)' }} aria-hidden="true" />
                                <p className="text-xs font-semibold" style={{ color: 'var(--texto-primario)' }}>
                                    Selecciona al menos un plato a la izquierda
                                </p>
                                <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                    El sistema sumará automáticamente todos los ingredientes y calculará el presupuesto del servicio.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PlanificadorProduccionModal;

