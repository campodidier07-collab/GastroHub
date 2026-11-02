import { useState } from 'react';

// ─── Sub-componente: fila de ingrediente ─────────────────────────────────────
// Usa grid para alinear las columnas exactamente con el encabezado superior.
const FilaIngrediente = ({ ingrediente, indice, onCambio, onEliminar }) => (
    <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '1fr 6rem 6rem 2rem' }}>
        <input
            type="text"
            placeholder="Nombre del ingrediente"
            value={ingrediente.nombre || ''}
            onChange={(e) => onCambio(indice, 'nombre', e.target.value)}
            className="input-global"
        />
        <input
            type="number"
            placeholder="0"
            min="0"
            value={ingrediente.cantidad || ''}
            onChange={(e) => onCambio(indice, 'cantidad', parseFloat(e.target.value) || '')}
            className="input-global"
        />
        <input
            type="text"
            placeholder="gr, ml…"
            value={ingrediente.unidad || ''}
            onChange={(e) => onCambio(indice, 'unidad', e.target.value)}
            className="input-global"
        />
        <button
            type="button"
            onClick={() => onEliminar(indice)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0"
            style={{ background: '#fde8e8', color: '#c0392b' }}
            title="Eliminar ingrediente"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
);

// ─── Sub-componente: paso individual ─────────────────────────────────────────
const FilaPaso = ({ paso, indice, onCambio, onEliminar }) => (
    <div className="flex gap-2 items-start">
        <span
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-2"
            style={{ background: 'var(--color-salmon-claro)', color: 'var(--color-primario)' }}
        >
            {indice + 1}
        </span>
        <textarea
            placeholder={`Describe el paso ${indice + 1}...`}
            value={paso}
            onChange={(e) => onCambio(indice, e.target.value)}
            rows={2}
            className="input-global flex-1 resize-none"
        />
        <button
            type="button"
            onClick={() => onEliminar(indice)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors mt-2 flex-shrink-0"
            style={{ background: '#fde8e8', color: '#c0392b' }}
            title="Eliminar paso"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

// ─── Estado inicial del formulario ────────────────────────────────────────────
const estadoInicial = {
    titulo: '',
    tiempo: '',
    ingredientes: [{ nombre: '', cantidad: '', unidad: '' }],
    pasos: [''],
};

/**
 * Extrae solo los campos permitidos por la API de un objeto ingrediente.
 * Elimina _id y cualquier campo extra que pueda venir de MongoDB.
 */
const sanitizarIngrediente = (ing) => ({
    nombre: ing.nombre || '',
    ...(ing.cantidad !== undefined && ing.cantidad !== '' ? { cantidad: ing.cantidad } : {}),
    ...(ing.unidad ? { unidad: ing.unidad } : {}),
});

/**
 * Formulario dinámico para crear o editar una receta.
 * @param {Object|null} recetaInicial - Datos de la receta a editar (null si es nueva).
 * @param {Function} alGuardar - Callback con los datos listos para enviar.
 * @param {Function} alCancelar - Callback al cancelar.
 * @param {boolean} cargando - Si la operación está en progreso.
 * @param {string|null} errorExterno - Mensaje de error proveniente del backend.
 */
const FormularioReceta = ({
    recetaInicial = null,
    alGuardar,
    alCancelar,
    cargando = false,
    errorExterno = null,
}) => {
    const [formulario, setFormulario] = useState(() => {
        if (recetaInicial) {
            return {
                titulo: recetaInicial.titulo || '',
                tiempo: recetaInicial.tiempo || '',
                // Sanitizamos los ingredientes al cargar para eliminar _id de MongoDB
                ingredientes: recetaInicial.ingredientes?.length
                    ? recetaInicial.ingredientes.map(sanitizarIngrediente)
                    : [{ nombre: '', cantidad: '', unidad: '' }],
                pasos: recetaInicial.pasos?.length
                    ? recetaInicial.pasos
                    : [''],
            };
        }
        return estadoInicial;
    });

    const [errores, setErrores] = useState({});

    // ── Validación local antes de enviar ──────────────────────────────────
    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formulario.titulo.trim()) {
            nuevosErrores.titulo = 'El título es obligatorio';
        }
        if (!formulario.tiempo.trim()) {
            nuevosErrores.tiempo = 'El tiempo es obligatorio';
        }
        const ingredientesValidos = formulario.ingredientes.filter(
            (ing) => ing.nombre?.trim()
        );
        if (ingredientesValidos.length === 0) {
            nuevosErrores.ingredientes = 'Añade al menos un ingrediente con nombre';
        }
        const pasosValidos = formulario.pasos.filter((p) => p.trim());
        if (pasosValidos.length === 0) {
            nuevosErrores.pasos = 'Añade al menos un paso de preparación';
        }
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        // Sanitizamos ingredientes para enviar SOLO los campos que acepta la API:
        // nombre, cantidad (número), unidad — sin _id ni otros campos de Mongoose.
        const datosLimpios = {
            titulo: formulario.titulo.trim(),
            tiempo: formulario.tiempo.trim(),
            ingredientes: formulario.ingredientes
                .filter((ing) => ing.nombre?.trim())
                .map(sanitizarIngrediente),
            pasos: formulario.pasos.filter((p) => p.trim()),
        };

        alGuardar(datosLimpios);
    };

    // ── Manejadores de campos simples ─────────────────────────────────────
    const manejarCampoSimple = (campo, valor) => {
        setFormulario((prev) => ({ ...prev, [campo]: valor }));
        if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }));
    };

    // ── Manejadores de ingredientes ───────────────────────────────────────
    const cambiarIngrediente = (indice, campo, valor) => {
        setFormulario((prev) => {
            const actualizados = [...prev.ingredientes];
            actualizados[indice] = { ...actualizados[indice], [campo]: valor };
            return { ...prev, ingredientes: actualizados };
        });
    };

    const agregarIngrediente = () => {
        setFormulario((prev) => ({
            ...prev,
            ingredientes: [...prev.ingredientes, { nombre: '', cantidad: '', unidad: '' }],
        }));
    };

    const eliminarIngrediente = (indice) => {
        if (formulario.ingredientes.length === 1) return;
        setFormulario((prev) => ({
            ...prev,
            ingredientes: prev.ingredientes.filter((_, i) => i !== indice),
        }));
    };

    // ── Manejadores de pasos ──────────────────────────────────────────────
    const cambiarPaso = (indice, valor) => {
        setFormulario((prev) => {
            const actualizados = [...prev.pasos];
            actualizados[indice] = valor;
            return { ...prev, pasos: actualizados };
        });
    };

    const agregarPaso = () => {
        setFormulario((prev) => ({ ...prev, pasos: [...prev.pasos, ''] }));
    };

    const eliminarPaso = (indice) => {
        if (formulario.pasos.length === 1) return;
        setFormulario((prev) => ({
            ...prev,
            pasos: prev.pasos.filter((_, i) => i !== indice),
        }));
    };

    return (
        <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
            {/* Error externo del backend */}
            {errorExterno && (
                <div
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#fde8e8', color: '#c0392b', border: '1px solid #f5c6c6' }}
                >
                    {errorExterno}
                </div>
            )}

            {/* ── Título ──────────────────────────────────────────────── */}
            <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-texto-oscuro)' }}>
                    Título de la receta *
                </label>
                <input
                    type="text"
                    value={formulario.titulo}
                    onChange={(e) => manejarCampoSimple('titulo', e.target.value)}
                    placeholder="Ej: Torta de chocolate con fresas"
                    className="input-global"
                />
                {errores.titulo && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errores.titulo}</p>}
            </div>

            {/* ── Tiempo ──────────────────────────────────────────────── */}
            <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-texto-oscuro)' }}>
                    Tiempo de preparación *
                </label>
                <input
                    type="text"
                    value={formulario.tiempo}
                    onChange={(e) => manejarCampoSimple('tiempo', e.target.value)}
                    placeholder="Ej: 45 minutos"
                    className="input-global"
                />
                {errores.tiempo && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errores.tiempo}</p>}
            </div>

            {/* ── Ingredientes ─────────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Ingredientes
                    </label>
                    <button
                        type="button"
                        onClick={agregarIngrediente}
                        className="text-xs flex items-center gap-1 px-3 py-1 rounded-lg transition-colors"
                        style={{ background: 'var(--color-verde-menta)', color: '#27ae60', fontWeight: 600 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir
                    </button>
                </div>

                {/* Encabezados de columnas — mismo grid que las filas */}
                <div className="grid gap-2 mb-1" style={{ gridTemplateColumns: '1fr 6rem 6rem 2rem' }}>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Nombre</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Cantidad</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Unidad</span>
                </div>

                <div className="flex flex-col gap-2">
                    {formulario.ingredientes.map((ing, idx) => (
                        <FilaIngrediente
                            key={idx}
                            ingrediente={ing}
                            indice={idx}
                            onCambio={cambiarIngrediente}
                            onEliminar={eliminarIngrediente}
                        />
                    ))}
                </div>
                {errores.ingredientes && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errores.ingredientes}</p>}
            </div>

            {/* ── Pasos ────────────────────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Pasos de preparación
                    </label>
                    <button
                        type="button"
                        onClick={agregarPaso}
                        className="text-xs flex items-center gap-1 px-3 py-1 rounded-lg transition-colors"
                        style={{ background: 'var(--color-celeste)', color: '#2980b9', fontWeight: 600 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Añadir
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {formulario.pasos.map((paso, idx) => (
                        <FilaPaso
                            key={idx}
                            paso={paso}
                            indice={idx}
                            onCambio={cambiarPaso}
                            onEliminar={eliminarPaso}
                        />
                    ))}
                </div>
                {errores.pasos && <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{errores.pasos}</p>}
            </div>

            {/* ── Acciones del formulario ──────────────────────────────── */}
            <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: 'var(--color-borde)' }}>
                <button type="button" className="btn-secundario" onClick={alCancelar} disabled={cargando}>
                    Cancelar
                </button>
                <button type="submit" className="btn-primario" disabled={cargando}>
                    {cargando ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {recetaInicial ? 'Actualizar receta' : 'Guardar receta'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default FormularioReceta;
