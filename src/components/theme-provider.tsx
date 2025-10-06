"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Types
export type Theme = "light" | "dark" | "system";
interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "freelancebase-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

export function ThemeProvider({ defaultTheme = "light", children }: { defaultTheme?: Theme; children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolved, setResolved] = useState<"light" | "dark">(() => resolveTheme(defaultTheme));

  // Load stored preference
  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Theme | null) : null;
    if (stored) {
      setThemeState(stored);
      setResolved(resolveTheme(stored));
    } else {
      setResolved(resolveTheme(defaultTheme));
    }
  }, [defaultTheme]);

  // Listen for system changes if system theme selected
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolved(media.matches ? "dark" : "light");
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  // Apply class to <html>
  useEffect(() => {
    const root = document.documentElement;
    const currentResolved = resolveTheme(theme);
    setResolved(currentResolved);
    root.classList.remove("light", "dark");
    root.classList.add(currentResolved);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, t);
    }
  };

  const toggleTheme = () => {
    // Use resolvedTheme so first toggle from system-dark goes to light immediately.
    setTheme(resolved === "dark" ? "light" : "dark");
  };

  const value: ThemeContextValue = { theme, resolvedTheme: resolved, setTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// Prevent flash of wrong theme before hydration
export function ThemeScript() {
  const code = `(function(){try{var s='${STORAGE_KEY}';var t=localStorage.getItem(s);var d='light';var e=t&&t!=="system"?t:d;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(e);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
