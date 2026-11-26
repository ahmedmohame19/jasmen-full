import { useTranslation } from "react-i18next";
import { STATUS_VISUALS } from "./statusVisuals";

function StatusBadge({
  status,
  count,
  detail,
  outlined = false,
  compact = false,
}) {
  const [t] = useTranslation();
  const { Icon, surface } = STATUS_VISUALS[status];
  const label = t(`map.status.${status}`);

  const appearance = outlined ? "border border-current" : surface;
  const size = compact
    ? "px-[8px] py-[2px] text-[11px]"
    : "px-[10px] py-[3px] text-xs";

  return (
    <span
      className={`inline-flex items-center gap-[6px] whitespace-nowrap rounded-full font-semibold ${size} ${appearance}`}
    >
      <Icon aria-hidden="true" />
      <span>{detail ? `${label} · ${detail}` : label}</span>
      {count !== undefined && <span>{count}</span>}
    </span>
  );
}

export default StatusBadge;
