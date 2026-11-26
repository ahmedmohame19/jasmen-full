import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function TranslationButton() {
  const { t, i18n } = useTranslation();

  const languageNow = i18n.language;

  useEffect(() => {
    if (languageNow === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
  }, [languageNow]);

  const changeLanguageAndDirection = (language) => {
    i18n.changeLanguage(language);

    if (language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else if (language === "en") {
      document.documentElement.setAttribute("dir", "ltr");
    }
  };

  const handleChange = (event) => {
    changeLanguageAndDirection(event.target.value);
  };

  return (
    <select
      title={t("descriptions.translateBtn")}
      aria-label={t("descriptions.translateBtn")}
      className="cursor-pointer rounded-xl border border-line bg-primary px-[8px] py-[6px] text-sm font-semibold text-textColor outline-none focus-visible:ring-2 focus-visible:ring-colorBrand"
      onChange={handleChange}
      value={languageNow}
    >
      <option value="en">{t("general.english")}</option>
      <option value="ar">{t("general.arabic")}</option>
    </select>
  );
}

export default TranslationButton;
