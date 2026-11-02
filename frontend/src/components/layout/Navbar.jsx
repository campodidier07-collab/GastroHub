import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar principal de la aplicación.
 * Contiene el logo, los enlaces de navegación y el menú responsivo para móvil.
 */
const Navbar = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const ubicacion = useLocation();

    const esRutaActiva = (ruta) => ubicacion.pathname === ruta;

    const enlacesNav = [
        { etiqueta: 'Inicio', ruta: '/' },
        { etiqueta: 'Catálogo', ruta: '/catalogo' },
    ];

    return (
        <header
            className="sticky top-0 z-40 w-full"
            style={{
                background: 'rgba(255,248,240,0.88)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--color-borde)',
                boxShadow: '0 1px 16px rgba(0,0,0,0.05)',
            }}
        >
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

                {/* Logo + nombre */}
                <Link to="/" className="flex items-center gap-2 text-decoration-none" style={{ textDecoration: 'none' }}>
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--color-primario)' }}
                    >
                        {/* Ícono chef / plato */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7zM9 21h6" />
                        </svg>
                    </div>
                    <span className="text-base font-bold tracking-tight" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Cocina<span style={{ color: 'var(--color-primario)' }}>MERN</span>
                    </span>
                </Link>

                {/* Enlace de navegación — desktop */}
                <ul className="hidden md:flex items-center gap-1 list-none">
                    {enlacesNav.map(({ etiqueta, ruta }) => (
                        <li key={ruta}>
                            <Link
                                to={ruta}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    textDecoration: 'none',
                                    color: esRutaActiva(ruta) ? 'var(--color-primario)' : 'var(--color-texto-medio)',
                                    background: esRutaActiva(ruta) ? 'var(--color-salmon-claro)' : 'transparent',
                                    fontWeight: esRutaActiva(ruta) ? 600 : 500,
                                }}
                            >
                                {etiqueta}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            to="/catalogo"
                            className="btn-primario ml-2"
                            style={{ textDecoration: 'none' }}
                        >
                            {/* Ícono libro de recetas */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Ver Recetas
                        </Link>
                    </li>
                </ul>

                {/* Botón menú móvil */}
                <button
                    className="md:hidden p-2 rounded-lg transition-colors"
                    style={{ color: 'var(--color-texto-medio)' }}
                    onClick={() => setMenuAbierto((prev) => !prev)}
                    aria-label="Abrir menú"
                >
                    {menuAbierto ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </nav>

            {/* Menú móvil desplegable */}
            {menuAbierto && (
                <div
                    className="md:hidden px-4 pb-4 flex flex-col gap-2 animar-entrada"
                    style={{ borderTop: '1px solid var(--color-borde)' }}
                >
                    {enlacesNav.map(({ etiqueta, ruta }) => (
                        <Link
                            key={ruta}
                            to={ruta}
                            onClick={() => setMenuAbierto(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{
                                textDecoration: 'none',
                                color: esRutaActiva(ruta) ? 'var(--color-primario)' : 'var(--color-texto-medio)',
                                background: esRutaActiva(ruta) ? 'var(--color-salmon-claro)' : 'transparent',
                            }}
                        >
                            {etiqueta}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Navbar;
