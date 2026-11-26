import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUsers, FaBuilding } from "react-icons/fa";

import { useBuildingDetails } from "../features/buildings/useBuildingDetails";
import BuildingInfo from "../features/buildings/BuildingInfo";
import BuildingUsers from "../features/buildings/BuildingUsers";
import AssignUsers from "../features/buildings/AssignUsers";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/spinner/Spinner";
import Empty from "../ui/Empty";

function BuildingDetails() {
  const { id } = useParams();
  const [t] = useTranslation();

  const { building, isLoading, error } = useBuildingDetails(id);

  if (isLoading) return <Spinner height="h-[calc(100vh-160px)]" />;
  if (error) return <Empty message={t("buildings.buildingNotFound")} />;
  if (!building) return <Empty message={t("buildings.buildingNotFound")} />;

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Building Header */}
      <div className="surface-card p-[10px]">
        <Row>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FaBuilding className="text-2xl text-white" />
            </div>
            <div>
              <Heading className="text-2xl">{building.buildingName}</Heading>
              <p className="mt-1 text-textColor opacity-70">
                {t("buildings.buildingDetails")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-brandText">
                {building.userCount || 0}
              </div>
              <div className="text-sm text-textColor opacity-70">
                {t("buildings.totalUsers")}
              </div>
            </div>
          </div>
        </Row>
      </div>

      {/* Building Information */}
      <BuildingInfo building={building} />

      {/* Building Users */}
      <div className="surface-card p-[10px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <FaUsers className="text-lg text-white" />
            </div>
            <Heading>{t("buildings.buildingUsers")}</Heading>
            <span className="rounded-full bg-colorBrand px-3 py-1 text-sm font-medium text-white">
              {building.users?.length || 0}
            </span>
          </div>
          <AssignUsers buildingId={id} />
        </div>
        <BuildingUsers users={building.users || []} buildingId={id} />
      </div>
    </div>
  );
}

export default BuildingDetails;
