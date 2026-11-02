/**
 * Skeleton y estado de carga estilo Linear / Vercel.
 * Muestra tarjetas shimmer estructuradas mientras se hidrata el catálogo.
 */
const Spinner = ({ mensaje = 'Sincronizando fichas técnicas...' }) => {
    return (
        <div className="flex flex-col gap-6" role="status" aria-label={mensaje}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-4 h-4 rounded-full border-2 animate-spin"
                        style={{
                            borderColor: 'var(--borde-fuerte)',
                            borderTopColor: 'var(--color-primario)',
                        }}
                    />
                    <span className="text-xs font-medium" style={{ color: 'var(--texto-secundario)' }}>
                        {mensaje}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="tarjeta p-4 flex flex-col gap-3">
                        <div className="w-full h-36 skeleton-shimmer rounded-xl" />
                        <div className="w-2/3 h-4 skeleton-shimmer" />
                        <div className="w-full h-3 skeleton-shimmer" />
                        <div className="flex gap-2 pt-2">
                            <div className="w-16 h-6 skeleton-shimmer" />
                            <div className="w-16 h-6 skeleton-shimmer" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Spinner;
