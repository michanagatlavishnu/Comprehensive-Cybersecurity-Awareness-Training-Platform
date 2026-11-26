import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] transition hover:scale-105 hover:border-[var(--primary)]"
    >
      {isDark ? (
        <Sun className="text-yellow-400" size={18} />
      ) : (
        <MoonStar className="text-violet-500" size={18} />
      )}
    </button>
  );
}