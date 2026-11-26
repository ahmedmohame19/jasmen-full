import { useParams } from "react-router-dom";
import { useUser } from "./useUser";
import { useTranslation } from "react-i18next";
import { useWebSocket } from "../../hooks/useWebSocket";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/spinner/Spinner";
import UserInfoConsumptionChart from "./UserInfoConsumptionChart";
import OpenValve from "./OpenValve";
import CloseValve from "./CloseValve";
import AddCharge from "./AddCharge";
import Reset from "./Reset";
import UserTaxTable from "./UserTaxTable";
import AddEditTax from "./AddEditTax";
import Button from "../../ui/Button";
import FlowRateChart from "./FlowRateChart";
import UserPersonalData from "../../ui/UserPersonalData";

function UserInfo() {
  const { id } = useParams();
  const [t] = useTranslation();
  const { isLoading, userData } = useUser(id);
  const { socket, userRealTimeData } = useWebSocket(id);

  const {
    consumption = null,
    consumptionLimit = null,
    state = null,
    flowRate = null,
  } = userRealTimeData || {};

  if (isLoading) return <Spinner />;

  const realTimePercentage = consumptionLimit > 0 ?
    Math.round(((consumption / consumptionLimit) * 100) * 100) / 100 : null;

  const percentage =
    userData?.consumption > 0 && userData?.limit > 0
      ? Math.round((userData.consumption / userData.limit) * 100 * 100) / 100
      : 0;

  // Use real-time data if available, otherwise fall back to stored data
  // Cap at 100% for display purposes, but allow values over 100% to show the actual percentage
  const displayPercentage = realTimePercentage !== null ? realTimePercentage : percentage;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="surface-card p-[10px]">
        <Row>
          <Heading>{t("users.userInfo")}</Heading>
        </Row>
      </div>

      <div className="flex flex-wrap justify-around gap-[20px] surface-card p-[10px] lg:flex-nowrap lg:justify-start lg:gap-[10px]">
        <OpenValve userData={userData} socket={socket} />
        <CloseValve userData={userData} socket={socket} />
        <AddCharge user={userData} socket={socket} />
        <Reset socket={socket} />
        <AddEditTax>
          <div
            title={t("descriptions.addTax")}
            className="ltr:w-[120px] rtl:w-[130px]"
          >
            <Button>{t("users.addTax")}</Button>
          </div>
        </AddEditTax>
      </div>

      <div className="flex flex-col items-start gap-[10px] lg:flex-row">
        <div className="w-full lg:w-[50%]">
          <UserPersonalData user={userData} id={userData?._id} state={state} />
        </div>

        <UserInfoConsumptionChart
          percentage={displayPercentage}
          title={t("users.consumption")}
        />
      </div>

      <div className="flex flex-col items-start gap-[10px] lg:flex-row">
        <div className="w-full lg:w-[50%]">
          <FlowRateChart flowRate={flowRate} />
        </div>

        <UserInfoConsumptionChart
          percentage={userData?.consumption || 0}
          title={t("users.totalMeters")}
          sign="M"
        />
      </div>

      <UserTaxTable userData={userData} />
    </div>
  );
}

export default UserInfo;
