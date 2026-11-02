import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useRecetas } from '../../context/RecetaContext';

const ICONOS_CAT = {
    'Plato Fuerte': 'fa-solid fa-utensils',
    'Entrada': 'fa-solid fa-fire-flame-curved',
    'Postre': 'fa-solid fa-ice-cream',
    'Ensalada': 'fa-solid fa-leaf',
    'Sopa': 'fa-solid fa-bowl-food',
    'Bebida': 'fa-solid fa-martini-glass-citrus',
};

/**
 * Sidebar empresarial colapsable con iconografía Font Awesome unificada.
 */
const Sidebar = ({ colapsada, alAlternarColapso, movilAbierta, alCerrarMovil }) => {
    const ubicacion = useLocation();
    const [searchParams] = useSearchParams();
    const { listaRecetas } = useRecetas();

    const totalRecetas = listaRecetas.length;
    const totalFavoritas = listaRecetas.filter((r) => r.favorito).length;

    const conteoPorCategoria = listaRecetas.reduce((acc, r) => {
        const cat = r.categoria || 'Plato Fuerte';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const categoriaActiva = searchParams.get('categoria') || '';
    const favoritasActiva = searchParams.get('favoritas') === 'true';

    const itemsPrincipales = [
        {
            etiqueta: 'Dashboard Ejecutivo',
            ruta: '/dashboard',
            icono: 'fa-solid fa-chart-pie',
            activo: ubicacion.pathname === '/dashboard',
            badge: null,
        },
        {
            etiqueta: 'Catálogo Gastronómico',
            ruta: '/catalogo',
            icono: 'fa-solid fa-book-open',
            activo: ubicacion.pathname === '/catalogo' && !favoritasActiva && !categoriaActiva,
            badge: totalRecetas,
        },
        {
            etiqueta: 'Colección Favoritas',
            ruta: '/catalogo?favoritas=true',
            icono: 'fa-solid fa-star',
            activo: ubicacion.pathname === '/catalogo' && favoritasActiva,
            badge: totalFavoritas,
        },
        {
            etiqueta: 'Product Overview',
            ruta: '/',
            icono: 'fa-solid fa-wand-magic-sparkles',
            activo: ubicacion.pathname === '/',
            badge: null,
        },
    ];

    const categoriasMenu = ['Plato Fuerte', 'Entrada', 'Postre', 'Ensalada', 'Sopa', 'Bebida'];

    const renderContenidoSidebar = (esMovil = false) => {
        const mostrarTexto = esMovil || !colapsada;

        return (
            <div
                className="flex flex-col h-full justify-between select-none"
                style={{
                    background: 'var(--bg-secundario)',
                    borderRight: '1px solid var(--borde-sutil)',
                }}
            >
                <div className="flex flex-col gap-6 p-3.5 overflow-y-auto">
                    {/* Brand */}
                    <div className="flex items-center justify-between px-1.5 pt-1">
                        <Link
                            to="/dashboard"
                            onClick={() => esMovil && alCerrarMovil?.()}
                            className="flex items-center gap-3 min-w-0"
                            style={{ textDecoration: 'none' }}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{
                                    background: 'var(--gradiente-primario)',
                                    boxShadow: 'var(--sombra-glow)',
                                }}
                            >
                                <i className="fa-solid fa-kitchen-set text-white text-sm" aria-hidden="true" />
                            </div>
                            {mostrarTexto && (
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-extrabold tracking-tight truncate" style={{ color: 'var(--texto-primario)' }}>
                                            GastroHub
                                        </span>
                                        <span
                                            className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                                            style={{
                                                background: 'var(--color-primario-suave)',
                                                color: 'var(--color-primario)',
                                            }}
                                        >
                                            PRO
                                        </span>
                                    </div>
                                    <span className="text-[11px] truncate" style={{ color: 'var(--texto-muted)' }}>
                                        Culinary SaaS Platform
                                    </span>
                                </div>
                            )}
                        </Link>

                        {esMovil && (
                            <button
                                type="button"
                                onClick={alCerrarMovil}
                                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                                style={{ color: 'var(--texto-secundario)', background: 'var(--bg-card)' }}
                                aria-label="Cerrar menú lateral"
                            >
                                <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
                            </button>
                        )}
                    </div>

                    {/* Plataforma */}
                    <div className="flex flex-col gap-1">
                        {mostrarTexto && (
                            <span
                                className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: 'var(--texto-muted)' }}
                            >
                                Plataforma
                            </span>
                        )}
                        {itemsPrincipales.map((item) => (
                            <Link
                                key={item.etiqueta}
                                to={item.ruta}
                                onClick={() => esMovil && alCerrarMovil?.()}
                                title={!mostrarTexto ? item.etiqueta : undefined}
                                className={`flex items-center ${mostrarTexto ? 'justify-between px-3' : 'justify-center px-2'} py-2.5 rounded-xl text-xs font-medium transition-all duration-150`}
                                style={{
                                    textDecoration: 'none',
                                    background: item.activo ? 'var(--color-primario-suave)' : 'transparent',
                                    color: item.activo ? 'var(--color-primario)' : 'var(--texto-secundario)',
                                    fontWeight: item.activo ? 600 : 500,
                                    border: item.activo ? '1px solid rgba(234, 88, 12, 0.22)' : '1px solid transparent',
                                }}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <i className={`${item.icono} w-4 text-center text-sm shrink-0`} aria-hidden="true" />
                                    {mostrarTexto && <span className="truncate">{item.etiqueta}</span>}
                                </div>
                                {mostrarTexto && item.badge !== null && (
                                    <span
                                        className="px-2 py-0.5 rounded-md text-[11px] font-mono-num font-semibold"
                                        style={{
                                            background: item.activo ? 'var(--color-primario)' : 'var(--bg-card)',
                                            color: item.activo ? '#FFFFFF' : 'var(--texto-secundario)',
                                            border: item.activo ? 'none' : '1px solid var(--borde-sutil)',
                                        }}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Partidas Culinarias */}
                    <div className="flex flex-col gap-1">
                        {mostrarTexto && (
                            <span
                                className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: 'var(--texto-muted)' }}
                            >
                                Partidas Culinarias
                            </span>
                        )}
                        {categoriasMenu.map((cat) => {
                            const claseIcono = ICONOS_CAT[cat] || 'fa-solid fa-layer-group';
                            const activo = ubicacion.pathname === '/catalogo' && categoriaActiva === cat;
                            const cantidad = conteoPorCategoria[cat] || 0;

                            return (
                                <Link
                                    key={cat}
                                    to={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                                    onClick={() => esMovil && alCerrarMovil?.()}
                                    title={!mostrarTexto ? `${cat} (${cantidad})` : undefined}
                                    className={`flex items-center ${mostrarTexto ? 'justify-between px-3' : 'justify-center px-2'} py-2 rounded-xl text-xs transition-all duration-150`}
                                    style={{
                                        textDecoration: 'none',
                                        background: activo ? 'var(--bg-card)' : 'transparent',
                                        color: activo ? 'var(--texto-primario)' : 'var(--texto-secundario)',
                                        fontWeight: activo ? 600 : 500,
                                        border: activo ? '1px solid var(--borde-fuerte)' : '1px solid transparent',
                                    }}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <i className={`${claseIcono} w-4 text-center text-sm shrink-0`} aria-hidden="true" />
                                        {mostrarTexto && <span className="truncate">{cat}</span>}
                                    </div>
                                    {mostrarTexto && (
                                        <span className="text-[11px] font-mono-num" style={{ color: 'var(--texto-muted)' }}>
                                            {cantidad}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Estado + Colapsar */}
                <div className="p-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--borde-sutil)' }}>
                    {mostrarTexto && (
                        <div
                            className="p-3 rounded-xl border flex items-center gap-2.5"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--borde-sutil)' }}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold truncate" style={{ color: 'var(--texto-primario)' }}>
                                    Motor API Operativo
                                </p>
                                <p className="text-[10px] truncate" style={{ color: 'var(--texto-muted)' }}>
                                    Sincronización en tiempo real
                                </p>
                            </div>
                            <i className="fa-solid fa-wave-square text-xs shrink-0" style={{ color: 'var(--color-exito)' }} aria-hidden="true" />
                        </div>
                    )}

                    {!esMovil && (
                        <button
                            type="button"
                            onClick={alAlternarColapso}
                            className="w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            style={{
                                color: 'var(--texto-secundario)',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--borde-sutil)',
                            }}
                            aria-label={colapsada ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
                        >
                            {colapsada ? (
                                <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
                            ) : (
                                <>
                                    <i className="fa-solid fa-chevron-left text-xs" aria-hidden="true" />
                                    <span>Contraer panel</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <aside
                className="hidden lg:block shrink-0 transition-all duration-200 ease-out sticky top-0 h-screen z-30"
                style={{ width: colapsada ? '74px' : '256px' }}
            >
                {renderContenidoSidebar(false)}
            </aside>

            {movilAbierta && (
                <div
                    className="fixed inset-0 z-50 lg:hidden flex"
                    style={{ backgroundColor: 'rgba(9, 13, 22, 0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={alCerrarMovil}
                >
                    <aside
                        className="w-72 max-w-[85vw] h-full animar-entrada"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {renderContenidoSidebar(true)}
                    </aside>
                </div>
            )}
        </>
    );
};

export default Sidebar;
