import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import KemetricsMark from "../ui/KemetricsMark";

function PageNotFound() {
  const [t] = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center p-[16px] text-center text-textColor">
      <div className="surface-card flex w-full max-w-[420px] flex-col items-center gap-[14px] p-[28px]">
        <KemetricsMark className="h-[64px] w-[51px]" />
        <h1 className="text-xl font-extrabold">{t("general.notFoundPage")}</h1>
        <Link
          to={"/"}
          replace
          className="rounded-xl bg-brand-gradient px-[18px] py-[10px] font-bold text-white shadow-glow"
        >
          <span className="inline-block rtl:scale-x-[-1]">&larr;</span>{" "}
          {t("general.goBack")}
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
