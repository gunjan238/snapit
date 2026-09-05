/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light";

function getInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("Snapit-theme") as Theme | null;
  return stored ?? "dark";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = getInitial();
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    try { localStorage.setItem("Snapit-theme", next); } catch {/* */}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative h-11 w-11 rounded-full border border-border bg-card/60 backdrop-blur flex items-center justify-center hover:border-primary hover:text-primary transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}