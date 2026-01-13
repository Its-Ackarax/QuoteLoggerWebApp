import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [palette, setPalette] = useState(() => {
    const saved = localStorage.getItem('quoteLoggerPalette') || 'mutedLinen';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-palette', saved);
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem('quoteLoggerPalette', palette);
    document.documentElement.setAttribute('data-palette', palette);
  }, [palette]);

  const togglePalette = () => {
    setPalette(prev => {
      if (prev === 'mutedLinen') return 'warmOat';
      if (prev === 'warmOat') return 'blushParchment';
      return 'mutedLinen';
    });
  };

  return (
    <ThemeContext.Provider value={{ palette, togglePalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

