import { useEffect, useState } from "react";

export default function ThemeSelector() {
  // Initialisation de l'état avec la valeur stockée ou la préférence système
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  // Applique la classe 'dark' sur l'élément HTML racine
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-background-soft-300 bg-background-soft-100/60 p-2 transition-colors">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-soft-200">
            <svg
              className="w-4 h-4 text-foreground-soft-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground-soft-700">
              Thème
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 rounded-xl bg-background-soft-200 shadow-sm p-1">
          {/* Light */}
          <button
            onClick={() => setIsDark(false)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${!isDark ? "bg-background-soft-50 text-foreground-soft-700 hover:scale-105 shadow-sm" : "bg-transparent text-foreground-soft-500 hover:scale-90"} transition-all`}
            title="Mode clair"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </button>

          {/* Dark */}
          <button
            onClick={() => setIsDark(true)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? "bg-background-soft-50 text-foreground-soft-700 hover:scale-105 shadow-sm" : "text-foreground-soft-500 hover:scale-90"} transition-all`}
            title="Mode sombre"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
