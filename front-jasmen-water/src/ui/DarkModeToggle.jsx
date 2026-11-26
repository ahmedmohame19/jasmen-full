import { useTranslation } from "react-i18next";
import { useDarkMode } from "../context/DarkModeContext";

function DarkModeToggle() {
  const [t] = useTranslation();
  const { theme, themes, setTheme } = useDarkMode();

  return (
    <select
      aria-label={t("theme.label")}
      title={t("descriptions.toggleLightAndDark")}
      className="cursor-pointer rounded-xl border border-line bg-primary px-[8px] py-[6px] text-sm font-semibold text-textColor outline-none focus-visible:ring-2 focus-visible:ring-colorBrand"
      value={theme}
      onChange={(event) => setTheme(event.target.value)}
    >
      {themes.map(({ id, labelKey }) => (
        <option key={id} value={id}>
          {t(labelKey)}
        </option>
      ))}
    </select>
  );
}

export default DarkModeToggle;
