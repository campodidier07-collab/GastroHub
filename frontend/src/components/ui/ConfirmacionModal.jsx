import Modal from './Modal';

/**
 * Modal de confirmación para acciones destructivas.
 * @param {boolean} abierto - Visibilidad del modal.
 * @param {Function} alCerrar - Callback al cancelar.
 * @param {Function} alConfirmar - Callback al confirmar.
 * @param {string} titulo - Título del modal.
 * @param {string} mensaje - Mensaje descriptivo de la acción.
 * @param {boolean} cargando - Si la acción está en progreso.
 */
const ConfirmacionModal = ({
    abierto,
    alCerrar,
    alConfirmar,
    titulo = '¿Estás seguro?',
    mensaje = 'Esta acción no se puede deshacer.',
    cargando = false,
}) => {
    return (
        <Modal abierto={abierto} alCerrar={alCerrar} titulo={titulo} tamano="sm">
            {/* Ícono de advertencia */}
            <div className="flex flex-col items-center text-center gap-4">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: '#fde8e8' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#c0392b" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-texto-medio)' }}>
                    {mensaje}
                </p>

                <div className="flex gap-3 pt-2 w-full justify-center">
                    <button className="btn-secundario" onClick={alCerrar} disabled={cargando}>
                        Cancelar
                    </button>
                    <button
                        className="btn-peligro px-5 py-2 text-sm font-semibold rounded-xl"
                        style={{ fontSize: '0.875rem', padding: '0.55rem 1.25rem' }}
                        onClick={alConfirmar}
                        disabled={cargando}
                    >
                        {cargando ? 'Eliminando...' : 'Sí, eliminar'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmacionModal;
