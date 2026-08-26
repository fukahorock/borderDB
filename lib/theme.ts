// app/layout.tsx の THEME_INIT_SCRIPT 内のキー名と一致させること。
export const THEME_STORAGE_KEY = "theme";

export type ThemeChoice = "light" | "dark" | "system";

function prefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredThemeChoice(): ThemeChoice {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || stored === "light" ? stored : "system";
}

export function applyTheme(choice: ThemeChoice): void {
  if (choice === "system") {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
  }
  const isDark = choice === "dark" || (choice === "system" && prefersDark());
  document.documentElement.classList.toggle("dark", isDark);
}
