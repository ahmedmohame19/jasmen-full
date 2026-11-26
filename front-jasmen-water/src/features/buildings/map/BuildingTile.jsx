import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { STATUS_PRIORITY, UNIT_STATUS } from "../../../utils/unitStatus";
import { STATUS_VISUALS } from "./statusVisuals";
import HealthRing from "./HealthRing";
import StatusBadge from "./StatusBadge";
import WaveBackdrop from "../../../ui/WaveBackdrop";

function BuildingTile({ tile, delayIndex }) {
  const [t] = useTranslation();
  const { building, status, counts, units } = tile;

  const totalUnits = units.length;
  const hasUnits = totalUnits > 0;
  const healthPercent = hasUnits
    ? (counts[UNIT_STATUS.OK] / totalUnits) * 100
    : 0;
  const hasLeak = status === UNIT_STATUS.LEAK;

  const summary = STATUS_PRIORITY.map(
    (key) => `${counts[key]} ${t(`map.status.${key}`)}`,
  ).join(", ");

  return (
    <Link
      to={`/building/${building._id}`}
      aria-label={`${building.buildingName}: ${summary}`}
      style={{ animationDelay: `${delayIndex * 60}ms` }}
      className={`surface-card group relative flex min-h-[190px] animate-rise-in flex-col gap-[14px] overflow-hidden p-[16px] text-start transition-transform duration-300 hover:-translate-y-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandText motion-reduce:animate-none ${
        hasLeak ? "!border-statusLeak ring-2 ring-statusLeak" : ""
      }`}
    >
      {hasUnits && (
        <div
          aria-hidden="true"
          style={{ height: `${Math.max(healthPercent, 8)}%` }}
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent/25 to-accent/5 transition-[height] duration-700 motion-reduce:transition-none"
        >
          <WaveBackdrop
            className="-top-[12px] h-[24px]"
            tone="text-accent/30"
          />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-[10px]">
        <div className="min-w-0">
          <p className="break-words text-lg font-extrabold leading-tight">
            {building.buildingName}
          </p>
          <p className="text-xs font-semibold text-mutedText">
            {building.buildingCode}
          </p>
          {hasUnits && (
            <div className="mt-[8px]">
              <StatusBadge status={status} />
            </div>
          )}
        </div>
        {hasUnits && (
          <HealthRing
            percent={healthPercent}
            label={`${Math.round(healthPercent)}% ${t("map.health")}`}
            className="h-[66px] w-[66px] shrink-0 text-sm text-colorBrand"
          />
        )}
      </div>

      {hasUnits ? (
        <ul className="relative z-10 mt-auto flex flex-wrap gap-[6px]">
          {STATUS_PRIORITY.map((key) => {
            const { Icon, surface, tileBorder } = STATUS_VISUALS[key];
            return (
              <li
                key={key}
                title={t(`map.status.${key}`)}
                className={`inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-xs font-bold ${counts[key] > 0 ? `${surface} ${tileBorder}` : "border border-line bg-primary text-mutedText"}`}
              >
                <Icon aria-hidden="true" />
                <span>{counts[key]}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="relative z-10 mt-auto text-sm text-mutedText">
          {t("map.noUnits")}
        </p>
      )}
    </Link>
  );
}

export default BuildingTile;
