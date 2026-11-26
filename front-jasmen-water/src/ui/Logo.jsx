import { useTranslation } from "react-i18next";
import KemetricsMark from "./KemetricsMark";

const SIZES = {
  small: {
    mark: "h-[34px] w-[27px]",
    name: "text-xl",
    tagline: "hidden",
  },
  medium: {
    mark: "h-[46px] w-[37px]",
    name: "text-2xl",
    tagline: "text-[11px]",
  },
  large: {
    mark: "h-[78px] w-[62px]",
    name: "text-4xl",
    tagline: "text-sm",
  },
};

function Logo({ size = "medium", stacked = false, onDark = false }) {
  const [t] = useTranslation();
  const sizing = SIZES[size];

  return (
    <div
      dir="ltr"
      className={`flex items-center gap-[10px] ${stacked ? "flex-col text-center" : ""}`}
    >
      <KemetricsMark className={sizing.mark} />
      <div className="leading-tight">
        <p
          className={`font-extrabold tracking-tight ${onDark ? "text-white" : "text-textColor"} ${sizing.name}`}
        >
          Kemetrics
        </p>
        <p
          className={`font-semibold ${onDark ? "text-sky-200" : "text-brandText"} ${sizing.tagline}`}
        >
          {t("brand.tagline")}
        </p>
      </div>
    </div>
  );
}

export default Logo;
