export const THEMES = [
  { id: "light", colorScheme: "light", labelKey: "theme.light" },
  { id: "dark", colorScheme: "dark", labelKey: "theme.dark" },
  { id: "ocean", colorScheme: "dark", labelKey: "theme.ocean" },
];

export const THEME_STORAGE_KEY = "theme";
export const LEGACY_DARK_MODE_STORAGE_KEY = "isDarkMode";

export function isKnownTheme(themeId) {
  return THEMES.some((theme) => theme.id === themeId);
}

export function getThemeDefinition(themeId) {
  return THEMES.find((theme) => theme.id === themeId) ?? THEMES[0];
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readLegacyDarkMode() {
  try {
    return JSON.parse(localStorage.getItem(LEGACY_DARK_MODE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function getInitialTheme() {
  const legacyDarkMode = readLegacyDarkMode();
  if (legacyDarkMode === null) return getSystemTheme();
  return legacyDarkMode ? "dark" : "light";
}
