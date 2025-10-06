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
  const [mounted, setMounted] = useState(false);

  // Mark as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load stored preference
  useEffect(() => {
    if (!mounted) return;

    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
      setThemeState(stored);
      const newResolved = resolveTheme(stored);
      setResolved(newResolved);

      // Immediately apply to DOM
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newResolved);
    }
  }, [mounted]);

  // Listen for system changes if system theme selected
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const newResolved = media.matches ? "dark" : "light";
      setResolved(newResolved);

      // Apply to DOM immediately
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newResolved);
    };

    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme, mounted]);

  // Apply class to <html>
  useEffect(() => {
    if (!mounted) return;

    const currentResolved = resolveTheme(theme);
    setResolved(currentResolved);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(currentResolved);

    // Debug log
    console.log("Theme applied:", currentResolved, "Classes:", root.classList.toString());
  }, [theme, mounted]);

  const setTheme = (t: Theme) => {
    if (!mounted) return;

    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);

    // Force immediate DOM update
    const newResolved = resolveTheme(t);
    setResolved(newResolved);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newResolved);
  };

  const toggleTheme = () => {
    if (!mounted) return;

    // Use resolvedTheme so first toggle from system-dark goes to light immediately.
    const newTheme = resolved === "dark" ? "light" : "dark";
    setTheme(newTheme);
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
  const code = `(function(){try{var s='${STORAGE_KEY}';var t=localStorage.getItem(s);var d='light';var e=t&&t!=="system"?t:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(e);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
