import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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
 * Vista principal del Catálogo Gastronómico de GastroHub.
 * Incluye panel de KPIs, selector de vista (Tarjetas / Tabla), filtros multicriterio y modales CRUD.
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
        categoria: searchParams.get('categoria') || '',
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

    useEffect(() => {
        const catUrl = searchParams.get('categoria') || '';
        if (catUrl) {
            setFiltros((prev) => ({ ...prev, categoria: catUrl }));
        }
    }, [searchParams]);

    useEffect(() => {
        setPaginaActual(1);
    }, [filtros]);

    const actualizarFiltros = (nuevosFiltros) => {
        setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
        if (nuevosFiltros.categoria !== undefined) {
            if (nuevosFiltros.categoria) {
                setSearchParams({ categoria: nuevosFiltros.categoria });
            } else {
                setSearchParams({});
            }
        }
    };

    const limpiarFiltros = () => {
        setFiltros(FILTROS_INICIALES);
        setSearchParams({});
    };

    // ── KPIs globales del catálogo ─────────────────────────────────────────
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

    // ── Filtrado y ordenamiento multicriterio ──────────────────────────────
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
            toast.success('¡Ficha técnica registrada en GastroHub!');
        } catch (err) {
            const mensajeError = err?.response?.data?.error || 'Error al crear la receta';
            setErrorFormulario(mensajeError);
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
            const mensajeError = err?.response?.data?.error || 'Error al actualizar la receta';
            setErrorFormulario(mensajeError);
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
                    ? `★ "${actualizada.titulo}" añadida a Favoritos`
                    : `Se quitó "${actualizada.titulo}" de Favoritos`
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
            toast.success('Receta eliminada del catálogo');
            if (recetasPagina.length === 1 && paginaActual > 1) {
                setPaginaActual((prev) => prev - 1);
            }
        } catch (err) {
            const msg = err?.response?.data?.error || 'No se pudo eliminar la receta';
            toast.error(msg);
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-9">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs mb-5" style={{ color: 'var(--color-texto-medio)' }}>
                <Link to="/" style={{ color: 'var(--color-primario)', textDecoration: 'none', fontWeight: 600 }}>
                    GastroHub
                </Link>
                <span>/</span>
                <span>Catálogo Gastronómico</span>
            </nav>

            {/* Encabezado + Acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Catálogo Gastronómico & Fichas Técnicas
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Mostrando {recetasFiltradas.length} de {listaRecetas.length} receta{listaRecetas.length !== 1 ? 's' : ''} registrada{listaRecetas.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {/* Selector de vista Tarjetas / Tabla */}
                    <div
                        className="inline-flex rounded-xl p-1 border"
                        style={{ background: '#fff', borderColor: 'var(--color-borde)' }}
                    >
                        <button
                            type="button"
                            onClick={() => setModoVista('grid')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            style={{
                                background: modoVista === 'grid' ? 'var(--color-salmon-claro)' : 'transparent',
                                color: modoVista === 'grid' ? 'var(--color-primario-hover)' : 'var(--color-texto-medio)',
                            }}
                        >
                            ⊞ Tarjetas
                        </button>
                        <button
                            type="button"
                            onClick={() => setModoVista('tabla')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            style={{
                                background: modoVista === 'tabla' ? 'var(--color-salmon-claro)' : 'transparent',
                                color: modoVista === 'tabla' ? 'var(--color-primario-hover)' : 'var(--color-texto-medio)',
                            }}
                        >
                            ☰ Tabla
                        </button>
                    </div>

                    <button
                        className="btn-primario"
                        onClick={() => {
                            setErrorFormulario(null);
                            setModalCrear(true);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Receta
                    </button>
                </div>
            </div>

            {/* Tarjetas KPI de resumen */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="tarjeta p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--color-salmon-claro)' }}>
                        📖
                    </div>
                    <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Total Recetas</p>
                        <p className="text-xl font-extrabold" style={{ color: 'var(--color-texto-oscuro)' }}>{kpis.total}</p>
                    </div>
                </div>

                <div className="tarjeta p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--color-ambar-claro)' }}>
                        ⭐
                    </div>
                    <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Favoritas del Chef</p>
                        <p className="text-xl font-extrabold" style={{ color: 'var(--color-texto-oscuro)' }}>{kpis.favoritas}</p>
                    </div>
                </div>

                <div className="tarjeta p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--color-verde-menta)' }}>
                        🏷️
                    </div>
                    <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Categorías Activas</p>
                        <p className="text-xl font-extrabold" style={{ color: 'var(--color-texto-oscuro)' }}>{kpis.categoriasUnicas}</p>
                    </div>
                </div>

                <div className="tarjeta p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--color-celeste)' }}>
                        🔥
                    </div>
                    <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Promedio Energético</p>
                        <p className="text-xl font-extrabold" style={{ color: 'var(--color-texto-oscuro)' }}>
                            {kpis.promedioCalorias ? `${kpis.promedioCalorias} kcal` : '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Panel de Filtros */}
            <FiltrosRecetas
                filtros={filtros}
                alCambiarFiltros={actualizarFiltros}
                alLimpiar={limpiarFiltros}
            />

            {/* Contenido principal */}
            {cargando ? (
                <div className="tarjeta p-4">
                    <Spinner mensaje="Cargando catálogo gastronómico..." />
                </div>
            ) : errorGlobal ? (
                <div
                    className="tarjeta p-8 text-center"
                    style={{ background: '#fde8e8', borderColor: '#f8c9c9' }}
                >
                    <p className="font-semibold text-sm" style={{ color: '#b91c1c' }}>{errorGlobal}</p>
                    <button className="btn-primario mt-4" onClick={cargarRecetas}>Reintentar conexión</button>
                </div>
            ) : (
                <>
                    <TablaRecetas
                        recetas={recetasPagina}
                        modoVista={modoVista}
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
                            <p className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>
                                Página {paginaActual} de {totalPaginas}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="px-3 py-2 text-xs rounded-xl border font-medium transition-colors disabled:opacity-40 cursor-pointer"
                                    style={{ borderColor: 'var(--color-borde)', color: 'var(--color-texto-medio)', background: '#fff' }}
                                >
                                    ← Anterior
                                </button>

                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setPaginaActual(num)}
                                        className="w-8 h-8 text-xs rounded-xl border font-semibold transition-colors cursor-pointer"
                                        style={{
                                            borderColor: num === paginaActual ? 'var(--color-primario)' : 'var(--color-borde)',
                                            background: num === paginaActual ? 'var(--color-primario)' : '#fff',
                                            color: num === paginaActual ? '#fff' : 'var(--color-texto-medio)',
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                                    disabled={paginaActual === totalPaginas}
                                    className="px-3 py-2 text-xs rounded-xl border font-medium transition-colors disabled:opacity-40 cursor-pointer"
                                    style={{ borderColor: 'var(--color-borde)', color: 'var(--color-texto-medio)', background: '#fff' }}
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal — Crear receta */}
            <Modal
                abierto={modalCrear}
                alCerrar={() => setModalCrear(false)}
                titulo="Registrar Nueva Ficha Técnica"
                tamano="lg"
            >
                <FormularioReceta
                    alGuardar={manejarCrear}
                    alCancelar={() => setModalCrear(false)}
                    cargando={guardando}
                    errorExterno={errorFormulario}
                />
            </Modal>

            {/* Modal — Editar receta */}
            <Modal
                abierto={modalEditar.abierto}
                alCerrar={() => setModalEditar({ abierto: false, receta: null })}
                titulo="Editar Ficha Técnica de Receta"
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
                mensaje={`¿Seguro que deseas eliminar la receta "${modalEliminar.receta?.titulo}" de GastroHub? Esta acción no se puede deshacer.`}
                cargando={eliminando}
            />
        </div>
    );
};

export default CatalogoView;
