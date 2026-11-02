import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RecetaProvider } from './context/RecetaContext';
import Navbar from './components/layout/Navbar';
import InicioView from './views/Inicio/InicioView';
import CatalogoView from './views/Catalogo/CatalogoView';

/**
 * Componente raíz de la aplicación.
 * Configura el router, el proveedor global de recetas y las notificaciones toast.
 */
const App = () => {
  return (
    <BrowserRouter>
      <RecetaProvider>
        {/* Notificaciones globales */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '12px',
              border: '1px solid var(--color-borde)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-secundario)',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#c0392b',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Layout principal — flex-col para sticky footer */}
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-crema)' }}>
          <Navbar />

          {/* Área de contenido — ocupa todo el espacio sobrante */}
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<InicioView />} />
              <Route path="/catalogo" element={<CatalogoView />} />
              {/* Ruta catch-all — redirige al inicio */}
              <Route path="*" element={<InicioView />} />
            </Routes>
          </main>

          {/* Pie de página — siempre al fondo */}
          <footer
            className="text-center py-8 text-xs"
            style={{
              color: 'var(--color-texto-medio)',
              borderTop: '1px solid var(--color-borde)',
              background: '#fff',
            }}
          >
            <p>
              Sistema Cocina MERN &nbsp;·&nbsp; Desarrollado con React + Node.js + MongoDB
            </p>
          </footer>
        </div>
      </RecetaProvider>
    </BrowserRouter>
  );
};

export default App;
