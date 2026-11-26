import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdWaterDamage } from "react-icons/md";

const MAX_VISIBLE_ALERTS = 6;

function AlertsStrip({ alerts }) {
  const [t] = useTranslation();

  if (alerts.length === 0) return null;

  const visibleAlerts = alerts.slice(0, MAX_VISIBLE_ALERTS);
  const hiddenCount = alerts.length - visibleAlerts.length;

  return (
    <section
      aria-label={t("map.alerts.title")}
      className="flex flex-col gap-[10px] rounded-2xl border-2 border-statusLeak bg-glass p-[14px] shadow-card backdrop-blur-md sm:flex-row sm:items-center"
    >
      <p className="flex shrink-0 items-center gap-[8px] font-extrabold">
        <span className="flex h-[32px] w-[32px] animate-leak-blink items-center justify-center rounded-full text-onStatusLeak motion-reduce:animate-none motion-reduce:bg-statusLeak">
          <MdWaterDamage aria-hidden="true" />
        </span>
        {t("map.alerts.title")}
      </p>
      <ul className="flex flex-wrap gap-[8px]">
        {visibleAlerts.map(({ buildingId, buildingName, unit }) => (
          <li key={unit.id}>
            <Link
              to={`/building/${buildingId}`}
              className="inline-flex items-center gap-[6px] rounded-full border border-statusLeak bg-primary px-[10px] py-[4px] text-xs font-bold transition-colors hover:bg-statusLeak hover:text-onStatusLeak"
            >
              <span>{buildingName}</span>
              <span aria-hidden="true">·</span>
              <span>
                {t("map.unit.room")} {unit.roomNumber ?? "-"}
              </span>
            </Link>
          </li>
        ))}
        {hiddenCount > 0 && (
          <li className="inline-flex items-center rounded-full px-[10px] py-[4px] text-xs font-bold text-mutedText">
            +{hiddenCount}
          </li>
        )}
      </ul>
    </section>
  );
}

export default AlertsStrip;
