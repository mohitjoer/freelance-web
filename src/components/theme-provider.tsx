"use client";
import React, { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, ReactNode } from "react";

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

function isValidTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

// External store so localStorage can be read without setState-in-effect
const themeStore = {
  listeners: new Set<() => void>(),
  subscribe(callback: () => void) {
    themeStore.listeners.add(callback);
    window.addEventListener("storage", callback);
    return () => {
      themeStore.listeners.delete(callback);
      window.removeEventListener("storage", callback);
    };
  },
  emit() {
    themeStore.listeners.forEach((l) => l());
  },
};

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return isValidTheme(stored) ? stored : null;
}

function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setPrefersDark(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return prefersDark;
}

export function ThemeProvider({ defaultTheme = "light", children }: { defaultTheme?: Theme; children: ReactNode }) {
  // Server/hydration snapshot is null; client snapshot reads localStorage.
  // React re-renders with the client value after hydration without warnings.
  const stored = useSyncExternalStore(
    themeStore.subscribe,
    getStoredTheme,
    () => null,
  );

  // Immediate local override so toggles update in the same tab (storage event only fires cross-tab)
  const [override, setOverride] = useState<Theme | null>(null);

  const prefersDark = usePrefersDark();

  const theme: Theme = override ?? stored ?? defaultTheme;

  // Resolved theme is derived, never stored in state
  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  // Apply class to <html> whenever resolution changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const value: ThemeContextValue = useMemo(() => {
    const setTheme = (t: Theme) => {
      localStorage.setItem(STORAGE_KEY, t);
      setOverride(t);
      themeStore.emit();
    };
    return {
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    };
  }, [theme, resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
