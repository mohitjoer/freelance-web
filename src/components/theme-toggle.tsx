"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="transition-colors cursor-pointer"
      type="button"
    >
      <span className="relative block size-5">
        <Sun
          className={`absolute inset-0 size-5 transition duration-300 ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 size-5 transition duration-300 ${
            isDark ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
      </span>
    </Button>
  );
}
