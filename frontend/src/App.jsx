import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { RecetaProvider, useRecetas } from './context/RecetaContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import InicioView from './views/Inicio/InicioView';
import DashboardView from './views/Dashboard/DashboardView';
import CatalogoView from './views/Catalogo/CatalogoView';
import Modal from './components/ui/Modal';
import FormularioReceta from './components/recetas/FormularioReceta';

/**
 * Shell interno con Sidebar colapsable, Navbar premium, rutas SaaS y modal global de creación.
 */
const AppShell = () => {
    const [sidebarColapsada, setSidebarColapsada] = useState(false);
    const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
    const [modalGlobalCrear, setModalGlobalCrear] = useState(false);
    const [guardandoGlobal, setGuardandoGlobal] = useState(false);
    const [errorGlobalForm, setErrorGlobalForm] = useState(null);

    const { agregarReceta } = useRecetas();

    const manejarCrearGlobal = async (datos) => {
        setGuardandoGlobal(true);
        setErrorGlobalForm(null);
        try {
            await agregarReceta(datos);
            setModalGlobalCrear(false);
            toast.success('Ficha técnica publicada en GastroHub');
        } catch (err) {
            setErrorGlobalForm(err?.response?.data?.error || 'Error al registrar la receta');
        } finally {
            setGuardandoGlobal(false);
        }
    };

    return (
        <div
            className="min-h-screen flex w-full"
            style={{ background: 'var(--bg-principal)', color: 'var(--texto-primario)' }}
        >
            {/* Sidebar Lateral Colapsable */}
            <Sidebar
                colapsada={sidebarColapsada}
                alAlternarColapso={() => setSidebarColapsada((prev) => !prev)}
                movilAbierta={menuMovilAbierto}
                alCerrarMovil={() => setMenuMovilAbierto(false)}
            />

            {/* Columna Principal: Navbar + Contenido + Footer */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar
                    alAbrirMenuMovil={() => setMenuMovilAbierto(true)}
                    alAbrirCrearReceta={() => {
                        setErrorGlobalForm(null);
                        setModalGlobalCrear(true);
                    }}
                />

                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<InicioView />} />
                        <Route path="/dashboard" element={<DashboardView />} />
                        <Route path="/catalogo" element={<CatalogoView />} />
                        <Route path="*" element={<DashboardView />} />
                    </Routes>
                </main>

                <footer
                    className="py-5 px-6 text-xs border-t"
                    style={{
                        color: 'var(--texto-muted)',
                        borderColor: 'var(--borde-sutil)',
                        background: 'var(--bg-secundario)',
                    }}
                >
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="font-semibold" style={{ color: 'var(--texto-secundario)' }}>
                            GastroHub Enterprise · Culinary Management SaaS
                        </span>
                        <span>
                            Desarrollado por <strong style={{ color: 'var(--texto-primario)' }}>Didier Puentes</strong> · MongoDB · Express · React 19 · Tailwind v4
                        </span>
                    </div>
                </footer>
            </div>

            {/* Modal Global para crear receta desde cualquier vista */}
            <Modal
                abierto={modalGlobalCrear}
                alCerrar={() => setModalGlobalCrear(false)}
                titulo="Registrar Nueva Ficha Técnica"
                subtitulo="Disponible globalmente desde cualquier módulo de GastroHub"
                tamano="lg"
            >
                <FormularioReceta
                    alGuardar={manejarCrearGlobal}
                    alCancelar={() => setModalGlobalCrear(false)}
                    cargando={guardandoGlobal}
                    errorExterno={errorGlobalForm}
                />
            </Modal>
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <RecetaProvider>
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 3200,
                            style: {
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '0.8125rem',
                                borderRadius: '12px',
                                background: 'var(--bg-elevado)',
                                color: 'var(--texto-primario)',
                                border: '1px solid var(--borde-fuerte)',
                                boxShadow: 'var(--sombra-lg)',
                            },
                        }}
                    />
                    <AppShell />
                </RecetaProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
