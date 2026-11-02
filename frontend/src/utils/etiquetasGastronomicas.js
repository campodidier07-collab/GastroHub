/**
 * Catálogo estandarizado de etiquetas dietéticas, nutricionales y de alérgenos
 * con iconografía Font Awesome 6 unificada.
 */
export const CATALOGO_ETIQUETAS = [
    {
        nombre: 'Sin Gluten',
        icono: 'fa-solid fa-wheat-awn-circle-exclamation',
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.12)',
    },
    {
        nombre: 'Vegetariano',
        icono: 'fa-solid fa-leaf',
        color: '#22C55E',
        bg: 'rgba(34, 197, 94, 0.12)',
    },
    {
        nombre: 'Vegano',
        icono: 'fa-solid fa-seedling',
        color: '#16A34A',
        bg: 'rgba(22, 163, 74, 0.12)',
    },
    {
        nombre: 'Alto en Proteína',
        icono: 'fa-solid fa-dumbbell',
        color: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.12)',
    },
    {
        nombre: 'Lácteos',
        icono: 'fa-solid fa-cheese',
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
        nombre: 'Frutos Secos',
        icono: 'fa-solid fa-jar',
        color: '#D97706',
        bg: 'rgba(217, 119, 6, 0.12)',
    },
    {
        nombre: 'Mariscos',
        icono: 'fa-solid fa-shrimp',
        color: '#06B6D4',
        bg: 'rgba(6, 182, 212, 0.12)',
    },
    {
        nombre: 'Picante',
        icono: 'fa-solid fa-pepper-hot',
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.12)',
    },
];

export const obtenerMetaEtiqueta = (nombre) =>
    CATALOGO_ETIQUETAS.find((e) => e.nombre === nombre) || {
        nombre,
        icono: 'fa-solid fa-tag',
        color: 'var(--color-primario)',
        bg: 'var(--color-primario-suave)',
    };

/**
 * Calcula métricas financieras de escandallo a partir del costo por porción
 * y el porcentaje de Food Cost objetivo (por defecto 30%).
 */
export const calcularEscandallo = (costoPorPorcion, porciones = 1, foodCostPct = 30) => {
    const costoUnitario = Number(costoPorPorcion) || 0;
    if (costoUnitario <= 0) {
        return null;
    }

    const factorFoodCost = Math.max(foodCostPct, 5) / 100;
    const precioVentaSugerido = costoUnitario / factorFoodCost;
    const utilidadPorPlato = precioVentaSugerido - costoUnitario;
    const margenBrutoPct = Math.round(((precioVentaSugerido - costoUnitario) / precioVentaSugerido) * 100);

    return {
        costoUnitario: Number(costoUnitario.toFixed(2)),
        costoLote: Number((costoUnitario * porciones).toFixed(2)),
        precioVentaSugerido: Number(precioVentaSugerido.toFixed(2)),
        ingresoLote: Number((precioVentaSugerido * porciones).toFixed(2)),
        utilidadPorPlato: Number(utilidadPorPlato.toFixed(2)),
        utilidadLote: Number((utilidadPorPlato * porciones).toFixed(2)),
        margenBrutoPct,
    };
};

