
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = 'theme-neocyber' | 'theme-starlight' | 'theme-crimson-flare';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('theme-neocyber');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('app-theme') as Theme;
    if (storedTheme && ['theme-neocyber', 'theme-starlight', 'theme-crimson-flare'].includes(storedTheme)) {
      setThemeState(storedTheme);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(theme);
    }
  }, [theme, isMounted]);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
