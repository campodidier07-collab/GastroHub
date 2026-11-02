import { useState } from 'react';

const CATEGORIAS = [
    'Entrada',
    'Plato Fuerte',
    'Postre',
    'Bebida',
    'Ensalada',
    'Sopa',
    'Snack',
    'Otro',
];

const DIFICULTADES = ['Fácil', 'Media', 'Alta'];

// ─── Sub-componente: fila de ingrediente ─────────────────────────────────────
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
            step="any"
            value={ingrediente.cantidad ?? ''}
            onChange={(e) => onCambio(indice, 'cantidad', e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="input-global"
        />
        <input
            type="text"
            placeholder="gr, ml, ud…"
            value={ingrediente.unidad || ''}
            onChange={(e) => onCambio(indice, 'unidad', e.target.value)}
            className="input-global"
        />
        <button
            type="button"
            onClick={() => onEliminar(indice)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
            style={{ background: '#fde8e8', color: '#b91c1c' }}
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
            placeholder={`Describe el paso técnico ${indice + 1}...`}
            value={paso}
            onChange={(e) => onCambio(indice, e.target.value)}
            rows={2}
            className="input-global flex-1 resize-none"
        />
        <button
            type="button"
            onClick={() => onEliminar(indice)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors mt-2 flex-shrink-0 cursor-pointer"
            style={{ background: '#fde8e8', color: '#b91c1c' }}
            title="Eliminar paso"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

const estadoInicial = {
    titulo: '',
    descripcion: '',
    categoria: 'Plato Fuerte',
    dificultad: 'Media',
    tiempo: '',
    porciones: 4,
    calorias: '',
    imagenUrl: '',
    favorito: false,
    ingredientes: [{ nombre: '', cantidad: '', unidad: '' }],
    pasos: [''],
};

const sanitizarIngrediente = (ing) => ({
    nombre: ing.nombre || '',
    ...(ing.cantidad !== undefined && ing.cantidad !== '' && !Number.isNaN(Number(ing.cantidad))
        ? { cantidad: Number(ing.cantidad) }
        : {}),
    ...(ing.unidad ? { unidad: ing.unidad } : {}),
});

/**
 * Formulario completo de GastroHub para crear o editar una ficha técnica de receta.
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
                descripcion: recetaInicial.descripcion || '',
                categoria: recetaInicial.categoria || 'Plato Fuerte',
                dificultad: recetaInicial.dificultad || 'Media',
                tiempo: recetaInicial.tiempo || '',
                porciones: recetaInicial.porciones ?? 4,
                calorias: recetaInicial.calorias ?? '',
                imagenUrl: recetaInicial.imagenUrl || '',
                favorito: Boolean(recetaInicial.favorito),
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

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formulario.titulo.trim()) {
            nuevosErrores.titulo = 'El título de la receta es obligatorio';
        }
        if (!formulario.tiempo.trim()) {
            nuevosErrores.tiempo = 'El tiempo estimado es obligatorio';
        }
        if (!formulario.porciones || Number(formulario.porciones) < 1) {
            nuevosErrores.porciones = 'Las porciones deben ser al menos 1';
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

        const datosLimpios = {
            titulo: formulario.titulo.trim(),
            descripcion: formulario.descripcion.trim(),
            categoria: formulario.categoria,
            dificultad: formulario.dificultad,
            tiempo: formulario.tiempo.trim(),
            porciones: Number(formulario.porciones) || 4,
            calorias: formulario.calorias === '' || formulario.calorias === null
                ? null
                : Number(formulario.calorias),
            imagenUrl: formulario.imagenUrl.trim(),
            favorito: Boolean(formulario.favorito),
            ingredientes: formulario.ingredientes
                .filter((ing) => ing.nombre?.trim())
                .map(sanitizarIngrediente),
            pasos: formulario.pasos.map((p) => p.trim()).filter(Boolean),
        };

        alGuardar(datosLimpios);
    };

    const manejarCampoSimple = (campo, valor) => {
        setFormulario((prev) => ({ ...prev, [campo]: valor }));
        if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }));
    };

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
            {errorExterno && (
                <div
                    className="px-4 py-3 rounded-xl text-sm"
                    style={{ background: '#fde8e8', color: '#b91c1c', border: '1px solid #f8c9c9' }}
                >
                    {errorExterno}
                </div>
            )}

            {/* Título + Favorito */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Título de la receta *
                    </label>
                    <input
                        type="text"
                        value={formulario.titulo}
                        onChange={(e) => manejarCampoSimple('titulo', e.target.value)}
                        placeholder="Ej: Risotto Cremoso de Hongos Silvestres"
                        className="input-global"
                    />
                    {errores.titulo && <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>{errores.titulo}</p>}
                </div>

                <button
                    type="button"
                    onClick={() => manejarCampoSimple('favorito', !formulario.favorito)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer"
                    style={{
                        background: formulario.favorito ? 'var(--color-ambar-claro)' : '#fff',
                        color: formulario.favorito ? '#b45309' : 'var(--color-texto-medio)',
                        borderColor: formulario.favorito ? '#f59e0b' : 'var(--color-borde)',
                    }}
                >
                    <span>{formulario.favorito ? '★' : '☆'}</span>
                    Destacar en Favoritos
                </button>
            </div>

            {/* Descripción corta */}
            <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-texto-oscuro)' }}>
                    Descripción gastronómica
                </label>
                <textarea
                    rows={2}
                    value={formulario.descripcion}
                    onChange={(e) => manejarCampoSimple('descripcion', e.target.value)}
                    placeholder="Breve reseña sensorial, notas de emplatado o maridaje recomendado..."
                    className="input-global resize-none"
                />
            </div>

            {/* Grid de Metadatos: Categoría, Dificultad, Tiempo, Porciones, Calorías */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Categoría
                    </label>
                    <select
                        value={formulario.categoria}
                        onChange={(e) => manejarCampoSimple('categoria', e.target.value)}
                        className="input-global cursor-pointer"
                    >
                        {CATEGORIAS.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Dificultad
                    </label>
                    <select
                        value={formulario.dificultad}
                        onChange={(e) => manejarCampoSimple('dificultad', e.target.value)}
                        className="input-global cursor-pointer"
                    >
                        {DIFICULTADES.map((dif) => (
                            <option key={dif} value={dif}>{dif}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Tiempo *
                    </label>
                    <input
                        type="text"
                        value={formulario.tiempo}
                        onChange={(e) => manejarCampoSimple('tiempo', e.target.value)}
                        placeholder="Ej: 35 minutos"
                        className="input-global"
                    />
                    {errores.tiempo && <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>{errores.tiempo}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Porciones
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={formulario.porciones}
                        onChange={(e) => manejarCampoSimple('porciones', e.target.value)}
                        className="input-global"
                    />
                    {errores.porciones && <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>{errores.porciones}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                        Calorías (kcal)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formulario.calorias}
                        onChange={(e) => manejarCampoSimple('calorias', e.target.value)}
                        placeholder="Ej: 450"
                        className="input-global"
                    />
                </div>
            </div>

            {/* URL de Imagen opcional */}
            <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-texto-medio)' }}>
                    URL de Fotografía del Plato (opcional)
                </label>
                <input
                    type="url"
                    value={formulario.imagenUrl}
                    onChange={(e) => manejarCampoSimple('imagenUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="input-global"
                />
            </div>

            {/* Ingredientes */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Mise en Place — Ingredientes
                    </label>
                    <button
                        type="button"
                        onClick={agregarIngrediente}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        style={{ background: 'var(--color-verde-menta)', color: 'var(--color-secundario)', fontWeight: 600 }}
                    >
                        + Añadir ingrediente
                    </button>
                </div>

                <div className="grid gap-2 mb-1" style={{ gridTemplateColumns: '1fr 6rem 6rem 2rem' }}>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-texto-medio)' }}>Ingrediente</span>
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
                {errores.ingredientes && <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>{errores.ingredientes}</p>}
            </div>

            {/* Pasos */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
                        Método de Preparación (Paso a Paso)
                    </label>
                    <button
                        type="button"
                        onClick={agregarPaso}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        style={{ background: 'var(--color-celeste)', color: '#1d5fa7', fontWeight: 600 }}
                    >
                        + Añadir paso
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
                {errores.pasos && <p className="text-xs mt-1" style={{ color: '#b91c1c' }}>{errores.pasos}</p>}
            </div>

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-3 border-t" style={{ borderColor: 'var(--color-borde)' }}>
                <button type="button" className="btn-secundario" onClick={alCancelar} disabled={cargando}>
                    Cancelar
                </button>
                <button type="submit" className="btn-primario" disabled={cargando}>
                    {cargando
                        ? 'Guardando ficha...'
                        : recetaInicial
                            ? 'Actualizar Ficha Técnica'
                            : 'Guardar Receta en GastroHub'}
                </button>
            </div>
        </form>
    );
};

export default FormularioReceta;
