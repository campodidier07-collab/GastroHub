import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    LayoutGrid,
    Table2,
    Plus,
    BookOpen,
    Star,
    Layers,
    Flame,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
} from 'lucide-react';
import { useRecetas } from '../../context/RecetaContext';
import FiltrosRecetas from '../../components/recetas/FiltrosRecetas';
import TablaRecetas from '../../components/recetas/TablaRecetas';
import FormularioReceta from '../../components/recetas/FormularioReceta';
import DetalleReceta from '../../components/recetas/DetalleReceta';
import Modal from '../../components/ui/Modal';
import ConfirmacionModal from '../../components/ui/ConfirmacionModal';
import Spinner from '../../components/ui/Spinner';

const FILTROS_INICIALES = {
    busqueda: '',
    categoria: '',
    dificultad: '',
    tiempoFiltro: '',
    minIngredientes: '',
    soloFavoritas: false,
    ordenar: 'reciente',
};

const REGISTROS_POR_PAGINA = 6;

/**
 * Vista empresarial del Catálogo Gastronómico de GastroHub.
 * Con sincronización de query params, KPIs, selector de vista y tabla ordenable.
 */
const CatalogoView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        listaRecetas,
        cargando,
        errorGlobal,
        cargarRecetas,
        agregarReceta,
        modificarReceta,
        toggleFavorito,
        borrarReceta,
    } = useRecetas();

    const [filtros, setFiltros] = useState(() => ({
        ...FILTROS_INICIALES,
        busqueda: searchParams.get('q') || '',
        categoria: searchParams.get('categoria') || '',
        dificultad: searchParams.get('dificultad') || '',
        soloFavoritas: searchParams.get('favoritas') === 'true',
    }));
    const [modoVista, setModoVista] = useState('grid');
    const [paginaActual, setPaginaActual] = useState(1);

    const [modalCrear, setModalCrear] = useState(false);
    const [modalEditar, setModalEditar] = useState({ abierto: false, receta: null });
    const [modalDetalle, setModalDetalle] = useState({ abierto: false, receta: null });
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, receta: null });

    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [errorFormulario, setErrorFormulario] = useState(null);

    useEffect(() => {
        cargarRecetas();
    }, [cargarRecetas]);

    // Sincronizar cambios desde la Sidebar o buscador global (URL query params)
    useEffect(() => {
        const catUrl = searchParams.get('categoria') || '';
        const difUrl = searchParams.get('dificultad') || '';
        const favUrl = searchParams.get('favoritas') === 'true';
        const qUrl = searchParams.get('q') || '';

        setFiltros((prev) => ({
            ...prev,
            categoria: catUrl,
            dificultad: difUrl,
            soloFavoritas: favUrl,
            ...(qUrl ? { busqueda: qUrl } : {}),
        }));
    }, [searchParams]);

    useEffect(() => {
        setPaginaActual(1);
    }, [filtros]);

    const actualizarFiltros = (nuevosFiltros) => {
        setFiltros((prev) => {
            const Combinado = { ...prev, ...nuevosFiltros };
            const params = {};
            if (Combinado.categoria) params.categoria = Combinado.categoria;
            if (Combinado.dificultad) params.dificultad = Combinado.dificultad;
            if (Combinado.soloFavoritas) params.favoritas = 'true';
            setSearchParams(params, { replace: true });
            return Combinado;
        });
    };

    const limpiarFiltros = () => {
        setFiltros(FILTROS_INICIALES);
        setSearchParams({}, { replace: true });
    };

    const kpis = useMemo(() => {
        const total = listaRecetas.length;
        const favoritas = listaRecetas.filter((r) => r.favorito).length;
        const categoriasUnicas = new Set(listaRecetas.map((r) => r.categoria || 'Plato Fuerte')).size;
        const conCalorias = listaRecetas.filter((r) => typeof r.calorias === 'number' && r.calorias > 0);
        const promedioCalorias = conCalorias.length > 0
            ? Math.round(conCalorias.reduce((acc, r) => acc + r.calorias, 0) / conCalorias.length)
            : 0;

        return { total, favoritas, categoriasUnicas, promedioCalorias };
    }, [listaRecetas]);

    const recetasFiltradas = useMemo(() => {
        let resultado = [...listaRecetas];

        if (filtros.busqueda.trim()) {
            const terminoLower = filtros.busqueda.toLowerCase();
            resultado = resultado.filter((r) => {
                const coincideTitulo = r.titulo?.toLowerCase().includes(terminoLower);
                const coincideDesc = r.descripcion?.toLowerCase().includes(terminoLower);
                const coincideIngrediente = r.ingredientes?.some((ing) =>
                    ing.nombre?.toLowerCase().includes(terminoLower)
                );
                return coincideTitulo || coincideDesc || coincideIngrediente;
            });
        }

        if (filtros.categoria) {
            resultado = resultado.filter((r) => (r.categoria || 'Plato Fuerte') === filtros.categoria);
        }

        if (filtros.dificultad) {
            resultado = resultado.filter((r) => (r.dificultad || 'Media') === filtros.dificultad);
        }

        if (filtros.soloFavoritas) {
            resultado = resultado.filter((r) => Boolean(r.favorito));
        }

        if (filtros.tiempoFiltro.trim()) {
            const tiempoLower = filtros.tiempoFiltro.toLowerCase();
            resultado = resultado.filter((r) =>
                r.tiempo?.toLowerCase().includes(tiempoLower)
            );
        }

        if (filtros.minIngredientes !== '') {
            const minimo = parseInt(filtros.minIngredientes, 10);
            if (!isNaN(minimo)) {
                resultado = resultado.filter((r) => (r.ingredientes?.length || 0) >= minimo);
            }
        }

        switch (filtros.ordenar) {
            case 'reciente':
                resultado.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'antiguo':
                resultado.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'titulo_az':
                resultado.sort((a, b) => a.titulo?.localeCompare(b.titulo));
                break;
            case 'titulo_za':
                resultado.sort((a, b) => b.titulo?.localeCompare(a.titulo));
                break;
            case 'mas_ingredientes':
                resultado.sort((a, b) => (b.ingredientes?.length || 0) - (a.ingredientes?.length || 0));
                break;
            case 'menos_ingredientes':
                resultado.sort((a, b) => (a.ingredientes?.length || 0) - (b.ingredientes?.length || 0));
                break;
            case 'menos_calorias':
                resultado.sort((a, b) => (a.calorias ?? 9999) - (b.calorias ?? 9999));
                break;
            default:
                break;
        }

        return resultado;
    }, [listaRecetas, filtros]);

    const totalPaginas = Math.ceil(recetasFiltradas.length / REGISTROS_POR_PAGINA);
    const recetasPagina = recetasFiltradas.slice(
        (paginaActual - 1) * REGISTROS_POR_PAGINA,
        paginaActual * REGISTROS_POR_PAGINA
    );

    const manejarCrear = async (datos) => {
        setGuardando(true);
        setErrorFormulario(null);
        try {
            await agregarReceta(datos);
            setModalCrear(false);
            toast.success('Ficha técnica publicada en el catálogo');
        } catch (err) {
            setErrorFormulario(err?.response?.data?.error || 'Error al crear la receta');
        } finally {
            setGuardando(false);
        }
    };

    const manejarEditar = async (datos) => {
        if (!modalEditar.receta) return;
        setGuardando(true);
        setErrorFormulario(null);
        try {
            const res = await modificarReceta(modalEditar.receta._id, datos);
            setModalEditar({ abierto: false, receta: null });
            if (modalDetalle.receta?._id === res.receta?._id) {
                setModalDetalle((prev) => ({ ...prev, receta: res.receta }));
            }
            toast.success('Ficha técnica actualizada correctamente');
        } catch (err) {
            setErrorFormulario(err?.response?.data?.error || 'Error al actualizar la receta');
        } finally {
            setGuardando(false);
        }
    };

    const manejarToggleFavorito = async (receta) => {
        try {
            const actualizada = await toggleFavorito(receta._id);
            if (modalDetalle.receta?._id === actualizada._id) {
                setModalDetalle((prev) => ({ ...prev, receta: actualizada }));
            }
            toast.success(
                actualizada.favorito
                    ? `"${actualizada.titulo}" añadida a Favoritas`
                    : `"${actualizada.titulo}" removida de Favoritas`
            );
        } catch {
            toast.error('No se pudo actualizar el estado de favorito');
        }
    };

    const manejarEliminar = async () => {
        if (!modalEliminar.receta) return;
        setEliminando(true);
        try {
            await borrarReceta(modalEliminar.receta._id);
            setModalEliminar({ abierto: false, receta: null });
            toast.success('Ficha técnica eliminada del catálogo');
            if (recetasPagina.length === 1 && paginaActual > 1) {
                setPaginaActual((prev) => prev - 1);
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || 'No se pudo eliminar la receta');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Encabezado y Controles */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--texto-primario)' }}>
                        Catálogo de Fichas Técnicas
                    </h1>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
                        Mostrando <span className="font-mono-num font-bold">{recetasFiltradas.length}</span> de{' '}
                        <span className="font-mono-num font-bold">{listaRecetas.length}</span> recetas estandarizadas
                    </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {/* Selector segmentado Tarjetas / Tabla */}
                    <div
                        className="inline-flex rounded-xl p-1 border"
                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                        role="group"
                        aria-label="Cambiar modo de visualización"
                    >
                        <button
                            type="button"
                            onClick={() => setModoVista('grid')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            style={{
                                background: modoVista === 'grid' ? 'var(--bg-card)' : 'transparent',
                                color: modoVista === 'grid' ? 'var(--texto-primario)' : 'var(--texto-muted)',
                                boxShadow: modoVista === 'grid' ? 'var(--sombra-sm)' : 'none',
                            }}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Tarjetas</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setModoVista('tabla')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                            style={{
                                background: modoVista === 'tabla' ? 'var(--bg-card)' : 'transparent',
                                color: modoVista === 'tabla' ? 'var(--texto-primario)' : 'var(--texto-muted)',
                                boxShadow: modoVista === 'tabla' ? 'var(--sombra-sm)' : 'none',
                            }}
                        >
                            <Table2 className="w-3.5 h-3.5" />
                            <span>Tabla</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        className="btn-primario"
                        onClick={() => {
                            setErrorFormulario(null);
                            setModalCrear(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nueva Ficha</span>
                    </button>
                </div>
            </div>

            {/* Resumen KPI Compacto */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="tarjeta p-4 flex items-center gap-3.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                    >
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--texto-muted)' }}>Total Fichas</p>
                        <p className="text-xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>{kpis.total}</p>
                    </div>
                </div>

                <div className="tarjeta p-4 flex items-center gap-3.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-advertencia-bg)', color: 'var(--color-advertencia)' }}
                    >
                        <Star className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--texto-muted)' }}>Favoritas del Chef</p>
                        <p className="text-xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>{kpis.favoritas}</p>
                    </div>
                </div>

                <div className="tarjeta p-4 flex items-center gap-3.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-exito-bg)', color: 'var(--color-exito)' }}
                    >
                        <Layers className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--texto-muted)' }}>Partidas Activas</p>
                        <p className="text-xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>{kpis.categoriasUnicas}</p>
                    </div>
                </div>

                <div className="tarjeta p-4 flex items-center gap-3.5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}
                    >
                        <Flame className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--texto-muted)' }}>Media Energética</p>
                        <p className="text-xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                            {kpis.promedioCalorias ? `${kpis.promedioCalorias} kcal` : '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <FiltrosRecetas
                filtros={filtros}
                alCambiarFiltros={actualizarFiltros}
                alLimpiar={limpiarFiltros}
            />

            {/* Estado de carga / Error / Tabla */}
            {cargando ? (
                <Spinner mensaje="Sincronizando catálogo gastronómico..." />
            ) : errorGlobal ? (
                <div
                    role="alert"
                    className="tarjeta p-8 text-center flex flex-col items-center gap-3"
                    style={{ background: 'var(--color-error-bg)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                    <AlertCircle className="w-8 h-8" style={{ color: 'var(--color-error)' }} />
                    <p className="font-bold text-sm" style={{ color: 'var(--color-error-texto)' }}>{errorGlobal}</p>
                    <button type="button" className="btn-primario mt-1" onClick={cargarRecetas}>
                        Reintentar sincronización
                    </button>
                </div>
            ) : (
                <>
                    <TablaRecetas
                        recetas={recetasPagina}
                        modoVista={modoVista}
                        ordenActual={filtros.ordenar}
                        alCambiarOrden={(nuevoOrden) => actualizarFiltros({ ordenar: nuevoOrden })}
                        alVerDetalle={(receta) => setModalDetalle({ abierto: true, receta })}
                        alEditar={(receta) => {
                            setErrorFormulario(null);
                            setModalEditar({ abierto: true, receta });
                        }}
                        alEliminar={(receta) => setModalEliminar({ abierto: true, receta })}
                        alToggleFavorito={manejarToggleFavorito}
                    />

                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-xs font-mono-num" style={{ color: 'var(--texto-secundario)' }}>
                                Página {paginaActual} de {totalPaginas}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="px-3 py-1.5 text-xs rounded-xl border font-semibold inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                                    style={{
                                        borderColor: 'var(--borde-sutil)',
                                        color: 'var(--texto-secundario)',
                                        background: 'var(--bg-card)',
                                    }}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Anterior</span>
                                </button>

                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setPaginaActual(num)}
                                        className="w-8 h-8 text-xs font-mono-num rounded-xl border font-bold transition-colors cursor-pointer"
                                        style={{
                                            borderColor: num === paginaActual ? 'var(--color-primario)' : 'var(--borde-sutil)',
                                            background: num === paginaActual ? 'var(--color-primario)' : 'var(--bg-card)',
                                            color: num === paginaActual ? '#FFFFFF' : 'var(--texto-secundario)',
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                    className="px-3 py-1.5 text-xs rounded-xl border font-semibold inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                                    style={{
                                        borderColor: 'var(--borde-sutil)',
                                        color: 'var(--texto-secundario)',
                                        background: 'var(--bg-card)',
                                    }}
                                >
                                    <span>Siguiente</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal — Crear */}
            <Modal
                abierto={modalCrear}
                alCerrar={() => setModalCrear(false)}
                titulo="Registrar Nueva Ficha Técnica"
                subtitulo="Documenta insumos, porciones, tiempos y protocolo paso a paso"
                tamano="lg"
            >
                <FormularioReceta
                    alGuardar={manejarCrear}
                    alCancelar={() => setModalCrear(false)}
                    cargando={guardando}
                    errorExterno={errorFormulario}
                />
            </Modal>

            {/* Modal — Editar */}
            <Modal
                abierto={modalEditar.abierto}
                alCerrar={() => setModalEditar({ abierto: false, receta: null })}
                titulo="Editar Ficha Técnica"
                subtitulo="Actualiza parámetros o ingredientes de la receta seleccionada"
                tamano="lg"
            >
                <FormularioReceta
                    recetaInicial={modalEditar.receta}
                    alGuardar={manejarEditar}
                    alCancelar={() => setModalEditar({ abierto: false, receta: null })}
                    cargando={guardando}
                    errorExterno={errorFormulario}
                />
            </Modal>

            {/* Modal — Ver detalle */}
            <Modal
                abierto={modalDetalle.abierto}
                alCerrar={() => setModalDetalle({ abierto: false, receta: null })}
                titulo="Ficha Técnica & Modo Cocina"
                subtitulo="Escala el rendimiento por porciones o marca cada etapa completada"
                tamano="lg"
            >
                <DetalleReceta
                    receta={modalDetalle.receta}
                    alToggleFavorito={manejarToggleFavorito}
                    alEditar={(receta) => {
                        setModalDetalle({ abierto: false, receta: null });
                        setErrorFormulario(null);
                        setModalEditar({ abierto: true, receta });
                    }}
                />
            </Modal>

            {/* Modal — Confirmación de eliminación */}
            <ConfirmacionModal
                abierto={modalEliminar.abierto}
                alCerrar={() => setModalEliminar({ abierto: false, receta: null })}
                alConfirmar={manejarEliminar}
                titulo="Eliminar ficha técnica"
                mensaje={`¿Confirmas la eliminación permanente de "${modalEliminar.receta?.titulo}" del catálogo de GastroHub?`}
                cargando={eliminando}
            />
        </div>
    );
};

export default CatalogoView;
