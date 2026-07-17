"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "darkMode";

const applyThemeClass = (dark: boolean) => {
  document.documentElement.classList.toggle("dark", dark);
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored === "true";
    setDarkModeState(initial);
    applyThemeClass(initial);
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
    applyThemeClass(value);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
