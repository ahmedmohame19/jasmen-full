import { useLastFiveUsersAdded } from "./useLastFiveUsersAdded";
import { useTranslation } from "react-i18next";
import { FaUsers } from "react-icons/fa6";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";

import Stat from "./Stat";
import Empty from "../../ui/Empty";
import MiniSpinner from "../../ui/miniSpinner/MiniSpinner";
import KemetricsMark from "../../ui/KemetricsMark";
import WaveBackdrop from "../../ui/WaveBackdrop";

function Status() {
  const [t] = useTranslation();
  const { isLoading, userCount, totalMoney, error } = useLastFiveUsersAdded();

  if (error) return <Empty message={t("general.failedToGetData")} />;

  return (
    <div className="flex flex-col gap-[20px]">
      <section className="relative overflow-hidden rounded-3xl bg-hero-gradient p-[24px] text-white shadow-glow md:p-[36px]">
        <div className="relative z-10 flex items-center justify-between gap-[20px]">
          <div className="max-w-[560px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-200">
              {t("brand.tagline")}
            </p>
            <h2 className="mt-[6px] text-3xl font-extrabold leading-tight md:text-5xl">
              {t("brand.heroTitle")}
            </h2>
            <p className="mt-[6px] text-lg font-semibold text-sky-100 md:text-2xl">
              {t("brand.heroSubtitle")}
            </p>
            <Link
              to="/buildings-map"
              className="mt-[20px] inline-flex rounded-xl bg-white px-[18px] py-[10px] text-sm font-bold text-[#0b2a6b] shadow-lg transition-transform hover:scale-[1.03]"
            >
              {t("sidebar.map")}
            </Link>
          </div>
          <KemetricsMark className="hidden h-[150px] w-[120px] animate-float-y drop-shadow-2xl motion-reduce:animate-none sm:block" />
        </div>
        <WaveBackdrop className="h-[90px]" />
      </section>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-[14px]">
        {isLoading ? (
          <MiniSpinner />
        ) : (
          <Link to="/users">
            <Stat
              description="descriptions.allUsers"
              icon={<FaUsers className="text-2xl" />}
              title="users.users"
              value={userCount || 0}
            />
          </Link>
        )}

        {isLoading ? (
          <MiniSpinner />
        ) : (
          <Link to="/usersStatistic">
            <Stat
              description="descriptions.allEarnings"
              icon={<FaMoneyBillWave className="text-2xl" />}
              title="users.earnings"
              value={`${totalMoney || 0} ${t("general.EGP")}`}
            />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Status;
