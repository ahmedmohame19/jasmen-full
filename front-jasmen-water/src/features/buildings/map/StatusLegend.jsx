import { useTranslation } from "react-i18next";
import { STATUS_PRIORITY } from "../../../utils/unitStatus";
import StatusBadge from "./StatusBadge";

function StatusLegend() {
  const [t] = useTranslation();

  return (
    <section
      aria-label={t("map.legend.title")}
      className="surface-card p-[14px]"
    >
      <h2 className="mb-[10px] text-sm font-extrabold">
        {t("map.legend.title")}
      </h2>
      <ul className="grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_PRIORITY.map((status) => (
          <li key={status} className="flex flex-col items-start gap-[4px]">
            <StatusBadge status={status} />
            <span className="text-xs text-mutedText">
              {t(`map.legend.${status}`)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default StatusLegend;
