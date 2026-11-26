import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { STATUS_PRIORITY, UNIT_STATUS } from "../../../utils/unitStatus";
import StatusBadge from "./StatusBadge";
import UnitWindow from "./UnitWindow";

const WINDOW_SIZE_PX = 30;
const WINDOW_GAP_PX = 8;
const MAX_COLUMNS = 4;
const SMALL_TOWER_UNITS = 6;
const MEDIUM_TOWER_UNITS = 12;

function getColumnCount(unitCount) {
  if (unitCount <= SMALL_TOWER_UNITS) return 2;
  if (unitCount <= MEDIUM_TOWER_UNITS) return 3;
  return MAX_COLUMNS;
}

function BuildingTower({ tile, delayIndex }) {
  const [t] = useTranslation();
  const { building, status, counts, units } = tile;

  const columns = getColumnCount(units.length);
  const hasLeak = status === UNIT_STATUS.LEAK;
  const hasUnits = units.length > 0;
  const bodyWidth =
    columns * WINDOW_SIZE_PX + (columns - 1) * WINDOW_GAP_PX + 24;

  const summary = STATUS_PRIORITY.map(
    (key) => `${counts[key]} ${t(`map.status.${key}`)}`,
  ).join(", ");

  return (
    <Link
      to={`/building/${building._id}`}
      aria-label={`${building.buildingName}: ${summary}`}
      style={{ animationDelay: `${delayIndex * 70}ms` }}
      className="group relative flex shrink-0 animate-rise-in flex-col items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brandText motion-reduce:animate-none"
    >
      <span
        aria-hidden="true"
        className="relative mb-[2px] flex h-[22px] w-[22px] items-end justify-center"
      >
        <span className="h-[22px] w-[3px] rounded-full bg-buildingEdge" />
        <span
          className={`absolute -top-[2px] h-[10px] w-[10px] rounded-full ${
            hasLeak
              ? "animate-ring-pulse bg-statusLeak motion-reduce:animate-none"
              : "bg-buildingEdge"
          }`}
        />
      </span>

      <span
        style={{ width: `${bodyWidth}px` }}
        className={`relative flex flex-col items-center rounded-t-xl border-2 bg-buildingBody px-[10px] pb-0 pt-[12px] shadow-card transition-transform duration-300 group-hover:-translate-y-[6px] ${
          hasLeak ? "border-statusLeak" : "border-buildingEdge"
        }`}
      >
        {hasUnits ? (
          <span
            style={{
              gridTemplateColumns: `repeat(${columns}, ${WINDOW_SIZE_PX}px)`,
              gap: `${WINDOW_GAP_PX}px`,
            }}
            className="grid pb-[12px]"
          >
            {units.map(({ unit, status: unitStatus, reason }) => (
              <UnitWindow
                key={unit.id}
                unit={unit}
                status={unitStatus}
                reason={reason}
              />
            ))}
          </span>
        ) : (
          <span className="pb-[12px] pt-[6px] text-xs text-mutedText">
            {t("map.noUnits")}
          </span>
        )}
        <span
          aria-hidden="true"
          className="h-[20px] w-[26px] rounded-t-md border-2 border-b-0 border-buildingEdge bg-primary"
        />
      </span>

      <span className="mt-[10px] flex max-w-[150px] flex-col items-center gap-[4px] rounded-xl border border-line bg-glass px-[10px] py-[6px] text-center shadow-card backdrop-blur-md">
        <span className="max-w-full truncate text-sm font-extrabold">
          {building.buildingName}
        </span>
        {hasUnits && <StatusBadge status={status} compact />}
      </span>
    </Link>
  );
}

export default BuildingTower;
