import { useTranslation } from "react-i18next";
import { AiOutlineBars } from "react-icons/ai";

function ToggleSidebar({ toggleSidebar }) {
  const [t] = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={t("general.toggleMenu")}
      className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-primary text-xl md:hidden"
    >
      <AiOutlineBars aria-hidden="true" />
    </button>
  );
}

export default ToggleSidebar;
