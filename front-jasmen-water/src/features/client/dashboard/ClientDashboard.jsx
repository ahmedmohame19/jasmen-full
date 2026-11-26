import { useTranslation } from "react-i18next";
import { useClient } from "../useClient";
import { useWebSocket } from "../../../hooks/useWebSocket";
import Spinner from "../../../ui/spinner/Spinner";
import Empty from "../../../ui/Empty";
import Heading from "../../../ui/Heading";
import UserInfoConsumptionChart from "../../users/UserInfoConsumptionChart";
import Charges from "./Charges";

function ClientDashboard({ id }) {
  const [t] = useTranslation();
  const { isLoading, client } = useClient(id);
  const { userRealTimeData } = useWebSocket(id);

  const { consumption = null, consumptionLimit = null } =
    userRealTimeData || {};

  if (isLoading) return <Spinner />;
  if (!client) return <Empty message={t("client.noClientData")} />;

  const realTimePercentage =
    consumptionLimit > 0
      ? ((consumption / consumptionLimit) * 100).toFixed(0)
      : null;

  const percentage =
    client?.consumption > 0 && client?.limit > 0
      ? ((client?.consumption / client?.limit) * 100).toFixed(0)
      : 0;

  const displayPercentage =
    realTimePercentage !== null ? realTimePercentage : percentage;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="surface-card p-[10px]">
        <Heading>
          {t("general.hello")}, {client?.userName}
        </Heading>
      </div>

      <div className="flex flex-col items-start gap-[10px] lg:flex-row">
        <UserInfoConsumptionChart
          percentage={displayPercentage}
          title={t("users.yourConsumption")}
        />
        <Charges charges={client?.charging} />
      </div>
    </div>
  );
}

export default ClientDashboard;
