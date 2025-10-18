"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted flag after first client render to avoid setState during render.
  useEffect(() => {
    setMounted(true);
  }, []);

  const icon = resolvedTheme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />;

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="transition-colors cursor-pointer"
      type="button"
    >
      {mounted ? icon : <Moon className="size-5" />}
    </Button>
  );
}
