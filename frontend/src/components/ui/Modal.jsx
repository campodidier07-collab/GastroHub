import { useEffect } from 'react';

/**
 * Modal empresarial accesible (WCAG AA) con iconografía Font Awesome.
 */
const Modal = ({ abierto, alCerrar, titulo, subtitulo, children, tamano = 'md' }) => {
    useEffect(() => {
        if (!abierto) return undefined;

        document.body.style.overflow = 'hidden';

        const manejarKeyDown = (e) => {
            if (e.key === 'Escape') {
                alCerrar?.();
            }
        };

        window.addEventListener('keydown', manejarKeyDown);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', manejarKeyDown);
        };
    }, [abierto, alCerrar]);

    if (!abierto) return null;

    const anchoModal = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    }[tamano] || 'max-w-xl';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ backgroundColor: 'rgba(9, 13, 22, 0.65)', backdropFilter: 'blur(6px)' }}
            onClick={alCerrar}
        >
            <div
                className={`relative w-full ${anchoModal} tarjeta animar-entrada flex flex-col`}
                style={{
                    maxHeight: '90vh',
                    background: 'var(--bg-elevado)',
                    borderColor: 'var(--borde-fuerte)',
                    boxShadow: 'var(--sombra-lg)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="flex items-center justify-between px-6 py-4 border-b shrink-0"
                    style={{ borderColor: 'var(--borde-sutil)', background: 'var(--bg-secundario)' }}
                >
                    <div>
                        <h2 id="modal-titulo" className="text-base font-bold tracking-tight" style={{ color: 'var(--texto-primario)' }}>
                            {titulo}
                        </h2>
                        {subtitulo && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--texto-secundario)' }}>
                                {subtitulo}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={alCerrar}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                        style={{ color: 'var(--texto-secundario)', background: 'var(--bg-card)', border: '1px solid var(--borde-sutil)' }}
                        aria-label="Cerrar ventana modal"
                    >
                        <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
                    </button>
                </div>

                <div className="px-6 py-5 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
