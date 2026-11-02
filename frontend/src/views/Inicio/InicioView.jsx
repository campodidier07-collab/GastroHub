import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

/**
 * Vista principal de la aplicación.
 * Muestra la presentación del proyecto con animaciones AOS,
 * sección hero, características y CTA al catálogo.
 */
const InicioView = () => {
    // Inicializar AOS solo en la vista de Inicio
    useEffect(() => {
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
        });
        return () => AOS.refresh();
    }, []);

    const caracteristicas = [
        {
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="var(--color-primario)" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            fondo: 'var(--color-salmon-claro)',
            titulo: 'Organiza tus recetas',
            descripcion: 'Registra, edita y consulta todas tus recetas en un solo lugar, con ingredientes y pasos detallados.',
        },
        {
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#2980b9" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
            ),
            fondo: 'var(--color-celeste)',
            titulo: 'Búsqueda inteligente',
            descripcion: 'Filtra recetas por nombre, tiempo de preparación o cantidad de ingredientes en tiempo real.',
        },
        {
            icono: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#27ae60" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            fondo: 'var(--color-verde-menta)',
            titulo: 'Control del tiempo',
            descripcion: 'Visualiza el tiempo estimado de cada preparación para planificar mejor tu cocina.',
        },
    ];

    return (
        <main>
            {/* ─── SECCIÓN HERO ─────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--color-crema) 0%, var(--color-salmon-claro) 100%)', minHeight: '90vh' }}
            >
                {/* Elementos decorativos de fondo */}
                <div
                    aria-hidden="true"
                    className="absolute top-10 right-10 w-72 h-72 rounded-full opacity-30 blur-3xl"
                    style={{ background: 'var(--color-rosa-pastel)' }}
                />
                <div
                    aria-hidden="true"
                    className="absolute bottom-10 left-10 w-48 h-48 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'var(--color-lavanda)' }}
                />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                    {/* Texto del Hero */}
                    <div className="flex-1 flex flex-col gap-6 text-center lg:text-left" data-aos="fade-right">
                        {/* Badge */}
                        <span
                            className="inline-flex items-center gap-2 self-center lg:self-start px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                            style={{ background: 'rgba(240,165,152,0.2)', color: 'var(--color-primario-hover)', border: '1.5px solid var(--color-primario)' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Sistema de Gestión Culinaria
                        </span>

                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
                            style={{ color: 'var(--color-texto-oscuro)' }}
                        >
                            Tu recetario
                            <br />
                            <span style={{ color: 'var(--color-primario)' }}>digital</span>
                            <br />
                            profesional
                        </h1>

                        <p
                            className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
                            style={{ color: 'var(--color-texto-medio)' }}
                        >
                            Gestiona, organiza y consulta todas tus recetas de cocina desde un solo lugar.
                            Con búsqueda inteligente, filtros avanzados y un catálogo completo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Link to="/catalogo" className="btn-primario justify-center text-base px-6 py-3" style={{ textDecoration: 'none' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Explorar catálogo
                            </Link>
                            <a
                                href="#caracteristicas"
                                className="btn-secundario justify-center text-base px-6 py-3"
                                style={{ textDecoration: 'none' }}
                            >
                                Conocer más
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center items-center w-full" data-aos="fade-left" data-aos-delay="150">
                        <img
                           src="../../../public/img/hero_icon_2.png"
                           alt="Ingredientes frescos sobre tabla de cocina"
                           className="w-full h-full object-cover rounded-3xl shadow-xl"
                        />
                    </div>
                </div>
            </section>

            {/* ─── SECCIÓN CARACTERÍSTICAS ────────────────────────────────────── */}
            <section
                id="caracteristicas"
                className="py-20"
                style={{ background: '#fff' }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Encabezado de sección */}
                    <div className="text-center mb-14" data-aos="fade-up">
                        <span
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: 'var(--color-primario)' }}
                        >
                            Funcionalidades
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-2" style={{ color: 'var(--color-texto-oscuro)' }}>
                            Todo lo que necesitas
                        </h2>
                        <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: 'var(--color-texto-medio)' }}>
                            Una plataforma completa para gestionar el inventario de recetas de tu cocina.
                        </p>
                    </div>

                    {/* Tarjetas de características */}
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
                                <h3 className="text-base font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
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
                style={{ background: 'linear-gradient(135deg, var(--color-crema) 0%, var(--color-lavanda) 100%)' }}
            >
                <div
                    className="max-w-2xl mx-auto px-4 flex flex-col items-center text-center gap-6"
                    data-aos="zoom-in"
                >
                    <h2 className="text-3xl font-bold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        ¿Listo para explorar?
                    </h2>
                    <p className="text-base" style={{ color: 'var(--color-texto-medio)' }}>
                        Accede al catálogo completo de recetas y empieza a gestionar tu cocina de manera profesional.
                    </p>
                    <Link
                        to="/catalogo"
                        className="btn-primario text-base px-8 py-3"
                        style={{ textDecoration: 'none' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        Ir al catálogo
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default InicioView;
