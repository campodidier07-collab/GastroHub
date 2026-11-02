import { Link } from 'react-router-dom';

/**
 * Vista de presentación SaaS de GastroHub con iconografía Font Awesome unificada.
 */
const InicioView = () => {
    const categoriasDestacadas = [
        { nombre: 'Plato Fuerte', icono: 'fa-solid fa-utensils', desc: 'Proteínas, risottos y cocciones principales' },
        { nombre: 'Entrada', icono: 'fa-solid fa-fire-flame-curved', desc: 'Ceviches, tartares y aperitivos de autor' },
        { nombre: 'Postre', icono: 'fa-solid fa-ice-cream', desc: 'Alta pastelería, chocolate y reducciones' },
        { nombre: 'Ensalada', icono: 'fa-solid fa-leaf', desc: 'Bowls frescos, granos y vinagretas' },
        { nombre: 'Sopa', icono: 'fa-solid fa-bowl-food', desc: 'Ramen artesanal, fondos y cremas' },
        { nombre: 'Bebida', icono: 'fa-solid fa-martini-glass-citrus', desc: 'Infusiones, fermentos y coctelería' },
    ];

    const capacidadesSaaS = [
        {
            icono: 'fa-solid fa-scale-balanced',
            titulo: 'Escalador Matemático de Porciones',
            descripcion: 'Modifica el rendimiento de 1 a 50 comensales y recalcula cada gramo o mililitro de la mise en place en tiempo real.',
            etiqueta: 'Precisión Operativa',
        },
        {
            icono: 'fa-solid fa-list-check',
            titulo: 'Modo Cocina Paso a Paso',
            descripcion: 'Checklist interactivo para marcar insumos alistados y etapas de cocción con indicador porcentual de avance.',
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
            descripcion: 'Arquitectura Express 5 + Mongoose 9 con sanitización de esquemas, telemetría de salud y respaldo automático.',
            etiqueta: 'Grado Empresarial',
        },
    ];

    return (
        <div className="flex flex-col">
            {/* HERO EMPRESARIAL */}
            <section
                className="relative overflow-hidden border-b py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: 'var(--gradiente-hero)',
                    borderColor: 'var(--borde-sutil)',
                }}
            >
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-7 flex flex-col gap-5">
                        <div
                            className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-xs font-semibold border"
                            style={{
                                background: 'var(--color-primario-suave)',
                                color: 'var(--color-primario)',
                                borderColor: 'rgba(234, 88, 12, 0.28)',
                            }}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles text-xs" aria-hidden="true" />
                            <span>GastroHub Enterprise v2.0 · Culinary SaaS</span>
                        </div>

                        <h1
                            className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight"
                            style={{ color: 'var(--texto-primario)' }}
                        >
                            El sistema operativo para{' '}
                            <span style={{ color: 'var(--color-primario)' }}>estandarizar tu cocina</span>
                        </h1>

                        <p
                            className="text-sm sm:text-base leading-relaxed max-w-xl"
                            style={{ color: 'var(--texto-secundario)' }}
                        >
                            Diseñado con precisión de ingeniería para chefs ejecutivos y equipos gastronómicos.
                            Controla fichas técnicas, escala porciones al instante y supervisa métricas del catálogo desde un solo lugar.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                to="/dashboard"
                                className="btn-primario px-5 py-2.5 text-sm"
                                style={{ textDecoration: 'none' }}
                            >
                                <i className="fa-solid fa-chart-pie text-xs" aria-hidden="true" />
                                <span>Abrir Dashboard Ejecutivo</span>
                            </Link>
                            <Link
                                to="/catalogo"
                                className="btn-secundario px-5 py-2.5 text-sm"
                                style={{ textDecoration: 'none' }}
                            >
                                <i className="fa-solid fa-book-open text-xs" aria-hidden="true" />
                                <span>Explorar Catálogo</span>
                            </Link>
                        </div>

                        <div
                            className="grid grid-cols-3 gap-4 pt-5 mt-2 border-t"
                            style={{ borderColor: 'var(--borde-sutil)' }}
                        >
                            <div>
                                <p className="text-xl font-extrabold font-mono-num" style={{ color: 'var(--texto-primario)' }}>100%</p>
                                <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>Escalado en vivo</p>
                            </div>
                            <div>
                                <p className="text-xl font-extrabold font-mono-num" style={{ color: 'var(--color-primario)' }}>Ctrl+K</p>
                                <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>Búsqueda global</p>
                            </div>
                            <div>
                                <p className="text-xl font-extrabold font-mono-num" style={{ color: 'var(--color-exito)' }}>WCAG AA</p>
                                <p className="text-xs" style={{ color: 'var(--texto-muted)' }}>Dark & Light Mode</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div
                            className="tarjeta p-3 rounded-2xl border"
                            style={{
                                background: 'var(--bg-card)',
                                borderColor: 'var(--borde-fuerte)',
                                boxShadow: 'var(--sombra-lg)',
                            }}
                        >
                            <img
                                src="/img/hero_icon_2.png"
                                alt="Estación gastronómica profesional de GastroHub"
                                className="w-full h-72 object-cover rounded-xl"
                            />
                            <div className="p-3 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                                        Estandarización de Fichas Técnicas
                                    </p>
                                    <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                                        Control de insumos, calorías, tiempos y partidas
                                    </p>
                                </div>
                                <Link
                                    to="/catalogo"
                                    className="btn-ver"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <span>Ver fichas</span>
                                    <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO GRID */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-primario)' }}>
                            Arquitectura de Producto
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1" style={{ color: 'var(--texto-primario)' }}>
                            Ingeniería aplicada a la gastronomía
                        </h2>
                    </div>
                    <Link
                        to="/dashboard"
                        className="text-xs font-semibold inline-flex items-center gap-1.5"
                        style={{ color: 'var(--color-primario)', textDecoration: 'none' }}
                    >
                        <span>Ir al panel de analítica</span>
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

            {/* PARTIDAS CULINARIAS */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: 'var(--borde-sutil)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6">
                        <h2 className="text-xl font-extrabold" style={{ color: 'var(--texto-primario)' }}>
                            Acceso rápido por Partida Gastronómica
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--texto-muted)' }}>
                            Selecciona una colección para abrir el catálogo filtrado automáticamente
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                        {categoriasDestacadas.map((cat) => (
                            <Link
                                key={cat.nombre}
                                to={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`}
                                className="tarjeta tarjeta-interactiva p-4 flex flex-col gap-2.5"
                                style={{ textDecoration: 'none' }}
                            >
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: 'var(--bg-secundario)', color: 'var(--color-primario)' }}
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
                </div>
            </section>
        </div>
    );
};

export default InicioView;
