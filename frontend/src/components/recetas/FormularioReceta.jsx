import { useState } from 'react';
import {
    Utensils,
    Clock,
    Users,
    Flame,
    Image,
    Star,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Layers,
    FileText,
    ListOrdered,
} from 'lucide-react';

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

const FilaIngrediente = ({ ingrediente, indice, onCambio, onEliminar, puedeEliminar }) => (
    <div className="grid gap-2 items-center" style={{ gridTemplateColumns: '1fr 6rem 6rem 2.25rem' }}>
        <input
            type="text"
            placeholder="Ej: Arroz Arbóreo, Salmón fresco..."
            value={ingrediente.nombre || ''}
            onChange={(e) => onCambio(indice, 'nombre', e.target.value)}
            aria-label={`Nombre del ingrediente ${indice + 1}`}
            className="input-global"
        />
        <input
            type="number"
            placeholder="0"
            min="0"
            step="any"
            value={ingrediente.cantidad ?? ''}
            onChange={(e) => onCambio(indice, 'cantidad', e.target.value === '' ? '' : parseFloat(e.target.value))}
            aria-label={`Cantidad del ingrediente ${indice + 1}`}
            className="input-global font-mono-num"
        />
        <input
            type="text"
            placeholder="gr, ml, ud"
            value={ingrediente.unidad || ''}
            onChange={(e) => onCambio(indice, 'unidad', e.target.value)}
            aria-label={`Unidad del ingrediente ${indice + 1}`}
            className="input-global"
        />
        <button
            type="button"
            onClick={() => onEliminar(indice)}
            disabled={!puedeEliminar}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-35 cursor-pointer"
            style={{
                background: 'var(--color-error-bg)',
                color: 'var(--color-error-texto)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
            title="Eliminar insumo"
            aria-label={`Eliminar ingrediente ${indice + 1}`}
        >
            <Trash2 className="w-4 h-4" />
        </button>
    </div>
);

const FilaPaso = ({ paso, indice, onCambio, onEliminar, puedeEliminar }) => (
    <div className="flex gap-2.5 items-start">
        <span
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono-num font-bold mt-1.5 border"
            style={{
                background: 'var(--color-primario-suave)',
                color: 'var(--color-primario)',
                borderColor: 'rgba(234, 88, 12, 0.25)',
            }}
        >
            {indice + 1}
        </span>
        <textarea
            placeholder={`Describe con precisión técnica el paso ${indice + 1}...`}
            value={paso}
            onChange={(e) => onCambio(indice, e.target.value)}
            rows={2}
            aria-label={`Paso de preparación ${indice + 1}`}
            className="input-global flex-1 resize-none"
        />
        <button
            type="button"
            onClick={() => onEliminar(indice)}
            disabled={!puedeEliminar}
            className="w-9 h-9 rounded-lg flex items-center justify-center mt-1.5 shrink-0 transition-colors disabled:opacity-35 cursor-pointer"
            style={{
                background: 'var(--color-error-bg)',
                color: 'var(--color-error-texto)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
            title="Eliminar paso"
            aria-label={`Eliminar paso ${indice + 1}`}
        >
            <Trash2 className="w-4 h-4" />
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
 * Formulario de nivel empresarial con validaciones reactivas,
 * ayuda contextual, estados Focus/Error/Success e íconos Lucide.
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
            nuevosErrores.titulo = 'Ingresa el nombre oficial del plato';
        }
        if (!formulario.tiempo.trim()) {
            nuevosErrores.tiempo = 'Indica el tiempo estimado (ej. 35 minutos)';
        }
        if (!formulario.porciones || Number(formulario.porciones) < 1) {
            nuevosErrores.porciones = 'Mínimo 1 porción';
        }
        const ingredientesValidos = formulario.ingredientes.filter((ing) => ing.nombre?.trim());
        if (ingredientesValidos.length === 0) {
            nuevosErrores.ingredientes = 'Registra al menos un ingrediente con nombre';
        }
        const pasosValidos = formulario.pasos.filter((p) => p.trim());
        if (pasosValidos.length === 0) {
            nuevosErrores.pasos = 'Documenta al menos un paso de preparación';
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
        if (errores.ingredientes) setErrores((prev) => ({ ...prev, ingredientes: undefined }));
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
        if (errores.pasos) setErrores((prev) => ({ ...prev, pasos: undefined }));
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
        <form onSubmit={manejarEnvio} className="flex flex-col gap-5" noValidate>
            {errorExterno && (
                <div
                    role="alert"
                    className="p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 border"
                    style={{
                        background: 'var(--color-error-bg)',
                        color: 'var(--color-error-texto)',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                    }}
                >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorExterno}</span>
                </div>
            )}

            {/* Sección 1: Identidad del Plato */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="flex-1 w-full">
                    <label
                        htmlFor="campo-titulo"
                        className="flex items-center justify-between text-xs font-semibold mb-1.5"
                        style={{ color: 'var(--texto-primario)' }}
                    >
                        <span className="flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5" style={{ color: 'var(--color-primario)' }} />
                            Nombre del Plato *
                        </span>
                        {formulario.titulo.trim().length > 3 && !errores.titulo && (
                            <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--color-exito-texto)' }}>
                                <CheckCircle2 className="w-3 h-3" /> Válido
                            </span>
                        )}
                    </label>
                    <input
                        id="campo-titulo"
                        type="text"
                        value={formulario.titulo}
                        onChange={(e) => manejarCampoSimple('titulo', e.target.value)}
                        placeholder="Ej: Risotto Cremoso de Hongos Silvestres y Trufa"
                        className={`input-global ${errores.titulo ? 'input-error' : ''}`}
                    />
                    {errores.titulo && (
                        <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: 'var(--color-error-texto)' }}>
                            <AlertCircle className="w-3 h-3" /> {errores.titulo}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => manejarCampoSimple('favorito', !formulario.favorito)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    style={{
                        background: formulario.favorito ? 'var(--color-advertencia-bg)' : 'var(--bg-secundario)',
                        color: formulario.favorito ? 'var(--color-advertencia-texto)' : 'var(--texto-secundario)',
                        borderColor: formulario.favorito ? 'rgba(245, 158, 11, 0.35)' : 'var(--borde-sutil)',
                    }}
                >
                    <Star className={`w-4 h-4 ${formulario.favorito ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>Plato Favorito</span>
                </button>
            </div>

            {/* Descripción */}
            <div>
                <label
                    htmlFor="campo-descripcion"
                    className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
                    style={{ color: 'var(--texto-primario)' }}
                >
                    <FileText className="w-3.5 h-3.5" style={{ color: 'var(--texto-muted)' }} />
                    <span>Resumen Sensorial y Notas de Emplatado</span>
                </label>
                <textarea
                    id="campo-descripcion"
                    rows={2}
                    value={formulario.descripcion}
                    onChange={(e) => manejarCampoSimple('descripcion', e.target.value)}
                    placeholder="Describe perfil aromático, textura final o guarnición recomendada..."
                    className="input-global resize-none"
                />
            </div>

            {/* Sección 2: Parámetros Técnicos */}
            <div
                className="p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                style={{ background: 'var(--bg-secundario)', borderColor: 'var(--borde-sutil)' }}
            >
                <div>
                    <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--texto-secundario)' }}>
                        <Layers className="w-3.5 h-3.5" />
                        <span>Partida</span>
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
                    <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--texto-secundario)' }}>
                        <span>Complejidad</span>
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
                    <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--texto-secundario)' }}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Tiempo *</span>
                    </label>
                    <input
                        type="text"
                        value={formulario.tiempo}
                        onChange={(e) => manejarCampoSimple('tiempo', e.target.value)}
                        placeholder="Ej: 40 minutos"
                        className={`input-global ${errores.tiempo ? 'input-error' : ''}`}
                    />
                    {errores.tiempo && (
                        <p className="text-[11px] mt-1" style={{ color: 'var(--color-error-texto)' }}>{errores.tiempo}</p>
                    )}
                </div>

                <div>
                    <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--texto-secundario)' }}>
                        <Users className="w-3.5 h-3.5" />
                        <span>Porciones base</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={formulario.porciones}
                        onChange={(e) => manejarCampoSimple('porciones', e.target.value)}
                        className="input-global font-mono-num"
                    />
                </div>

                <div>
                    <label className="flex items-center gap-1 text-xs font-semibold mb-1.5" style={{ color: 'var(--texto-secundario)' }}>
                        <Flame className="w-3.5 h-3.5" />
                        <span>Energía (kcal)</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formulario.calorias}
                        onChange={(e) => manejarCampoSimple('calorias', e.target.value)}
                        placeholder="Ej: 520"
                        className="input-global font-mono-num"
                    />
                </div>
            </div>

            {/* Imagen URL */}
            <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'var(--texto-primario)' }}>
                    <Image className="w-3.5 h-3.5" style={{ color: 'var(--texto-muted)' }} />
                    <span>URL de Fotografía de Referencia (opcional)</span>
                </label>
                <input
                    type="url"
                    value={formulario.imagenUrl}
                    onChange={(e) => manejarCampoSimple('imagenUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="input-global"
                />
            </div>

            {/* Sección 3: Ingredientes */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <label className="text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                            Mise en Place — Insumos y Cantidades *
                        </label>
                        <p className="text-[11px]" style={{ color: 'var(--texto-muted)' }}>
                            Las cantidades numéricas se escalarán automáticamente según las porciones.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={agregarIngrediente}
                        className="btn-ver"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir insumo</span>
                    </button>
                </div>

                <div className="grid gap-2 mb-1.5 px-0.5" style={{ gridTemplateColumns: '1fr 6rem 6rem 2.25rem' }}>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--texto-muted)' }}>Insumo</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--texto-muted)' }}>Cantidad</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--texto-muted)' }}>Unidad</span>
                </div>

                <div className="flex flex-col gap-2">
                    {formulario.ingredientes.map((ing, idx) => (
                        <FilaIngrediente
                            key={idx}
                            ingrediente={ing}
                            indice={idx}
                            onCambio={cambiarIngrediente}
                            onEliminar={eliminarIngrediente}
                            puedeEliminar={formulario.ingredientes.length > 1}
                        />
                    ))}
                </div>
                {errores.ingredientes && (
                    <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--color-error-texto)' }}>
                        <AlertCircle className="w-3.5 h-3.5" /> {errores.ingredientes}
                    </p>
                )}
            </div>

            {/* Sección 4: Pasos */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--texto-primario)' }}>
                        <ListOrdered className="w-3.5 h-3.5" style={{ color: 'var(--color-primario)' }} />
                        <span>Protocolo de Preparación (Paso a Paso) *</span>
                    </label>
                    <button
                        type="button"
                        onClick={agregarPaso}
                        className="btn-editar"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir paso</span>
                    </button>
                </div>
                <div className="flex flex-col gap-2.5">
                    {formulario.pasos.map((paso, idx) => (
                        <FilaPaso
                            key={idx}
                            paso={paso}
                            indice={idx}
                            onCambio={cambiarPaso}
                            onEliminar={eliminarPaso}
                            puedeEliminar={formulario.pasos.length > 1}
                        />
                    ))}
                </div>
                {errores.pasos && (
                    <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: 'var(--color-error-texto)' }}>
                        <AlertCircle className="w-3.5 h-3.5" /> {errores.pasos}
                    </p>
                )}
            </div>

            {/* Footer del Formulario */}
            <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--borde-sutil)' }}>
                <button type="button" className="btn-secundario" onClick={alCancelar} disabled={cargando}>
                    Cancelar
                </button>
                <button type="submit" className="btn-primario" disabled={cargando}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                        {cargando
                            ? 'Sincronizando...'
                            : recetaInicial
                                ? 'Guardar Cambios'
                                : 'Publicar Ficha Técnica'}
                    </span>
                </button>
            </div>
        </form>
    );
};

export default FormularioReceta;
