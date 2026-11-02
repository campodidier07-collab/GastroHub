import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Vista de presentación de GastroHub.
 * Incluye Hero gastronómico, acceso rápido por categorías, pilares de la plataforma y CTA.
 */
const InicioView = () => {
    useEffect(() => {
        AOS.init({
            duration: 650,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
        });
        return () => AOS.refresh();
    }, []);

    const categoriasDestacadas = [
        { nombre: 'Plato Fuerte', icono: '🍛', desc: 'Carnes, pastas, risottos y pesca' },
        { nombre: 'Entrada', icono: '🍤', desc: 'Ceviches, tartares y aperitivos' },
        { nombre: 'Postre', icono: '🍫', desc: 'Repostería de autor y dulces' },
        { nombre: 'Ensalada', icono: '🥗', desc: 'Bowls frescos y cocina saludable' },
        { nombre: 'Sopa', icono: '🍜', desc: 'Ramen, cremas y caldos lentos' },
        { nombre: 'Bebida', icono: '🍹', desc: 'Coctelería sin alcohol e infusiones' },
    ];

    const caracteristicas = [
        {
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="var(--color-primario)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            fondo: 'var(--color-salmon-claro)',
            titulo: 'Fichas Técnicas & Escalado',
            descripcion: 'Registra ingredientes exactos, calorías, dificultad y ajusta dinámicamente el número de porciones recalculando cantidades al instante.',
        },
        {
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#1d5fa7" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
            ),
            fondo: 'var(--color-celeste)',
            titulo: 'Filtros Multicriterio y Favoritos',
            descripcion: 'Encuentra preparaciones al instante por nombre, ingrediente, categoría, nivel de dificultad, tiempo o colección de favoritos.',
        },
        {
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="var(--color-secundario)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            fondo: 'var(--color-verde-menta)',
            titulo: 'Modo Cocina Interactiva',
            descripcion: 'Marca ingredientes y pasos completados en tiempo real mientras cocinas, o imprime la ficha técnica limpia con un clic.',
        },
    ];

    return (
        <main>
            {/* ─── SECCIÓN HERO ─────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, var(--color-crema) 0%, var(--color-salmon-claro) 100%)',
                    minHeight: '86vh',
                }}
            >
                <div
                    aria-hidden="true"
                    className="absolute top-10 right-10 w-80 h-80 rounded-full opacity-35 blur-3xl"
                    style={{ background: 'var(--color-rosa-pastel)' }}
                />
                <div
                    aria-hidden="true"
                    className="absolute bottom-10 left-10 w-56 h-56 rounded-full opacity-25 blur-3xl"
                    style={{ background: 'var(--color-ambar-claro)' }}
                />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Columna de texto */}
                    <div className="flex-1 flex flex-col gap-6 text-center lg:text-left" data-aos="fade-right">
                        <span
                            className="inline-flex items-center gap-2 self-center lg:self-start px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                            style={{
                                background: 'rgba(217, 93, 57, 0.12)',
                                color: 'var(--color-primario-hover)',
                                border: '1px solid rgba(217, 93, 57, 0.35)',
                            }}
                        >
                            <span>✨</span>
                            GastroHub Culinary Management System
                        </span>

                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
                            style={{ color: 'var(--color-texto-oscuro)' }}
                        >
                            Estandariza y eleva tu{' '}
                            <span style={{ color: 'var(--color-primario)' }}>cocina de autor</span>
                        </h1>

                        <p
                            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
                            style={{ color: 'var(--color-texto-medio)' }}
                        >
                            Centraliza fichas técnicas de recetas, escala porciones en tiempo real,
                            controla ingredientes y ejecuta cada preparación paso a paso con precisión profesional.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
                            <Link to="/catalogo" className="btn-primario justify-center text-base px-7 py-3.5" style={{ textDecoration: 'none' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Explorar Catálogo Gourmet
                            </Link>
                            <a
                                href="#caracteristicas"
                                className="btn-secundario justify-center text-base px-6 py-3.5"
                                style={{ textDecoration: 'none' }}
                            >
                                Conocer Arquitectura
                            </a>
                        </div>

                        {/* Indicadores rápidos de valor */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t mt-2" style={{ borderColor: 'rgba(31, 29, 26, 0.08)' }}>
                            <div>
                                <p className="text-2xl font-extrabold" style={{ color: 'var(--color-texto-oscuro)' }}>100%</p>
                                <p className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>Escalado de porciones</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold" style={{ color: 'var(--color-primario)' }}>8+</p>
                                <p className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>Categorías culinarias</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold" style={{ color: 'var(--color-secundario)' }}>REST API</p>
                                <p className="text-xs" style={{ color: 'var(--color-texto-medio)' }}>Validación estricta</p>
                            </div>
                        </div>
                    </div>

                    {/* Imagen Hero corregida para Vite (/img/hero_icon_2.png) */}
                    <div className="flex-1 flex justify-center items-center w-full" data-aos="fade-left" data-aos-delay="120">
                        <div className="relative w-full max-w-lg">
                            <img
                                src="/img/hero_icon_2.png"
                                alt="Mesa gastronómica con ingredientes frescos de GastroHub"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white"
                            />
                            <div
                                className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg absolute -bottom-5 -left-5 border"
                                style={{ background: '#fff', borderColor: 'var(--color-borde)' }}
                            >
                                <span className="text-2xl">👨‍🍳</span>
                                <div>
                                    <p className="text-xs font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                                        Mise en Place Digital
                                    </p>
                                    <p className="text-[11px]" style={{ color: 'var(--color-texto-medio)' }}>
                                        Control de tiempos, calorías y pasos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORÍAS RÁPIDAS ────────────────────────────────────────── */}
            <section className="py-16 border-b" style={{ background: '#fff', borderColor: 'var(--color-borde)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4" data-aos="fade-up">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-primario)' }}>
                                Colecciones
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: 'var(--color-texto-oscuro)' }}>
                                Explora por categoría gastronómica
                            </h2>
                        </div>
                        <Link
                            to="/catalogo"
                            className="text-sm font-semibold hover:underline"
                            style={{ color: 'var(--color-primario)', textDecoration: 'none' }}
                        >
                            Ver todas las recetas →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categoriasDestacadas.map((cat, idx) => (
                            <Link
                                key={cat.nombre}
                                to={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
                                className="tarjeta p-4 flex flex-col items-center text-center gap-2 hover:-translate-y-1 transition-transform"
                                style={{ textDecoration: 'none' }}
                                data-aos="fade-up"
                                data-aos-delay={idx * 60}
                            >
                                <span className="text-3xl">{cat.icono}</span>
                                <span className="text-sm font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                                    {cat.nombre}
                                </span>
                                <span className="text-[11px] leading-snug" style={{ color: 'var(--color-texto-medio)' }}>
                                    {cat.desc}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── SECCIÓN CARACTERÍSTICAS ────────────────────────────────────── */}
            <section
                id="caracteristicas"
                className="py-20"
                style={{ background: 'var(--color-crema)' }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14" data-aos="fade-up">
                        <span
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: 'var(--color-primario)' }}
                        >
                            Ingeniería Culinaria
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: 'var(--color-texto-oscuro)' }}>
                            Diseñado para cocinas exigentes
                        </h2>
                        <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: 'var(--color-texto-medio)' }}>
                            Mucho más que un formulario: una suite completa de estandarización gastronómica.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {caracteristicas.map((item, idx) => (
                            <div
                                key={idx}
                                className="tarjeta p-7 flex flex-col gap-4"
                                data-aos="fade-up"
                                data-aos-delay={idx * 100}
                            >
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{ background: item.fondo }}
                                >
                                    {item.icono}
                                </div>
                                <h3 className="text-base font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                                    {item.titulo}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-texto-medio)' }}>
                                    {item.descripcion}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA FINAL ─────────────────────────────────────────────────── */}
            <section
                className="py-20"
                style={{ background: 'linear-gradient(135deg, var(--color-salmon-claro) 0%, var(--color-ambar-claro) 100%)' }}
            >
                <div
                    className="max-w-2xl mx-auto px-4 flex flex-col items-center text-center gap-6"
                    data-aos="zoom-in"
                >
                    <h2 className="text-3xl font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        ¿Listo para gestionar tu catálogo gastronómico?
                    </h2>
                    <p className="text-base" style={{ color: 'var(--color-texto-medio)' }}>
                        Explora nuestras recetas de autor pre-cargadas, prueba el escalador de porciones o registra tus propias creaciones.
                    </p>
                    <Link
                        to="/catalogo"
                        className="btn-primario text-base px-8 py-3.5"
                        style={{ textDecoration: 'none' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Ir al Catálogo de GastroHub
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default InicioView;
