"use client";

import { useEffect, useState } from "react";
import { applyTheme, getStoredThemeChoice, type ThemeChoice } from "@/lib/theme";

const OPTIONS: { value: ThemeChoice; label: string }[] = [
  { value: "light", label: "ライト" },
  { value: "dark", label: "ダーク" },
  { value: "system", label: "システムに合わせる" },
];

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => {
    setChoice(getStoredThemeChoice());

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (getStoredThemeChoice() === "system") applyTheme("system");
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  function handleSelect(value: ThemeChoice) {
    setChoice(value);
    applyTheme(value);
  }

  return (
    <div className="flex gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleSelect(opt.value)}
          className={`flex-1 rounded px-2 py-1.5 text-xs ${
            choice === opt.value
              ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-700 dark:text-emerald-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
