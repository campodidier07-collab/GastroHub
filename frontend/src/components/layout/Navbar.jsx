import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Search,
    Sun,
    Moon,
    Bell,
    Plus,
    Menu,
    ChevronRight,
    Sparkles,
    Clock,
    Star,
    CheckCircle2,
    User,
    LayoutDashboard,
    BookOpen,
} from 'lucide-react';
import { useRecetas } from '../../context/RecetaContext';
import { useTheme } from '../../context/ThemeContext';

/**
 * Navbar superior premium estilo Stripe / Vercel / Linear.
 * Incluye Breadcrumb contextual, Buscador instantáneo con Popover,
 * Switch de Tema Claro/Oscuro, Centro de Notificaciones y Perfil Ejecutivo.
 */
const Navbar = ({ alAbrirMenuMovil, alAbrirCrearReceta }) => {
    const [busquedaRapida, setBusquedaRapida] = useState('');
    const [popoverBusqueda, setPopoverBusqueda] = useState(false);
    const [popoverNotificaciones, setPopoverNotificaciones] = useState(false);
    const [popoverPerfil, setPopoverPerfil] = useState(false);

    const ubicacion = useLocation();
    const navegar = useNavigate();
    const { listaRecetas } = useRecetas();
    const { esOscuro, alternarTema } = useTheme();

    const refBusqueda = useRef(null);
    const refNotif = useRef(null);
    const refPerfil = useRef(null);

    // Cerrar popovers al hacer clic fuera
    useEffect(() => {
        const manejarClickFuera = (e) => {
            if (refBusqueda.current && !refBusqueda.current.contains(e.target)) {
                setPopoverBusqueda(false);
            }
            if (refNotif.current && !refNotif.current.contains(e.target)) {
                setPopoverNotificaciones(false);
            }
            if (refPerfil.current && !refPerfil.current.contains(e.target)) {
                setPopoverPerfil(false);
            }
        };
        document.addEventListener('mousedown', manejarClickFuera);
        return () => document.removeEventListener('mousedown', manejarClickFuera);
    }, []);

    // Atajo de teclado Ctrl+K / Cmd+K para enfocar el buscador global
    const inputBusquedaRef = useRef(null);
    useEffect(() => {
        const manejarAtajo = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                inputBusquedaRef.current?.focus();
                setPopoverBusqueda(true);
            }
        };
        window.addEventListener('keydown', manejarAtajo);
        return () => window.removeEventListener('keydown', manejarAtajo);
    }, []);

    const resultadosInstantaneos = busquedaRapida.trim()
        ? listaRecetas
            .filter((r) =>
                r.titulo?.toLowerCase().includes(busquedaRapida.toLowerCase()) ||
                r.categoria?.toLowerCase().includes(busquedaRapida.toLowerCase()) ||
                r.ingredientes?.some((i) => i.nombre?.toLowerCase().includes(busquedaRapida.toLowerCase()))
            )
            .slice(0, 5)
        : listaRecetas.slice(0, 4);

    const nombreVistaActual = {
        '/': 'Overview & Presentación',
        '/dashboard': 'Dashboard Ejecutivo',
        '/catalogo': 'Catálogo & Fichas Técnicas',
    }[ubicacion.pathname] || 'Plataforma';

    const manejarSubmitBusqueda = (e) => {
        e.preventDefault();
        setPopoverBusqueda(false);
        if (busquedaRapida.trim()) {
            navegar(`/catalogo?q=${encodeURIComponent(busquedaRapida.trim())}`);
        } else {
            navegar('/catalogo');
        }
    };

    return (
        <header
            className="sticky top-0 z-30 w-full h-16 px-4 sm:px-6 flex items-center justify-between gap-4 border-b"
            style={{
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(14px)',
                borderColor: 'var(--borde-sutil)',
            }}
        >
            {/* Izquierda: Botón menú móvil + Breadcrumb contextual */}
            <div className="flex items-center gap-3 min-w-0">
                <button
                    type="button"
                    onClick={alAbrirMenuMovil}
                    className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border cursor-pointer"
                    style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--borde-sutil)',
                        color: 'var(--texto-primario)',
                    }}
                    aria-label="Abrir navegación"
                >
                    <Menu className="w-4 h-4" />
                </button>

                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs min-w-0">
                    <Link
                        to="/dashboard"
                        className="font-semibold hidden sm:inline hover:underline"
                        style={{ color: 'var(--texto-secundario)', textDecoration: 'none' }}
                    >
                        GastroHub
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 hidden sm:inline shrink-0" style={{ color: 'var(--texto-muted)' }} />
                    <span className="font-bold truncate" style={{ color: 'var(--texto-primario)' }}>
                        {nombreVistaActual}
                    </span>
                </nav>
            </div>

            {/* Centro: Command Search Bar (⌘K) */}
            <div ref={refBusqueda} className="relative flex-1 max-w-md">
                <form onSubmit={manejarSubmitBusqueda} className="relative flex items-center">
                    <Search
                        className="w-4 h-4 absolute left-3 pointer-events-none"
                        style={{ color: 'var(--texto-muted)' }}
                    />
                    <input
                        ref={inputBusquedaRef}
                        type="search"
                        value={busquedaRapida}
                        onFocus={() => setPopoverBusqueda(true)}
                        onChange={(e) => {
                            setBusquedaRapida(e.target.value);
                            setPopoverBusqueda(true);
                        }}
                        placeholder="Buscar receta, ingrediente o partida..."
                        aria-label="Buscador global de recetas"
                        className="w-full pl-9 pr-14 py-1.5 text-xs rounded-xl border transition-all outline-none"
                        style={{
                            background: 'var(--bg-input)',
                            borderColor: popoverBusqueda ? 'var(--color-primario)' : 'var(--borde-sutil)',
                            color: 'var(--texto-primario)',
                            boxShadow: popoverBusqueda ? '0 0 0 3px var(--color-primario-suave)' : 'var(--sombra-sm)',
                        }}
                    />
                    <kbd
                        className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono-num rounded border absolute right-2 pointer-events-none"
                        style={{
                            background: 'var(--bg-secundario)',
                            borderColor: 'var(--borde-sutil)',
                            color: 'var(--texto-muted)',
                        }}
                    >
                        Ctrl K
                    </kbd>
                </form>

                {/* Popover de resultados rápidos */}
                {popoverBusqueda && (
                    <div
                        className="absolute left-0 right-0 mt-2 rounded-2xl border p-2 z-50 animar-entrada"
                        style={{
                            background: 'var(--bg-elevado)',
                            borderColor: 'var(--borde-fuerte)',
                            boxShadow: 'var(--sombra-lg)',
                        }}
                    >
                        <div className="flex items-center justify-between px-2.5 py-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--texto-muted)' }}>
                                {busquedaRapida.trim() ? 'Resultados instantáneos' : 'Sugerencias del Catálogo'}
                            </span>
                            <Link
                                to="/catalogo"
                                onClick={() => setPopoverBusqueda(false)}
                                className="text-[11px] font-semibold"
                                style={{ color: 'var(--color-primario)', textDecoration: 'none' }}
                            >
                                Ver todo →
                            </Link>
                        </div>

                        {resultadosInstantaneos.length > 0 ? (
                            <div className="flex flex-col gap-0.5">
                                {resultadosInstantaneos.map((receta) => (
                                    <button
                                        key={receta._id}
                                        type="button"
                                        onClick={() => {
                                            setPopoverBusqueda(false);
                                            navegar(`/catalogo?q=${encodeURIComponent(receta.titulo)}`);
                                        }}
                                        className="w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                                        style={{ color: 'var(--texto-primario)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold truncate">{receta.titulo}</p>
                                            <p className="text-[11px] truncate" style={{ color: 'var(--texto-muted)' }}>
                                                {receta.categoria || 'Plato Fuerte'} · {receta.tiempo}
                                            </p>
                                        </div>
                                        {receta.favorito && (
                                            <Star className="w-3.5 h-3.5 shrink-0 fill-amber-400 text-amber-400" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="px-3 py-4 text-xs text-center" style={{ color: 'var(--texto-muted)' }}>
                                Sin coincidencias para &ldquo;{busquedaRapida}&rdquo;
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Derecha: Acciones Globales, Tema, Notificaciones y Perfil */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Botón de acción primaria rápida */}
                {alAbrirCrearReceta && (
                    <button
                        type="button"
                        onClick={alAbrirCrearReceta}
                        className="btn-primario hidden sm:inline-flex py-1.5 px-3 text-xs"
                    >
                        <Plus className="w-4 h-4" strokeWidth={2.2} />
                        <span>Nueva Ficha</span>
                    </button>
                )}

                {/* Switcher Modo Claro / Modo Oscuro */}
                <button
                    type="button"
                    onClick={alternarTema}
                    className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer"
                    style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--borde-sutil)',
                        color: 'var(--texto-primario)',
                    }}
                    title={esOscuro ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                    aria-label={esOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
                >
                    {esOscuro ? (
                        <Sun className="w-4 h-4 text-amber-400" strokeWidth={2} />
                    ) : (
                        <Moon className="w-4 h-4" strokeWidth={2} />
                    )}
                </button>

                {/* Centro de Notificaciones */}
                <div ref={refNotif} className="relative">
                    <button
                        type="button"
                        onClick={() => setPopoverNotificaciones((p) => !p)}
                        className="w-9 h-9 rounded-xl border flex items-center justify-center relative transition-colors cursor-pointer"
                        style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--borde-sutil)',
                            color: 'var(--texto-primario)',
                        }}
                        aria-label="Abrir notificaciones"
                    >
                        <Bell className="w-4 h-4" strokeWidth={2} />
                        <span
                            className="w-2 h-2 rounded-full absolute top-2 right-2"
                            style={{ background: 'var(--color-primario)' }}
                        />
                    </button>

                    {popoverNotificaciones && (
                        <div
                            className="absolute right-0 mt-2 w-80 rounded-2xl border p-3 z-50 animar-entrada"
                            style={{
                                background: 'var(--bg-elevado)',
                                borderColor: 'var(--borde-fuerte)',
                                boxShadow: 'var(--sombra-lg)',
                            }}
                        >
                            <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: 'var(--borde-sutil)' }}>
                                <span className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                    Actividad del Sistema
                                </span>
                                <span
                                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                    style={{ background: 'var(--color-exito-bg)', color: 'var(--color-exito-texto)' }}
                                >
                                    En línea
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 text-xs">
                                <div className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: 'var(--bg-secundario)' }}>
                                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-exito)' }} />
                                    <div>
                                        <p className="font-semibold" style={{ color: 'var(--texto-primario)' }}>
                                            Catálogo sincronizado ({listaRecetas.length} fichas)
                                        </p>
                                        <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                            API RESTful respondiendo con validación activa.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5 p-2 rounded-xl" style={{ background: 'var(--bg-secundario)' }}>
                                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-primario)' }} />
                                    <div>
                                        <p className="font-semibold" style={{ color: 'var(--texto-primario)' }}>
                                            Escalador de rendimiento activo
                                        </p>
                                        <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                            Abre cualquier ficha para recalcular porciones en vivo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Perfil Ejecutivo */}
                <div ref={refPerfil} className="relative">
                    <button
                        type="button"
                        onClick={() => setPopoverPerfil((p) => !p)}
                        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border transition-colors cursor-pointer"
                        style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--borde-sutil)',
                        }}
                        aria-label="Menú de perfil de usuario"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: 'var(--gradiente-primario)' }}
                        >
                            DP
                        </div>
                        <div className="hidden md:flex flex-col text-left leading-tight">
                            <span className="text-xs font-semibold" style={{ color: 'var(--texto-primario)' }}>
                                Didier Puentes
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--texto-muted)' }}>
                                Executive Chef
                            </span>
                        </div>
                    </button>

                    {popoverPerfil && (
                        <div
                            className="absolute right-0 mt-2 w-56 rounded-2xl border p-2 z-50 animar-entrada"
                            style={{
                                background: 'var(--bg-elevado)',
                                borderColor: 'var(--borde-fuerte)',
                                boxShadow: 'var(--sombra-lg)',
                            }}
                        >
                            <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--borde-sutil)' }}>
                                <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>Didier Puentes</p>
                                <p className="text-[11px] truncate" style={{ color: 'var(--texto-muted)' }}>campodidier07@gmail.com</p>
                            </div>
                            <Link
                                to="/dashboard"
                                onClick={() => setPopoverPerfil(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                                style={{ color: 'var(--texto-primario)', textDecoration: 'none' }}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard Ejecutivo
                            </Link>
                            <Link
                                to="/catalogo"
                                onClick={() => setPopoverPerfil(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
                                style={{ color: 'var(--texto-primario)', textDecoration: 'none' }}
                            >
                                <BookOpen className="w-4 h-4" />
                                Gestionar Fichas Técnicas
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    alternarTema();
                                    setPopoverPerfil(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left cursor-pointer"
                                style={{ color: 'var(--texto-secundario)' }}
                            >
                                {esOscuro ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                {esOscuro ? 'Modo Claro' : 'Modo Oscuro'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
