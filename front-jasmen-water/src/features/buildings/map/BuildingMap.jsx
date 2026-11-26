import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBuilding, FaThLarge } from "react-icons/fa";
import {
  getUnitStatus,
  getWorstStatus,
  STATUS_PRIORITY,
  toUnit,
  UNIT_STATUS,
} from "../../../utils/unitStatus";
import {
  LOW_BALANCE_PERCENT_MAX,
  LOW_BALANCE_PERCENT_MIN,
  NOW_TICK_MS,
} from "../../../utils/constants";
import { useNow } from "../../../hooks/useNow";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";
import { useBuildingsMapData } from "./useBuildingsMapData";
import { useLiveUnitUpdates } from "./useLiveUnitUpdates";
import { useStatusConfig } from "./useStatusConfig";

import AlertsStrip from "./AlertsStrip";
import BuildingTile from "./BuildingTile";
import MapHero from "./MapHero";
import SkylineScene from "./SkylineScene";
import StatusLegend from "./StatusLegend";
import Empty from "../../../ui/Empty";
import Spinner from "../../../ui/spinner/Spinner";

const VIEW = {
  SKYLINE: "skyline",
  CARDS: "cards",
};

const VIEW_OPTIONS = [
  { id: VIEW.SKYLINE, Icon: FaBuilding, labelKey: "map.view.skyline" },
  { id: VIEW.CARDS, Icon: FaThLarge, labelKey: "map.view.cards" },
];

function createEmptyCounts() {
  return STATUS_PRIORITY.reduce(
    (result, status) => ({ ...result, [status]: 0 }),
    {},
  );
}

function describeBuilding(building, config, now) {
  const units = building.users.map((user) => {
    const unit = toUnit(user);
    return { unit, ...getUnitStatus(unit, config, now) };
  });

  const counts = createEmptyCounts();
  units.forEach(({ status }) => {
    counts[status] += 1;
  });

  const presentStatuses = STATUS_PRIORITY.filter(
    (status) => counts[status] > 0,
  );

  return {
    building,
    units,
    counts,
    status: getWorstStatus(presentStatuses),
  };
}

function BuildingMap() {
  const [t] = useTranslation();
  const now = useNow(NOW_TICK_MS);
  const [activeFilter, setActiveFilter] = useState(null);
  const [view, setView] = useLocalStorageState(VIEW.SKYLINE, "mapView");
  const { config, lowBalancePercent, updateLowBalancePercent } =
    useStatusConfig();
  const { buildings, isLoading, error } = useBuildingsMapData();

  const allUsers = useMemo(
    () => buildings.flatMap((building) => building.users),
    [buildings],
  );

  useLiveUnitUpdates(allUsers);

  const tiles = useMemo(
    () => buildings.map((building) => describeBuilding(building, config, now)),
    [buildings, config, now],
  );

  const totals = useMemo(
    () =>
      tiles.reduce((result, tile) => {
        STATUS_PRIORITY.forEach((status) => {
          result[status] += tile.counts[status];
        });
        return result;
      }, createEmptyCounts()),
    [tiles],
  );

  const totalUnits = STATUS_PRIORITY.reduce(
    (sum, status) => sum + totals[status],
    0,
  );

  const leakAlerts = useMemo(
    () =>
      tiles.flatMap((tile) =>
        tile.units
          .filter(({ status }) => status === UNIT_STATUS.LEAK)
          .map(({ unit }) => ({
            buildingId: tile.building._id,
            buildingName: tile.building.buildingName,
            unit,
          })),
      ),
    [tiles],
  );

  const visibleTiles = activeFilter
    ? tiles.filter((tile) => tile.counts[activeFilter] > 0)
    : tiles;

  const currentView = view === VIEW.CARDS ? VIEW.CARDS : VIEW.SKYLINE;

  if (isLoading) return <Spinner height="h-[calc(100vh-160px)]" />;
  if (error) return <Empty message={t("general.failedToGetData")} />;
  if (buildings.length === 0)
    return <Empty message={t("buildings.noBuildings")} />;

  return (
    <div className="flex flex-col gap-[16px]">
      <MapHero
        totals={totals}
        totalUnits={totalUnits}
        buildingCount={buildings.length}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
      />

      <AlertsStrip alerts={leakAlerts} />

      <div className="surface-card flex flex-wrap items-center justify-between gap-[12px] p-[10px]">
        <div
          role="group"
          aria-label={t("map.view.label")}
          className="flex gap-[6px] rounded-xl bg-primary p-[4px]"
        >
          {VIEW_OPTIONS.map(({ id, Icon, labelKey }) => (
            <button
              key={id}
              type="button"
              aria-pressed={currentView === id}
              onClick={() => setView(id)}
              className={`flex items-center gap-[6px] rounded-lg px-[12px] py-[6px] text-sm font-bold transition-colors ${
                currentView === id
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-textColor hover:bg-secondary"
              }`}
            >
              <Icon aria-hidden="true" />
              {t(labelKey)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-[12px]">
          {activeFilter && (
            <button
              type="button"
              onClick={() => setActiveFilter(null)}
              className="rounded-full border border-line bg-primary px-[12px] py-[5px] text-xs font-bold hover:border-colorBrand"
            >
              {t("map.filter.all")} ✕
            </button>
          )}
          <label className="flex items-center gap-[8px] text-sm font-semibold">
            <span>{t("map.threshold.label")}</span>
            <input
              type="number"
              min={LOW_BALANCE_PERCENT_MIN}
              max={LOW_BALANCE_PERCENT_MAX}
              value={lowBalancePercent}
              onChange={(event) => updateLowBalancePercent(event.target.value)}
              className="w-[72px] rounded-xl border border-line bg-primary p-[6px] text-textColor outline-none focus:border-colorBrand"
            />
          </label>
        </div>
      </div>

      {visibleTiles.length === 0 ? (
        <Empty message={t("map.noMatches")} />
      ) : currentView === VIEW.SKYLINE ? (
        <SkylineScene tiles={visibleTiles} />
      ) : (
        <ul className="grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
          {visibleTiles.map((tile, index) => (
            <li key={tile.building._id}>
              <BuildingTile tile={tile} delayIndex={index} />
            </li>
          ))}
        </ul>
      )}

      <StatusLegend />
    </div>
  );
}

export default BuildingMap;
