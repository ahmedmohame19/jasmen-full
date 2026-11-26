import { useTranslation } from "react-i18next";
import { FaUser, FaMobile, FaEnvelope, FaHome, FaTrash, FaChartLine } from "react-icons/fa";
import { BiShow } from "react-icons/bi";
import { MdAnalytics } from "react-icons/md";
import { Link } from "react-router-dom";
import { useUser } from "../authentication/useUser";
import { useUnassignUserFromBuilding } from "./useBuildingDetails";
import toast from "react-hot-toast";
import { useLiveUnits, withLiveData } from "./map/useLiveUnits";
import { useStatusConfig } from "./map/useStatusConfig";
import { useNow } from "../../hooks/useNow";
import { NOW_TICK_MS } from "../../utils/constants";
import { getUnitStatus, toUnit } from "../../utils/unitStatus";
import StatusBadge from "./map/StatusBadge";

function BuildingUsers({ users, buildingId }) {
  const [t] = useTranslation();
  const { user: currentUser } = useUser();
  const { unassignUser, isUnassigning } = useUnassignUserFromBuilding();
  const liveUnits = useLiveUnits();
  const { config } = useStatusConfig();
  const now = useNow(NOW_TICK_MS);

  const handleUnassignUser = (userId, userName) => {
    if (window.confirm(t("buildings.unassignUserConfirm", { userName }))) {
      unassignUser(
        { userId },
        {
          onSuccess: () => {
            toast.success(t("buildings.userUnassignedSuccess"));
          },
          onError: (error) => {
            toast.error(error.response?.data?.error || t("buildings.userUnassignedFailed"));
          },
        }
      );
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
          <FaUser className="text-textColor opacity-50 text-3xl" />
        </div>
        <p className="text-textColor opacity-70 text-lg">
          {t("buildings.noUsersInBuilding")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((rawUser) => {
        const user = withLiveData(rawUser, liveUnits);
        const { status, reason } = getUnitStatus(toUnit(user), config, now);
        return (
        <div
          key={user._id}
          className="bg-primary rounded-lg p-5 shadow-lg border border-primary hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FaUser className="text-white text-lg" />
              </div>
              <div>
                <h4 className="font-semibold text-textColor text-lg">
                  {user.userName}
                </h4>
                <StatusBadge
                  status={status}
                  detail={reason ? t(`map.reason.${reason}`) : undefined}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/user/${user._id}`}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 transform"
                title={t("general.view")}
              >
                <BiShow className="text-sm" />
              </Link>

              <Link
                to={`/user/${user._id}/consumption`}
                className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 transform"
                title={t("users.consumption")}
              >
                <FaChartLine className="text-sm" />
              </Link>

              {currentUser?.other?.email === "Ashraf@mail.com" && (
                <Link
                  to={`/clientDashboardForAdmin/${user._id}`}
                  className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 transform"
                  title={t("users.consumption")}
                >
                  <MdAnalytics className="text-sm" />
                </Link>
              )}

              <button
                onClick={() => handleUnassignUser(user._id, user.userName)}
                disabled={isUnassigning}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 transform disabled:opacity-50 disabled:cursor-not-allowed"
                title={t("buildings.unassignUser")}
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-textColor opacity-70">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FaEnvelope className="text-blue-600 dark:text-blue-400 text-xs" />
              </div>
              <span className="truncate">{user.email}</span>
            </div>
            
            <div className="flex items-center gap-3 text-textColor opacity-70">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FaMobile className="text-green-600 dark:text-green-400 text-xs" />
              </div>
              <span>{user.mobile}</span>
            </div>
            
            <div className="flex items-center gap-3 text-textColor opacity-70">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <FaHome className="text-purple-600 dark:text-purple-400 text-xs" />
              </div>
              <span>{t("users.roomNumber")}: {user.roomNumber}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-primary">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-secondary rounded-lg">
                <div className="text-textColor opacity-70 text-xs">{t("users.limit")}</div>
                <div className="font-semibold text-textColor">{user.limit || 0}</div>
              </div>
              <div className="text-center p-2 bg-secondary rounded-lg">
                <div className="text-textColor opacity-70 text-xs">{t("users.consumption")}</div>
                <div className="font-semibold text-textColor">{user.consumption || 0}</div>
              </div>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

export default BuildingUsers;
