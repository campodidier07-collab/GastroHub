import Modal from './Modal';

/**
 * Modal de confirmación para acciones destructivas con Font Awesome.
 */
const ConfirmacionModal = ({
    abierto,
    alCerrar,
    alConfirmar,
    titulo = 'Confirmar eliminación',
    mensaje = 'Esta acción eliminará permanentemente el registro y no se puede deshacer.',
    cargando = false,
}) => {
    return (
        <Modal abierto={abierto} alCerrar={alCerrar} titulo={titulo} tamano="sm">
            <div className="flex flex-col items-center text-center gap-4 py-2">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                        background: 'var(--color-error-bg)',
                        color: 'var(--color-error)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                >
                    <i className="fa-solid fa-triangle-exclamation text-lg" aria-hidden="true" />
                </div>

                <p className="text-sm leading-relaxed" style={{ color: 'var(--texto-secundario)' }}>
                    {mensaje}
                </p>

                <div className="flex items-center gap-3 pt-3 w-full justify-end border-t" style={{ borderColor: 'var(--borde-sutil)' }}>
                    <button type="button" className="btn-secundario" onClick={alCerrar} disabled={cargando}>
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn-peligro px-4 py-2 text-xs font-semibold"
                        style={{ padding: '0.55rem 1.1rem', fontSize: '0.8125rem' }}
                        onClick={alConfirmar}
                        disabled={cargando}
                    >
                        <i className="fa-solid fa-trash-can text-xs" aria-hidden="true" />
                        <span>{cargando ? 'Eliminando...' : 'Confirmar eliminación'}</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmacionModal;
