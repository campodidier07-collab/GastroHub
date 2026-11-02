import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRecetas } from '../../context/RecetaContext';
import Modal from '../../components/ui/Modal';
import DetalleReceta from '../../components/recetas/DetalleReceta';
import FormularioReceta from '../../components/recetas/FormularioReceta';
import PlanificadorProduccionModal from '../../components/recetas/PlanificadorProduccionModal';
import Spinner from '../../components/ui/Spinner';

/**
 * Dashboard Ejecutivo SaaS de GastroHub con iconografía Font Awesome.
 */
const DashboardView = () => {
    const navegar = useNavigate();
    const {
        listaRecetas,
        cargando,
        cargarRecetas,
        agregarReceta,
        toggleFavorito,
        clonarReceta,
    } = useRecetas();

    const [recetaDetalle, setRecetaDetalle] = useState(null);
    const [modalCrear, setModalCrear] = useState(false);
    const [modalPlanificador, setModalPlanificador] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [errorFormulario, setErrorFormulario] = useState(null);

    useEffect(() => {
        if (listaRecetas.length === 0) {
            cargarRecetas();
        }
    }, [listaRecetas.length, cargarRecetas]);

    const analitica = useMemo(() => {
        const total = listaRecetas.length;
        const favoritas = listaRecetas.filter((r) => r.favorito).length;
        const porcentajeFavoritas = total > 0 ? Math.round((favoritas / total) * 100) : 0;

        const conCalorias = listaRecetas.filter((r) => typeof r.calorias === 'number' && r.calorias > 0);
        const promedioCalorias = conCalorias.length > 0
            ? Math.round(conCalorias.reduce((acc, r) => acc + r.calorias, 0) / conCalorias.length)
            : 0;

        const conCosto = listaRecetas.filter((r) => typeof r.costoPorPorcion === 'number' && r.costoPorPorcion > 0);
        const costoPromedio = conCosto.length > 0
            ? Number((conCosto.reduce((acc, r) => acc + r.costoPorPorcion, 0) / conCosto.length).toFixed(2))
            : 0;
        const precioCartaSugerido = costoPromedio > 0 ? Number((costoPromedio / 0.3).toFixed(2)) : 0;

        const totalIngredientes = listaRecetas.reduce(
            (acc, r) => acc + (r.ingredientes?.length || 0),
            0
        );
        const promedioIngredientes = total > 0 ? (totalIngredientes / total).toFixed(1) : '0';

        const mapaCategorias = {};
        listaRecetas.forEach((r) => {
            const cat = r.categoria || 'Plato Fuerte';
            mapaCategorias[cat] = (mapaCategorias[cat] || 0) + 1;
        });

        const distribucionCategorias = Object.entries(mapaCategorias)
            .map(([nombre, cantidad]) => ({
                nombre,
                cantidad,
                porcentaje: total > 0 ? Math.round((cantidad / total) * 100) : 0,
            }))
            .sort((a, b) => b.cantidad - a.cantidad);

        const conteoDificultad = { 'Fácil': 0, 'Media': 0, 'Alta': 0 };
        listaRecetas.forEach((r) => {
            const dif = r.dificultad || 'Media';
            if (conteoDificultad[dif] !== undefined) {
                conteoDificultad[dif] += 1;
            }
        });

        const recientes = [...listaRecetas]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        return {
            total,
            favoritas,
            porcentajeFavoritas,
            promedioCalorias,
            costoPromedio,
            precioCartaSugerido,
            totalIngredientes,
            promedioIngredientes,
            distribucionCategorias,
            conteoDificultad,
            recientes,
        };
    }, [listaRecetas]);

    const exportarCatalogoJson = () => {
        const blob = new Blob([JSON.stringify(listaRecetas, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gastrohub-catalogo-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Catálogo exportado en formato JSON');
    };

    const manejarCrearReceta = async (datos) => {
        setGuardando(true);
        setErrorFormulario(null);
        try {
            await agregarReceta(datos);
            setModalCrear(false);
            toast.success('Ficha técnica creada desde el Dashboard');
        } catch (err) {
            setErrorFormulario(err?.response?.data?.error || 'Error al registrar la receta');
        } finally {
            setGuardando(false);
        }
    };

    const manejarToggleFavorito = async (receta) => {
        try {
            const actualizada = await toggleFavorito(receta._id);
            if (recetaDetalle?._id === actualizada._id) {
                setRecetaDetalle(actualizada);
            }
            toast.success(actualizada.favorito ? 'Añadida a Favoritas' : 'Eliminada de Favoritas');
        } catch {
            toast.error('No se pudo actualizar el favorito');
        }
    };

    const manejarClonar = async (receta) => {
        try {
            const clonada = await clonarReceta(receta._id);
            toast.success(`Ficha duplicada: "${clonada.titulo}"`);
        } catch {
            toast.error('No se pudo duplicar la ficha técnica');
        }
    };

    if (cargando && listaRecetas.length === 0) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <Spinner mensaje="Cargando telemetría del Dashboard Ejecutivo..." />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6">
            {/* Cabecera Ejecutiva */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
                            style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles text-[10px]" aria-hidden="true" />
                            <span>Centro de Control Gastronómico</span>
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--texto-primario)' }}>
                        Dashboard Ejecutivo
                    </h1>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
                        Métricas operativas del recetario, distribución de partidas y actividad reciente en tiempo real.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => setModalPlanificador(true)}
                        className="btn-secundario"
                    >
                        <i className="fa-solid fa-cart-flatbed text-xs" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                        <span>Planificador Mise en Place</span>
                    </button>
                    <button
                        type="button"
                        onClick={exportarCatalogoJson}
                        className="btn-secundario"
                    >
                        <i className="fa-solid fa-download text-xs" aria-hidden="true" />
                        <span>Exportar JSON</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setErrorFormulario(null);
                            setModalCrear(true);
                        }}
                        className="btn-primario"
                    >
                        <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                        <span>Nueva Ficha Técnica</span>
                    </button>
                </div>
            </div>

            {/* 4 Tarjetas KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="tarjeta p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: 'var(--texto-secundario)' }}>
                            Fichas Técnicas Activas
                        </span>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                        >
                            <i className="fa-solid fa-book-open text-sm" aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                            {analitica.total}
                        </p>
                        <p className="text-[11px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--color-exito-texto)' }}>
                            <i className="fa-solid fa-circle-check text-xs" aria-hidden="true" />
                            <span>{analitica.distribucionCategorias.length} partidas gastronómicas</span>
                        </p>
                    </div>
                </div>

                <div className="tarjeta p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: 'var(--texto-secundario)' }}>
                            Costo Medio / Escandallo
                        </span>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--color-exito-bg)', color: 'var(--color-exito)' }}
                        >
                            <i className="fa-solid fa-coins text-sm" aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                                ${analitica.costoPromedio.toFixed(2)}
                            </p>
                            <span className="text-xs font-semibold" style={{ color: 'var(--texto-muted)' }}>
                                / porción
                            </span>
                        </div>
                        <p className="text-[11px] mt-1 font-mono-num" style={{ color: 'var(--color-exito-texto)' }}>
                            Precio carta sugerido: ${analitica.precioCartaSugerido.toFixed(2)} (30% FC)
                        </p>
                    </div>
                </div>

                <div className="tarjeta p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: 'var(--texto-secundario)' }}>
                            Selección del Chef (Favoritas)
                        </span>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--color-advertencia-bg)', color: 'var(--color-advertencia)' }}
                        >
                            <i className="fa-solid fa-star text-sm" aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                                {analitica.favoritas}
                            </p>
                            <span className="text-xs font-mono-num font-semibold" style={{ color: 'var(--color-advertencia-texto)' }}>
                                ({analitica.porcentajeFavoritas}%)
                            </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: 'var(--bg-secundario)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${analitica.porcentajeFavoritas}%`, background: 'var(--color-advertencia)' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="tarjeta p-5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold" style={{ color: 'var(--texto-secundario)' }}>
                            Insumos en Mise en Place
                        </span>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}
                        >
                            <i className="fa-solid fa-layer-group text-sm" aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <p className="text-3xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                            {analitica.totalIngredientes}
                        </p>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--texto-muted)' }}>
                            Promedio de {analitica.promedioIngredientes} insumos por receta
                        </p>
                    </div>
                </div>
            </div>

            {/* Gráficas Analíticas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="tarjeta p-6 lg:col-span-2 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <i className="fa-solid fa-chart-column text-sm" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                            <div>
                                <h2 className="text-sm font-bold" style={{ color: 'var(--texto-primario)' }}>
                                    Distribución por Partida Gastronómica
                                </h2>
                                <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>
                                    Haz clic en cualquier barra para filtrar el catálogo por esa categoría
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/catalogo"
                            className="text-xs font-semibold flex items-center gap-1.5"
                            style={{ color: 'var(--color-primario)', textDecoration: 'none' }}
                        >
                            <span>Ver catálogo</span>
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="flex flex-col gap-3.5 my-2">
                        {analitica.distribucionCategorias.map((cat) => (
                            <button
                                key={cat.nombre}
                                type="button"
                                onClick={() => navegar(`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`)}
                                className="w-full text-left group cursor-pointer"
                            >
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-semibold group-hover:underline" style={{ color: 'var(--texto-primario)' }}>
                                        {cat.nombre}
                                    </span>
                                    <span className="font-mono-num" style={{ color: 'var(--texto-secundario)' }}>
                                        {cat.cantidad} {cat.cantidad === 1 ? 'ficha' : 'fichas'} ({cat.porcentaje}%)
                                    </span>
                                </div>
                                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secundario)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${Math.max(cat.porcentaje, 6)}%`,
                                            background: 'var(--gradiente-primario)',
                                        }}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Matriz de Dificultad */}
                <div className="tarjeta p-6 flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <i className="fa-solid fa-chart-pie text-sm" style={{ color: 'var(--color-secundario)' }} aria-hidden="true" />
                        <div>
                            <h2 className="text-sm font-bold" style={{ color: 'var(--texto-primario)' }}>
                                Nivel de Complejidad Técnica
                            </h2>
                            <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>
                                Proporción por curva de dificultad
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 my-auto">
                        {[
                            { nivel: 'Fácil', color: 'var(--color-exito)', desc: 'Ejecución rápida (< 30 min)' },
                            { nivel: 'Media', color: 'var(--color-advertencia)', desc: 'Técnica intermedia controlada' },
                            { nivel: 'Alta', color: 'var(--color-error)', desc: 'Alta cocina / cocción precisa' },
                        ].map((item) => {
                            const cant = analitica.conteoDificultad[item.nivel] || 0;
                            const pct = analitica.total > 0 ? Math.round((cant / analitica.total) * 100) : 0;

                            return (
                                <button
                                    key={item.nivel}
                                    type="button"
                                    onClick={() => navegar(`/catalogo?dificultad=${encodeURIComponent(item.nivel)}`)}
                                    className="p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer"
                                    style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="w-3 h-8 rounded-full shrink-0"
                                            style={{ background: item.color }}
                                        />
                                        <div>
                                            <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                                Dificultad {item.nivel}
                                            </p>
                                            <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right font-mono-num">
                                        <p className="text-sm font-extrabold" style={{ color: 'var(--texto-primario)' }}>
                                            {cant}
                                        </p>
                                        <p className="text-[10px]" style={{ color: 'var(--texto-muted)' }}>
                                            {pct}%
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Fichas Recientes + Acciones Rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="tarjeta p-6 lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold" style={{ color: 'var(--texto-primario)' }}>
                                Fichas Técnicas Recientes
                            </h2>
                            <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>
                                Abre cualquier plato para iniciar el Modo Cocina o escalar porciones
                            </p>
                        </div>
                        <Link
                            to="/catalogo"
                            className="btn-secundario py-1.5 px-3 text-xs"
                            style={{ textDecoration: 'none' }}
                        >
                            Gestionar todas
                        </Link>
                    </div>

                    <div className="divide-y" style={{ borderColor: 'var(--borde-sutil)' }}>
                        {analitica.recientes.map((receta) => (
                            <div
                                key={receta._id}
                                className="py-3 flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div
                                        className="w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border"
                                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                                    >
                                        {receta.imagenUrl ? (
                                            <img
                                                src={receta.imagenUrl}
                                                alt={receta.titulo}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <i className="fa-solid fa-utensils text-sm" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs sm:text-sm font-bold truncate" style={{ color: 'var(--texto-primario)' }}>
                                            {receta.titulo}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                                            <span className="font-semibold" style={{ color: 'var(--color-primario)' }}>
                                                {receta.categoria || 'Plato Fuerte'}
                                            </span>
                                            <span>•</span>
                                            <span className="inline-flex items-center gap-1">
                                                <i className="fa-regular fa-clock text-[10px]" aria-hidden="true" /> {receta.tiempo}
                                            </span>
                                            <span>•</span>
                                            <span className="inline-flex items-center gap-1">
                                                <i className="fa-solid fa-user-group text-[10px]" aria-hidden="true" /> {receta.porciones || 4} porc.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => manejarToggleFavorito(receta)}
                                        className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer"
                                        style={{
                                            background: 'var(--bg-secundario)',
                                            borderColor: 'var(--borde-sutil)',
                                        }}
                                        aria-label="Alternar favorito"
                                    >
                                        <i
                                            className={`${receta.favorito ? 'fa-solid text-amber-400' : 'fa-regular'} fa-star text-xs`}
                                            style={{ color: receta.favorito ? '#F59E0B' : 'var(--texto-muted)' }}
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRecetaDetalle(receta)}
                                        className="btn-ver"
                                    >
                                        <i className="fa-regular fa-eye text-xs" aria-hidden="true" />
                                        <span>Ficha</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="tarjeta p-6 flex flex-col justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold" style={{ color: 'var(--texto-primario)' }}>
                            Acciones Rápidas
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                            Atajos operativos frecuentes para gestión de cocina
                        </p>
                    </div>

                    <div className="flex flex-col gap-2.5 my-auto">
                        <button
                            type="button"
                            onClick={() => setModalCrear(true)}
                            className="p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer"
                            style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                                >
                                    <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                        Registrar Nueva Receta
                                    </p>
                                    <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                        Crear ficha con ingredientes y pasos
                                    </p>
                                </div>
                            </div>
                            <i className="fa-solid fa-arrow-up-right-from-square text-xs" style={{ color: 'var(--texto-muted)' }} aria-hidden="true" />
                        </button>

                        <Link
                            to="/catalogo?favoritas=true"
                            className="p-3.5 rounded-xl border text-left flex items-center justify-between transition-all"
                            style={{
                                background: 'var(--bg-secundario)',
                                borderColor: 'var(--borde-sutil)',
                                textDecoration: 'none',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--color-advertencia-bg)', color: 'var(--color-advertencia)' }}
                                >
                                    <i className="fa-solid fa-star text-xs" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                        Colección de Favoritas
                                    </p>
                                    <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                        Filtrar platos insignia del chef
                                    </p>
                                </div>
                            </div>
                            <i className="fa-solid fa-arrow-up-right-from-square text-xs" style={{ color: 'var(--texto-muted)' }} aria-hidden="true" />
                        </Link>

                        <button
                            type="button"
                            onClick={exportarCatalogoJson}
                            className="p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer"
                            style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}
                                >
                                    <i className="fa-solid fa-download text-xs" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                        Respaldar Catálogo (JSON)
                                    </p>
                                    <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                        Descarga instantánea de todas las fichas
                                    </p>
                                </div>
                            </div>
                            <i className="fa-solid fa-arrow-up-right-from-square text-xs" style={{ color: 'var(--texto-muted)' }} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                abierto={Boolean(recetaDetalle)}
                alCerrar={() => setRecetaDetalle(null)}
                titulo="Ficha Técnica & Modo Cocina"
                subtitulo="Escala porciones, consulta escandallo o activa el cronómetro en vivo"
                tamano="lg"
            >
                <DetalleReceta
                    receta={recetaDetalle}
                    alToggleFavorito={manejarToggleFavorito}
                    alClonar={manejarClonar}
                />
            </Modal>

            <PlanificadorProduccionModal
                abierto={modalPlanificador}
                alCerrar={() => setModalPlanificador(false)}
                recetas={listaRecetas}
            />

            <Modal
                abierto={modalCrear}
                alCerrar={() => setModalCrear(false)}
                titulo="Registrar Nueva Ficha Técnica"
                subtitulo="Completa los parámetros gastronómicos, ingredientes y pasos de preparación"
                tamano="lg"
            >
                <FormularioReceta
                    alGuardar={manejarCrearReceta}
                    alCancelar={() => setModalCrear(false)}
                    cargando={guardando}
                    errorExterno={errorFormulario}
                />
            </Modal>
        </div>
    );
};

export default DashboardView;
