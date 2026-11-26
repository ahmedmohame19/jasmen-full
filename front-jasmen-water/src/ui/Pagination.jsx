import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const PAGE_SIZE = 7;

function Pagination({ count, pageCount }) {
  const [t] = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedPage = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  function nextPage() {
    const next = Math.min(currentPage + 1, pageCount);
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  function previousPage() {
    const prev = Math.max(currentPage - 1, 1);
    searchParams.set("page", prev);
    setSearchParams(searchParams);
  }

  if (pageCount <= 1) return null;

  return (
    <div className={"surface-card flex items-center justify-between p-[10px]"}>
      <p className="flex gap-[4px]">
        {t("general.showing")}{" "}
        <span> {(currentPage - 1) * PAGE_SIZE + 1} </span> {t("general.to")}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>
        {t("general.of")} <span>{count}</span>
        {t("general.results")}
      </p>

      <div className={"flex items-center justify-between gap-[20px]"}>
        <button
          className={`flex items-center justify-between gap-[5px] ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
          onClick={previousPage}
          type="button"
          disabled={currentPage <= 1}
        >
          <MdKeyboardArrowLeft className="text-2xl rtl:scale-[-1]" />
          <span>{t("general.previous")}</span>
        </button>

        <button
          className={`flex items-center justify-between gap-[5px] ${currentPage === pageCount ? "cursor-not-allowed" : ""}`}
          onClick={nextPage}
          type="button"
          disabled={currentPage >= pageCount}
        >
          <span>{t("general.next")}</span>
          <MdKeyboardArrowRight className="text-2xl rtl:scale-[-1]" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
