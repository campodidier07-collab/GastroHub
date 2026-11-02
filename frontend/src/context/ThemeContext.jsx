import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const CLAVE_TEMA = 'gastrohub_theme';

export const ThemeProvider = ({ children }) => {
    const [tema, setTema] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        const guardado = window.localStorage.getItem(CLAVE_TEMA);
        if (guardado === 'dark' || guardado === 'light') return guardado;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', tema);
        if (tema === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        window.localStorage.setItem(CLAVE_TEMA, tema);
    }, [tema]);

    const alternarTema = () => {
        setTema((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ tema, esOscuro: tema === 'dark', setTema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme debe utilizarse dentro de un <ThemeProvider>');
    }
    return ctx;
};

