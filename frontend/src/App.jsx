import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RecetaProvider } from './context/RecetaContext';
import Navbar from './components/layout/Navbar';
import InicioView from './views/Inicio/InicioView';
import CatalogoView from './views/Catalogo/CatalogoView';

/**
 * Componente raíz de GastroHub.
 * Configura el router, el proveedor global de recetas y las notificaciones toast.
 */
const App = () => {
    return (
        <BrowserRouter>
            <RecetaProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.875rem',
                            borderRadius: '12px',
                            border: '1px solid var(--color-borde)',
                            boxShadow: '0 6px 24px rgba(31, 29, 26, 0.10)',
                        },
                        success: {
                            iconTheme: {
                                primary: 'var(--color-secundario)',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#b91c1c',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-crema)' }}>
                    <Navbar />

                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<InicioView />} />
                            <Route path="/catalogo" element={<CatalogoView />} />
                            <Route path="*" element={<InicioView />} />
                        </Routes>
                    </main>

                    <footer
                        className="py-8 px-4 text-xs"
                        style={{
                            color: 'var(--color-texto-medio)',
                            borderTop: '1px solid var(--color-borde)',
                            background: '#fff',
                        }}
                    >
                        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--color-texto-oscuro)' }}>
                                <span>🍽️ GastroHub</span>
                                <span style={{ color: 'var(--color-borde)' }}>•</span>
                                <span className="font-normal" style={{ color: 'var(--color-texto-medio)' }}>
                                    Plataforma de Gestión Culinaria & Recetario Digital
                                </span>
                            </div>
                            <p>
                                Desarrollado por <strong style={{ color: 'var(--color-texto-oscuro)' }}>Didier Puentes</strong> &nbsp;·&nbsp; MongoDB · Express · React 19 · Node.js
                            </p>
                        </div>
                    </footer>
                </div>
            </RecetaProvider>
        </BrowserRouter>
    );
};

export default App;
