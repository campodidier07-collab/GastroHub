import { useEffect } from 'react';

/**
 * Modal reutilizable base.
 * @param {boolean} abierto - Si el modal está visible.
 * @param {Function} alCerrar - Callback para cerrar el modal.
 * @param {string} titulo - Título del encabezado del modal.
 * @param {React.ReactNode} children - Contenido dinámico del modal.
 * @param {string} tamano - Tamaño del modal: 'sm' | 'md' | 'lg' | 'xl'.
 */
const Modal = ({ abierto, alCerrar, titulo, children, tamano = 'md' }) => {
    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (abierto) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [abierto]);

    if (!abierto) return null;

    const anchoModal = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }[tamano] || 'max-w-lg';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(61,61,61,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={alCerrar}
        >
            <div
                className={`relative w-full ${anchoModal} tarjeta animar-entrada overflow-hidden`}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Encabezado */}
                <div
                    className="flex items-center justify-between px-6 py-4 border-b"
                    style={{ borderColor: 'var(--color-borde)', background: 'var(--color-crema)' }}
                >
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        {titulo}
                    </h2>
                    <button
                        onClick={alCerrar}
                        className="p-1 rounded-lg transition-colors duration-150 hover:bg-gray-100"
                        aria-label="Cerrar modal"
                    >
                        {/* Ícono X */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido */}
                <div className="px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
