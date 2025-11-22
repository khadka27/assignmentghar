"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  // Initialize theme from localStorage/system preference
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) return stored;

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  });

  const [mounted, setMounted] = useState(false);

  // Set mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync DOM class whenever theme changes
  useEffect(() => {
    if (!mounted) return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme, mounted };
}
