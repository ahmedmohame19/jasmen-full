import { useTranslation } from "react-i18next";
import { STATUS_PRIORITY } from "../../../utils/unitStatus";
import { STATUS_VISUALS } from "./statusVisuals";
import HealthRing from "./HealthRing";
import WaveBackdrop from "../../../ui/WaveBackdrop";

function MapHero({
  totals,
  totalUnits,
  buildingCount,
  activeFilter,
  onFilter,
}) {
  const [t] = useTranslation();

  const healthPercent = totalUnits > 0 ? (totals.ok / totalUnits) * 100 : 0;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-hero-gradient p-[20px] text-white shadow-glow md:p-[30px]">
      <div className="relative z-10 flex flex-col gap-[24px] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-[20px]">
          <HealthRing
            percent={healthPercent}
            onDark
            label={`${Math.round(healthPercent)}% ${t("map.health")}`}
            className="h-[120px] w-[120px] shrink-0 text-white md:h-[150px] md:w-[150px]"
          />
          <div>
            <h1 className="text-2xl font-extrabold md:text-4xl">
              {t("map.title")}
            </h1>
            <p className="mt-[4px] text-sm font-semibold text-sky-100 md:text-base">
              {t("map.subtitle", {
                units: totalUnits,
                buildings: buildingCount,
              })}
            </p>
            <p className="mt-[2px] text-xs font-semibold uppercase tracking-widest text-sky-200">
              {t("map.health")}
            </p>
          </div>
        </div>

        <ul
          aria-label={t("map.summary.title")}
          aria-live="polite"
          className="grid grid-cols-2 gap-[10px] lg:w-[460px]"
        >
          {STATUS_PRIORITY.map((status) => {
            const { Icon, surface } = STATUS_VISUALS[status];
            const isActive = activeFilter === status;
            return (
              <li key={status}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onFilter(isActive ? null : status)}
                  className={`flex w-full items-center gap-[12px] rounded-2xl border p-[12px] text-start backdrop-blur-md transition-all hover:-translate-y-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? "border-white bg-white text-[#0b2a6b]"
                      : "border-white/25 bg-white/10 text-white"
                  }`}
                >
                  <span
                    className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl text-lg ${surface}`}
                  >
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-2xl font-extrabold tabular-nums leading-none">
                      {totals[status]}
                    </span>
                    <span className="block truncate text-xs font-semibold">
                      {t(`map.status.${status}`)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <WaveBackdrop className="h-[70px]" />
    </section>
  );
}

export default MapHero;
