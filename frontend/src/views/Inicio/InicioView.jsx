import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useRecetas } from '../../context/RecetaContext';
import Modal from '../../components/ui/Modal';

/**
 * VISTA 1 — PRODUCT OVERVIEW (LANDING PRINCIPAL INDEPENDIENTE `/`)
 * Es la puerta de entrada pública al sistema (sin la Sidebar operativa).
 * Presenta el producto con estética Apple / Linear / Stripe y guía al usuario
 * en una secuencia clara hacia la Consola Operativa (/dashboard y /catalogo).
 */
const InicioView = () => {
    const navegar = useNavigate();
    const { esOscuro, alternarTema } = useTheme();
    const { listaRecetas } = useRecetas();
    const [modalAccesoAbierto, setModalAccesoAbierto] = useState(false);

    const totalFichas = listaRecetas.length || 6;
    const totalFavoritas = listaRecetas.filter((r) => r.favorito).length || 4;

    const flujoSecuencial = [
        {
            paso: '01',
            icono: 'fa-solid fa-file-signature',
            titulo: 'Estandariza la Ficha Técnica',
            descripcion: 'Documenta cada plato con insumos exactos, gramos/mililitros, partida gastronómica, calorías y protocolo paso a paso.',
        },
        {
            paso: '02',
            icono: 'fa-solid fa-scale-balanced',
            titulo: 'Escala el Rendimiento en Vivo',
            descripcion: 'Ajusta el número de comensales de 1 a 50 y el motor recalcula todas las cantidades de la mise en place al instante.',
        },
        {
            paso: '03',
            icono: 'fa-solid fa-chart-pie',
            titulo: 'Supervisa y Ejecuta en Cocina',
            descripcion: 'Controla KPIs desde el Dashboard Ejecutivo, activa el checklist interactivo paso a paso o imprime la hoja de producción.',
        },
    ];

    const capacidadesSaaS = [
        {
            icono: 'fa-solid fa-scale-balanced',
            titulo: 'Escalador Matemático de Porciones',
            descripcion: 'Modifica el rendimiento por comensales y recalcula cada insumo de la receta sin errores manuales.',
            etiqueta: 'Precisión Operativa',
        },
        {
            icono: 'fa-solid fa-list-check',
            titulo: 'Modo Cocina Paso a Paso',
            descripcion: 'Checklist interactivo para marcar ingredientes alistados y etapas de cocción con barra porcentual de avance.',
            etiqueta: 'Flujo en Línea',
        },
        {
            icono: 'fa-solid fa-print',
            titulo: 'Fichas Técnicas Imprimibles',
            descripcion: 'Generación instantánea de hojas de producción limpias listas para estación de cocina o exportación a PDF.',
            etiqueta: 'Estándar HoReCa',
        },
        {
            icono: 'fa-solid fa-shield-halved',
            titulo: 'API REST con Validación Estricta',
            descripcion: 'Arquitectura Express 5 + Mongoose 9 con sanitización de payloads, healthcheck y respaldo automático.',
            etiqueta: 'Grado Empresarial',
        },
    ];

    const categoriasDestacadas = [
        { nombre: 'Plato Fuerte', icono: 'fa-solid fa-utensils', desc: 'Proteínas, risottos y cocciones principales' },
        { nombre: 'Entrada', icono: 'fa-solid fa-fire-flame-curved', desc: 'Ceviches, tartares y aperitivos de autor' },
        { nombre: 'Postre', icono: 'fa-solid fa-ice-cream', desc: 'Alta pastelería, chocolate y reducciones' },
        { nombre: 'Ensalada', icono: 'fa-solid fa-leaf', desc: 'Bowls frescos, granos y vinagretas' },
        { nombre: 'Sopa', icono: 'fa-solid fa-bowl-food', desc: 'Ramen artesanal, fondos y cremas' },
        { nombre: 'Bebida', icono: 'fa-solid fa-martini-glass-citrus', desc: 'Infusiones, fermentos y coctelería' },
    ];

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: 'var(--bg-principal)', color: 'var(--texto-primario)' }}
        >
            {/* ─── NAVBAR DE PORTADA (INDEPENDIENTE DEL WORKSPACE) ─────────── */}
            <header
                className="sticky top-0 z-40 w-full border-b"
                style={{
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(16px)',
                    borderColor: 'var(--borde-sutil)',
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    {/* Identidad */}
                    <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'var(--gradiente-primario)', boxShadow: 'var(--sombra-glow)' }}
                        >
                            <i className="fa-solid fa-kitchen-set text-white text-sm" aria-hidden="true" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold tracking-tight" style={{ color: 'var(--texto-primario)' }}>
                                GastroHub
                            </span>
                            <span
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase"
                                style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                            >
                                v2.0 Enterprise
                            </span>
                        </div>
                    </Link>

                    {/* Navegación interna de la portada */}
                    <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: 'var(--texto-secundario)' }}>
                        <a href="#como-funciona" className="hover:underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Flujo de Trabajo
                        </a>
                        <a href="#arquitectura" className="hover:underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Arquitectura
                        </a>
                        <a href="#partidas" className="hover:underline" style={{ color: 'inherit', textDecoration: 'none' }}>
                            Partidas Culinarias
                        </a>
                    </nav>

                    {/* Acciones de entrada al sistema */}
                    <div className="flex items-center gap-2.5">
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
                            aria-label="Cambiar tema visual"
                        >
                            <i className={`fa-solid ${esOscuro ? 'fa-sun text-amber-400' : 'fa-moon'} text-sm`} aria-hidden="true" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setModalAccesoAbierto(true)}
                            className="btn-secundario hidden sm:inline-flex py-2 px-3.5 text-xs"
                        >
                            <i className="fa-solid fa-compass text-xs" aria-hidden="true" />
                            <span>Selector de Módulos</span>
                        </button>

                        <Link
                            to="/dashboard"
                            className="btn-primario py-2 px-4 text-xs"
                            style={{ textDecoration: 'none' }}
                        >
                            <span>Ir al Dashboard</span>
                            <i className="fa-solid fa-arrow-right text-[11px]" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* ─── SECCIÓN HERO PRINCIPAL ──────────────────────────────────── */}
                <section
                    className="relative overflow-hidden border-b py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
                    style={{
                        backgroundImage: 'var(--gradiente-hero)',
                        borderColor: 'var(--borde-sutil)',
                    }}
                >
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div
                                className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-xs font-semibold border"
                                style={{
                                    background: 'var(--color-primario-suave)',
                                    color: 'var(--color-primario)',
                                    borderColor: 'rgba(234, 88, 12, 0.28)',
                                }}
                            >
                                <i className="fa-solid fa-wand-magic-sparkles text-xs" aria-hidden="true" />
                                <span>Plataforma SaaS de Gestión Gastronómica & Mise en Place</span>
                            </div>

                            <h1
                                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
                                style={{ color: 'var(--texto-primario)' }}
                            >
                                Estandariza, escala y controla tu{' '}
                                <span style={{ color: 'var(--color-primario)' }}>cocina profesional</span>
                            </h1>

                            <p
                                className="text-sm sm:text-base leading-relaxed max-w-xl"
                                style={{ color: 'var(--texto-secundario)' }}
                            >
                                Bienvenido a <strong>GastroHub</strong>. Centraliza fichas técnicas de alta precisión,
                                recalcula porciones automáticamente y supervisa las métricas operativas de tu catálogo desde una consola unificada.
                            </p>

                            {/* Botones primarios de entrada al sistema */}
                            <div className="flex flex-wrap items-center gap-3.5 pt-2">
                                <Link
                                    to="/dashboard"
                                    className="btn-primario px-6 py-3 text-sm"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <i className="fa-solid fa-chart-pie text-sm" aria-hidden="true" />
                                    <span>Ingresar al Dashboard Ejecutivo</span>
                                    <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setModalAccesoAbierto(true)}
                                    className="btn-secundario px-5 py-3 text-sm"
                                >
                                    <i className="fa-solid fa-layer-group text-sm" aria-hidden="true" />
                                    <span>Elegir Módulo de Entrada</span>
                                </button>
                            </div>

                            {/* Telemetría rápida */}
                            <div
                                className="grid grid-cols-3 gap-4 pt-6 mt-2 border-t"
                                style={{ borderColor: 'var(--borde-sutil)' }}
                            >
                                <div>
                                    <p className="text-2xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>
                                        {totalFichas} Fichas
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>Pre-cargadas y listas</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold font-mono-num" style={{ color: 'var(--color-primario)' }}>
                                        1–50x
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>Escalado de porciones</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold font-mono-num" style={{ color: 'var(--color-exito)' }}>
                                        100%
                                    </p>
                                    <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>API REST validada</p>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta interactiva de vista previa del Workspace */}
                        <div className="lg:col-span-5">
                            <div
                                className="tarjeta p-3.5 rounded-2xl border"
                                style={{
                                    background: 'var(--bg-card)',
                                    borderColor: 'var(--borde-fuerte)',
                                    boxShadow: 'var(--sombra-lg)',
                                }}
                            >
                                <div className="flex items-center justify-between px-2 pb-2.5 mb-2.5 border-b" style={{ borderColor: 'var(--borde-sutil)' }}>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-[11px] font-mono-num" style={{ color: 'var(--texto-muted)' }}>
                                        gastrohub.app/dashboard
                                    </span>
                                </div>

                                <img
                                    src="/img/hero_icon_2.png"
                                    alt="Vista previa de estación gastronómica GastroHub"
                                    className="w-full h-64 object-cover rounded-xl"
                                />

                                <div className="p-3 mt-1 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                            Consola Operativa Lista
                                        </p>
                                        <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                            {totalFichas} recetas activas · {totalFavoritas} destacadas del chef
                                        </p>
                                    </div>
                                    <Link
                                        to="/dashboard"
                                        className="btn-primario py-2 px-3.5 text-xs shrink-0"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <span>Abrir Consola</span>
                                        <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── SECCIÓN: FLUJO SECUENCIAL DE 3 PASOS ────────────────────── */}
                <section id="como-funciona" className="py-16 px-4 sm:px-6 lg:px-8 border-b" style={{ borderColor: 'var(--borde-sutil)' }}>
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primario)' }}>
                                Secuencia Operativa
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: 'var(--texto-primario)' }}>
                                Cómo funciona GastroHub
                            </h2>
                            <p className="text-xs sm:text-sm mt-2" style={{ color: 'var(--texto-secundario)' }}>
                                Un flujo estructurado de extremo a extremo desde el registro de la receta hasta el servicio en cocina.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {flujoSecuencial.map((item) => (
                                <div key={item.paso} className="tarjeta p-6 flex flex-col justify-between gap-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                                        >
                                            <i className={`${item.icono} text-base`} aria-hidden="true" />
                                        </div>
                                        <span
                                            className="text-xs font-mono-num font-extrabold px-2.5 py-1 rounded-lg border"
                                            style={{
                                                background: 'var(--bg-secundario)',
                                                color: 'var(--texto-muted)',
                                                borderColor: 'var(--borde-sutil)',
                                            }}
                                        >
                                            PASO {item.paso}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--texto-primario)' }}>
                                            {item.titulo}
                                        </h3>
                                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>
                                            {item.descripcion}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── SECCIÓN: ARQUITECTURA & BENTO GRID ──────────────────────── */}
                <section id="arquitectura" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primario)' }}>
                                Ingeniería Gastronómica
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: 'var(--texto-primario)' }}>
                                Capacidades de grado empresarial
                            </h2>
                        </div>
                        <Link
                            to="/dashboard"
                            className="btn-secundario py-2 px-4 text-xs"
                            style={{ textDecoration: 'none' }}
                        >
                            <span>Explorar en el Dashboard</span>
                            <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {capacidadesSaaS.map((cap) => (
                            <div key={cap.titulo} className="tarjeta tarjeta-interactiva p-6 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                                    >
                                        <i className={`${cap.icono} text-base`} aria-hidden="true" />
                                    </div>
                                    <span
                                        className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold"
                                        style={{ background: 'var(--bg-secundario)', color: 'var(--texto-secundario)' }}
                                    >
                                        {cap.etiqueta}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold" style={{ color: 'var(--texto-primario)' }}>
                                    {cap.titulo}
                                </h3>
                                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>
                                    {cap.descripcion}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── SECCIÓN: PARTIDAS CULINARIAS Y CTA FINAL ────────────────── */}
                <section id="partidas" className="py-16 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--borde-sutil)', background: 'var(--bg-secundario)' }}>
                    <div className="max-w-6xl mx-auto flex flex-col gap-10">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-extrabold" style={{ color: 'var(--texto-primario)' }}>
                                    Partidas Gastronómicas Soportadas
                                </h2>
                                <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--texto-secundario)' }}>
                                    Selecciona cualquier partida para entrar directamente al catálogo filtrado
                                </p>
                            </div>
                            <Link
                                to="/catalogo"
                                className="text-xs font-semibold inline-flex items-center gap-1.5"
                                style={{ color: 'var(--color-primario)', textDecoration: 'none' }}
                            >
                                <span>Abrir catálogo completo</span>
                                <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categoriasDestacadas.map((cat) => (
                                <Link
                                    key={cat.nombre}
                                    to={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
                                    className="tarjeta tarjeta-interactiva p-4 flex flex-col gap-2.5"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                                    >
                                        <i className={`${cat.icono} text-sm`} aria-hidden="true" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                            {cat.nombre}
                                        </p>
                                        <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                                            {cat.desc}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Banner CTA final hacia el Dashboard */}
                        <div
                            className="tarjeta p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border"
                            style={{
                                background: 'var(--bg-card)',
                                borderColor: 'var(--borde-fuerte)',
                                boxShadow: 'var(--sombra-md)',
                            }}
                        >
                            <div className="max-w-xl text-center md:text-left">
                                <h3 className="text-xl sm:text-2xl font-extrabold" style={{ color: 'var(--texto-primario)' }}>
                                    ¿Listo para entrar a la consola de GastroHub?
                                </h3>
                                <p className="text-xs sm:text-sm mt-1.5" style={{ color: 'var(--texto-secundario)' }}>
                                    Accede al Dashboard Ejecutivo con analítica en vivo o gestiona directamente todas las fichas técnicas del recetario.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <Link
                                    to="/dashboard"
                                    className="btn-primario px-6 py-3 text-xs sm:text-sm"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <i className="fa-solid fa-chart-pie text-xs" aria-hidden="true" />
                                    <span>Ir al Dashboard Ejecutivo</span>
                                </Link>
                                <Link
                                    to="/catalogo"
                                    className="btn-secundario px-5 py-3 text-xs sm:text-sm"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <i className="fa-solid fa-book-open text-xs" aria-hidden="true" />
                                    <span>Ir al Catálogo</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* ─── FOOTER DE LA PORTADA ─────────────────────────────────────── */}
            <footer
                className="py-6 px-4 sm:px-6 lg:px-8 border-t text-xs"
                style={{ borderColor: 'var(--borde-sutil)', background: 'var(--bg-card)', color: 'var(--texto-muted)' }}
            >
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-kitchen-set" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                        <strong style={{ color: 'var(--texto-primario)' }}>GastroHub Enterprise</strong>
                        <span>· Culinary Management SaaS</span>
                    </div>
                    <p>
                        Desarrollado por <strong style={{ color: 'var(--texto-primario)' }}>Didier Puentes</strong> · Stack MERN
                    </p>
                </div>
            </footer>

            {/* ─── MODAL DE ACCESO ESTRUCTURADO AL WORKSPACE ────────────────── */}
            <Modal
                abierto={modalAccesoAbierto}
                alCerrar={() => setModalAccesoAbierto(false)}
                titulo="Ingresar al Sistema GastroHub"
                subtitulo="Selecciona el módulo operativo con el que deseas iniciar tu sesión"
                tamano="md"
            >
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setModalAccesoAbierto(false);
                            navegar('/dashboard');
                        }}
                        className="p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all cursor-pointer"
                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                    >
                        <div className="flex items-center gap-3.5">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'var(--color-primario-suave)', color: 'var(--color-primario)' }}
                            >
                                <i className="fa-solid fa-chart-pie text-base" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--texto-primario)' }}>
                                    1. Dashboard Ejecutivo (Recomendado)
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
                                    Visualiza KPIs, gráficas por partida, nivel de complejidad y actividad reciente.
                                </p>
                            </div>
                        </div>
                        <i className="fa-solid fa-arrow-right text-xs shrink-0" style={{ color: 'var(--color-primario)' }} aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setModalAccesoAbierto(false);
                            navegar('/catalogo');
                        }}
                        className="p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all cursor-pointer"
                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                    >
                        <div className="flex items-center gap-3.5">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}
                            >
                                <i className="fa-solid fa-book-open text-base" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--texto-primario)' }}>
                                    2. Catálogo Gastronómico & Fichas Técnicas
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
                                    Gestiona recetas en vista de tarjetas o tabla, filtra insumos y escala porciones.
                                </p>
                            </div>
                        </div>
                        <i className="fa-solid fa-arrow-right text-xs shrink-0" style={{ color: 'var(--color-info)' }} aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setModalAccesoAbierto(false);
                            navegar('/catalogo?favoritas=true');
                        }}
                        className="p-4 rounded-xl border text-left flex items-center justify-between gap-4 transition-all cursor-pointer"
                        style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
                    >
                        <div className="flex items-center gap-3.5">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'var(--color-advertencia-bg)', color: 'var(--color-advertencia)' }}
                            >
                                <i className="fa-solid fa-star text-base" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--texto-primario)' }}>
                                    3. Colección Favoritas del Chef
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
                                    Accede directamente a los platos insignia destacados en el catálogo.
                                </p>
                            </div>
                        </div>
                        <i className="fa-solid fa-arrow-right text-xs shrink-0" style={{ color: 'var(--color-advertencia)' }} aria-hidden="true" />
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default InicioView;
