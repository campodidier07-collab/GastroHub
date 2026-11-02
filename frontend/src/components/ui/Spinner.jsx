/**
 * Spinner de carga accesible y minimalista.
 * @param {string} mensaje - Texto opcional debajo del spinner.
 */
const Spinner = ({ mensaje = 'Cargando...' }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div
                className="w-10 h-10 rounded-full border-4 animate-spin"
                style={{
                    borderColor: 'var(--color-borde)',
                    borderTopColor: 'var(--color-primario)',
                }}
                role="status"
                aria-label="Cargando"
            />
            {mensaje && (
                <p className="text-sm font-medium" style={{ color: 'var(--color-texto-medio)' }}>
                    {mensaje}
                </p>
            )}
        </div>
    );
};

export default Spinner;
