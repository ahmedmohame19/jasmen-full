import { useTranslation } from "react-i18next";
import { useLastFiveUsersAdded } from "./useLastFiveUsersAdded";
import { Link } from "react-router-dom";
import Empty from "../../ui/Empty";
import Heading from "../../ui/Heading";
import MiniSpinner from "../../ui/miniSpinner/MiniSpinner";
import HealthRing from "../buildings/map/HealthRing";

import userImage from "/user-avatar.jpg";

function getUsagePercent(user) {
  return user?.limit > 0
    ? Math.min((user.consumption / user.limit) * 100, 100)
    : 0;
}

function LastFiveUsers() {
  const [t] = useTranslation();
  const { isLoading, lastUsers, error } = useLastFiveUsersAdded();

  if (isLoading) return <MiniSpinner />;
  if (error) return <Empty message={t("general.failedToGetData")} />;
  if (!lastUsers?.length) return <Empty message={t("users.noUsers")} />;

  return (
    <>
      <Heading>{t("users.lastNewUsers")}</Heading>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[14px]">
        {lastUsers.map((user, index) => {
          const usagePercent = getUsagePercent(user);

          return (
            <li key={user?._id}>
              <Link
                title={t("descriptions.client")}
                to={`/user/${user?._id}`}
                style={{ animationDelay: `${index * 60}ms` }}
                className="surface-card flex animate-rise-in items-center gap-[14px] p-[14px] transition-transform hover:-translate-y-[3px] motion-reduce:animate-none"
              >
                <img
                  src={userImage}
                  alt=""
                  className="h-[54px] w-[54px] rounded-full border-2 border-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold">{user?.userName}</p>
                  <p className="truncate text-xs text-mutedText">
                    {user?.email}
                  </p>
                </div>
                <HealthRing
                  percent={usagePercent}
                  label={`${Math.round(usagePercent)}% ${t("users.consumption")}`}
                  className="h-[56px] w-[56px] shrink-0 text-xs text-colorBrand"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default LastFiveUsers;
