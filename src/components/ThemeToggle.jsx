import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
export default function ThemeToggle({ collapsed = false }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" || !localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return <button
    onClick={() => setDark(!dark)}
    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-all w-full"
  >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {!collapsed && (dark ? "Light Mode" : "Dark Mode")}
    </button>;
}
