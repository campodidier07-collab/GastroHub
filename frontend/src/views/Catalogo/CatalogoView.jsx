import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRecetas } from '../../context/RecetaContext';
import FiltrosRecetas from '../../components/recetas/FiltrosRecetas';
import TablaRecetas from '../../components/recetas/TablaRecetas';
import FormularioReceta from '../../components/recetas/FormularioReceta';
import DetalleReceta from '../../components/recetas/DetalleReceta';
import Modal from '../../components/ui/Modal';
import ConfirmacionModal from '../../components/ui/ConfirmacionModal';
import Spinner from '../../components/ui/Spinner';

// ─── Estado inicial de filtros ────────────────────────────────────────────────
const FILTROS_INICIALES = {
    busqueda: '',
    tiempoFiltro: '',
    minIngredientes: '',
    ordenar: 'reciente',
};

// ─── Constantes de paginación ─────────────────────────────────────────────────
const REGISTROS_POR_PAGINA = 8;

/**
 * Vista del catálogo completo de recetas.
 * Incluye filtros, tabla, paginación y operaciones CRUD con modales.
 */
const CatalogoView = () => {
    const {
        listaRecetas,
        cargando,
        errorGlobal,
        cargarRecetas,
        agregarReceta,
        modificarReceta,
        borrarReceta,
    } = useRecetas();

    // ── Estado de filtros y paginación ────────────────────────────────────
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [paginaActual, setPaginaActual] = useState(1);

    // ── Estado de modales ─────────────────────────────────────────────────
    const [modalCrear, setModalCrear] = useState(false);
    const [modalEditar, setModalEditar] = useState({ abierto: false, receta: null });
    const [modalDetalle, setModalDetalle] = useState({ abierto: false, receta: null });
    const [modalEliminar, setModalEliminar] = useState({ abierto: false, receta: null });

    // ── Estado de operaciones asíncronas ──────────────────────────────────
    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [errorFormulario, setErrorFormulario] = useState(null);

    // ── Cargar recetas al montar el componente ────────────────────────────
    useEffect(() => {
        cargarRecetas();
    }, [cargarRecetas]);

    // ── Resetear a página 1 cuando cambian los filtros ────────────────────
    useEffect(() => {
        setPaginaActual(1);
    }, [filtros]);

    // ── Actualizar filtros manteniendo los demás valores ──────────────────
    const actualizarFiltros = (nuevosFiltros) => {
        setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
    };

    const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);

    // ── Filtrado y ordenamiento de recetas (memoizado) ────────────────────
    const recetasFiltradas = useMemo(() => {
        let resultado = [...listaRecetas];

        // Filtro por búsqueda de título
        if (filtros.busqueda.trim()) {
            const terminoLower = filtros.busqueda.toLowerCase();
            resultado = resultado.filter((r) =>
                r.titulo?.toLowerCase().includes(terminoLower)
            );
        }

        // Filtro por tiempo (contiene texto)
        if (filtros.tiempoFiltro.trim()) {
            const tiempoLower = filtros.tiempoFiltro.toLowerCase();
            resultado = resultado.filter((r) =>
                r.tiempo?.toLowerCase().includes(tiempoLower)
            );
        }

        // Filtro por mínimo de ingredientes
        if (filtros.minIngredientes !== '') {
            const minimo = parseInt(filtros.minIngredientes, 10);
            if (!isNaN(minimo)) {
                resultado = resultado.filter((r) => (r.ingredientes?.length || 0) >= minimo);
            }
        }

        // Ordenamiento
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
            default:
                break;
        }

        return resultado;
    }, [listaRecetas, filtros]);

    // ── Paginación sobre el resultado filtrado ────────────────────────────
    const totalPaginas = Math.ceil(recetasFiltradas.length / REGISTROS_POR_PAGINA);
    const recetasPagina = recetasFiltradas.slice(
        (paginaActual - 1) * REGISTROS_POR_PAGINA,
        paginaActual * REGISTROS_POR_PAGINA
    );

    // ── Manejador: Crear receta ───────────────────────────────────────────
    const manejarCrear = async (datos) => {
        setGuardando(true);
        setErrorFormulario(null);
        try {
            await agregarReceta(datos);
            setModalCrear(false);
            toast.success('¡Receta creada exitosamente!');
        } catch (err) {
            const mensajeError = err?.response?.data?.error || 'Error al crear la receta';
            setErrorFormulario(mensajeError);
        } finally {
            setGuardando(false);
        }
    };

    // ── Manejador: Editar receta ──────────────────────────────────────────
    const manejarEditar = async (datos) => {
        if (!modalEditar.receta) return;
        setGuardando(true);
        setErrorFormulario(null);
        try {
            await modificarReceta(modalEditar.receta._id, datos);
            setModalEditar({ abierto: false, receta: null });
            toast.success('Receta actualizada correctamente');
        } catch (err) {
            const mensajeError = err?.response?.data?.error || 'Error al actualizar la receta';
            setErrorFormulario(mensajeError);
        } finally {
            setGuardando(false);
        }
    };

    // ── Manejador: Eliminar receta ────────────────────────────────────────
    const manejarEliminar = async () => {
        if (!modalEliminar.receta) return;
        setEliminando(true);
        try {
            await borrarReceta(modalEliminar.receta._id);
            setModalEliminar({ abierto: false, receta: null });
            toast.success('Receta eliminada');
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* ── Breadcrumb ─────────────────────────────────────────────── */}
            <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-texto-medio)' }}>
                <Link to="/" style={{ color: 'var(--color-primario)', textDecoration: 'none', fontWeight: 500 }}>
                    Inicio
                </Link>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span>Catálogo</span>
            </nav>

            {/* ── Encabezado de la vista ────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Catálogo de Recetas
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-texto-medio)' }}>
                        {recetasFiltradas.length} receta{recetasFiltradas.length !== 1 ? 's' : ''} encontrada{recetasFiltradas.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Botón crear nueva receta */}
                <button
                    className="btn-primario self-start sm:self-auto"
                    onClick={() => {
                        setErrorFormulario(null);
                        setModalCrear(true);
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo +
                </button>
            </div>

            {/* ── Filtros ───────────────────────────────────────────────── */}
            <FiltrosRecetas
                filtros={filtros}
                alCambiarFiltros={actualizarFiltros}
                alLimpiar={limpiarFiltros}
            />

            {/* ── Contenido principal ───────────────────────────────────── */}
            {cargando ? (
                <div className="tarjeta p-4">
                    <Spinner mensaje="Cargando recetas..." />
                </div>
            ) : errorGlobal ? (
                <div
                    className="tarjeta p-8 text-center"
                    style={{ background: '#fde8e8', borderColor: '#f5c6c6' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="#c0392b" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    <p className="font-semibold text-sm" style={{ color: '#c0392b' }}>{errorGlobal}</p>
                    <button className="btn-primario mt-4" onClick={cargarRecetas}>Reintentar</button>
                </div>
            ) : (
                <>
                    <div className="tarjeta overflow-hidden">
                        <TablaRecetas
                            recetas={recetasPagina}
                            alVerDetalle={(receta) => setModalDetalle({ abierto: true, receta })}
                            alEditar={(receta) => {
                                setErrorFormulario(null);
                                setModalEditar({ abierto: true, receta });
                            }}
                            alEliminar={(receta) => setModalEliminar({ abierto: true, receta })}
                        />
                    </div>

                    {/* ── Paginación ────────────────────────────────────── */}
                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-between mt-5">
                            <p className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>
                                Página {paginaActual} de {totalPaginas}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                                    disabled={paginaActual === 1}
                                    className="px-3 py-2 text-xs rounded-xl border font-medium transition-colors disabled:opacity-40"
                                    style={{ borderColor: 'var(--color-borde)', color: 'var(--color-texto-medio)', background: '#fff' }}
                                >
                                    ← Anterior
                                </button>

                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => setPaginaActual(num)}
                                        className="w-8 h-8 text-xs rounded-xl border font-semibold transition-colors"
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
                                    className="px-3 py-2 text-xs rounded-xl border font-medium transition-colors disabled:opacity-40"
                                    style={{ borderColor: 'var(--color-borde)', color: 'var(--color-texto-medio)', background: '#fff' }}
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════════════════════════════════════════════════════════
                MODALES
            ═══════════════════════════════════════════════════════════ */}

            {/* Modal — Crear receta */}
            <Modal
                abierto={modalCrear}
                alCerrar={() => setModalCrear(false)}
                titulo="Nueva receta"
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
                titulo="Editar receta"
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
                titulo="Detalle de receta"
                tamano="lg"
            >
                <DetalleReceta receta={modalDetalle.receta} />
            </Modal>

            {/* Modal — Confirmación de eliminación */}
            <ConfirmacionModal
                abierto={modalEliminar.abierto}
                alCerrar={() => setModalEliminar({ abierto: false, receta: null })}
                alConfirmar={manejarEliminar}
                titulo="Eliminar receta"
                mensaje={`¿Seguro que deseas eliminar la receta "${modalEliminar.receta?.titulo}"? Esta acción no se puede deshacer.`}
                cargando={eliminando}
            />
        </div>
    );
};

export default CatalogoView;
