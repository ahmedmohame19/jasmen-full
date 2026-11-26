import { useTranslation } from "react-i18next";
import { CONNECTION_STATE, useSocket } from "../../context/SocketContext";

const STATE_STYLES = {
  [CONNECTION_STATE.CONNECTED]: "bg-green-500",
  [CONNECTION_STATE.RECONNECTING]: "bg-yellow-500 animate-pulse",
  [CONNECTION_STATE.OFFLINE]: "bg-gray-500",
  [CONNECTION_STATE.MOCK]: "bg-blue-500",
};

function ConnectionIndicator() {
  const [t] = useTranslation();
  const { connectionState } = useSocket();

  const label = t(`connection.${connectionState}`);

  return (
    <div
      role="status"
      title={`${t("connection.title")}: ${label}`}
      className="flex items-center gap-[6px] rounded-full border border-line bg-primary px-[10px] py-[5px] text-xs font-semibold"
    >
      <span
        aria-hidden="true"
        className={`h-[8px] w-[8px] rounded-full ${STATE_STYLES[connectionState]}`}
      ></span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </div>
  );
}

export default ConnectionIndicator;
