import { useTranslation } from "react-i18next";
import { getRemainingBalance } from "../../../utils/unitStatus";
import { STATUS_VISUALS } from "./statusVisuals";

function UnitWindow({ unit, status, reason }) {
  const [t] = useTranslation();
  const { Icon, surface, windowBorder, glow } = STATUS_VISUALS[status];

  const statusLabel = t(`map.status.${status}`);
  const reasonLabel = reason ? t(`map.reason.${reason}`) : null;

  return (
    <span
      aria-hidden="true"
      className={`group/unit relative flex h-[30px] w-[30px] items-center justify-center rounded-md text-[13px] transition-transform hover:z-30 hover:scale-125 ${surface} ${windowBorder} ${glow}`}
    >
      <Icon />
      <span className="pointer-events-none absolute bottom-[130%] start-1/2 z-40 hidden w-max max-w-[190px] -translate-x-1/2 rounded-xl border border-line bg-secondary p-[8px] text-start text-xs font-semibold text-textColor shadow-card group-hover/unit:block rtl:translate-x-1/2">
        <span className="block truncate text-sm font-extrabold">
          {unit.name}
        </span>
        <span className="block text-mutedText">
          {t("map.unit.room")} {unit.roomNumber ?? "-"}
        </span>
        <span className="mt-[4px] block">
          {reasonLabel ? `${statusLabel} · ${reasonLabel}` : statusLabel}
        </span>
        <span className="block text-mutedText">
          {t("map.unit.balance")}: {Math.round(getRemainingBalance(unit))} /{" "}
          {unit.limit}
        </span>
      </span>
    </span>
  );
}

export default UnitWindow;
