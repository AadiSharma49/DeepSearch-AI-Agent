"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <>
      {/* Desktop hover zone */}
      <div
        className="hidden sm:block fixed left-0 top-0 h-full w-3 z-40"
        onMouseEnter={() => setVisible(true)}
      />

      {/* Toggle Button */}
      <div
        onMouseLeave={() => setVisible(false)}
        className={`
          fixed z-50
          left-2 sm:left-4
          top-1/2 -translate-y-1/2
          transition-all duration-300 ease-out

          ${
            visible
              ? "sm:translate-x-0 sm:opacity-100"
              : "sm:-translate-x-6 sm:opacity-70"
          }

          opacity-100 translate-x-0
        `}
      >
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="
            w-9 h-9 sm:w-10 sm:h-10
            flex items-center justify-center
            rounded-full
            border
            bg-white text-black border-black
            dark:bg-black dark:text-white dark:border-white
            hover:bg-black hover:text-white
            dark:hover:bg-white dark:hover:text-black
            cursor-pointer
            transition-colors duration-300
            shadow-md
            text-sm sm:text-base
          "
          aria-label="Toggle theme"
        >
          {isDark ? "☀" : "🌙"}
        </button>
      </div>
    </>
  );
}
