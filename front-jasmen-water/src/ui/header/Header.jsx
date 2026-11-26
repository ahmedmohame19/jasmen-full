import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { useUser } from "../../features/authentication/useUser";
import { useTranslation } from "react-i18next";

import DarkModeToggle from "../DarkModeToggle";
import TranslationButton from "./TranslationButton";
import ToggleSidebar from "./ToggleSidebar";
import ConnectionIndicator from "./ConnectionIndicator";

function Header({ toggleSidebar }) {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { type } = useUser();

  return (
    <header className="flex h-[70px] items-center justify-between border-b border-line bg-glass px-[10px] shadow-card backdrop-blur-xl md:px-[20px]">
      <div className="flex items-center gap-[10px] md:gap-[20px]">
        <ToggleSidebar toggleSidebar={toggleSidebar} />
      </div>
      <div className="flex items-center justify-center gap-[10px] md:gap-[20px]">
        <ConnectionIndicator />
        <TranslationButton />
        <DarkModeToggle />

        {type && (
          <button
            type="button"
            title={t("descriptions.adminIcon")}
            aria-label={t("descriptions.adminIcon")}
            className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-brand-gradient text-lg text-white shadow-glow transition-transform hover:scale-105"
            onClick={() => navigate("/account")}
          >
            <CiUser aria-hidden="true" />
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
