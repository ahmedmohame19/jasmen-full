import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import {
  getInitialTheme,
  getThemeDefinition,
  isKnownTheme,
  THEME_STORAGE_KEY,
  THEMES,
} from "./themes";

const DarkModeContext = createContext(undefined);

function DarkModeProvider({ children }) {
  const [storedTheme, setTheme] = useLocalStorageState(
    getInitialTheme(),
    THEME_STORAGE_KEY,
  );

  const theme = getThemeDefinition(
    isKnownTheme(storedTheme) ? storedTheme : "",
  );
  const isDarkMode = theme.colorScheme === "dark";

  useLayoutEffect(() => {
    const root = document.documentElement;
    THEMES.forEach(({ id }) => root.classList.remove(`theme-${id}`));
    root.classList.add(`theme-${theme.id}`);
    root.setAttribute("data-color-scheme", theme.colorScheme);
  }, [theme]);

  const toggleDarkMode = useCallback(() => {
    setTheme((currentTheme) =>
      getThemeDefinition(currentTheme).colorScheme === "dark"
        ? "light"
        : "dark",
    );
  }, [setTheme]);

  const value = useMemo(
    () => ({
      theme: theme.id,
      themes: THEMES,
      setTheme,
      isDarkMode,
      toggleDarkMode,
    }),
    [theme.id, setTheme, isDarkMode, toggleDarkMode],
  );

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("Dark Mode Context Was Used OutSide Dark Mode Provider");
  }
  return context;
}

export { useDarkMode, DarkModeProvider };
