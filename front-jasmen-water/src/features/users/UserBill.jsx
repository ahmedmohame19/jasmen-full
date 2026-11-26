import { useTranslation } from "react-i18next";
import { useSettings } from "../settings/useSettings";
import KemetricsMark from "../../ui/KemetricsMark";

function UserBill({ user, onCloseModal }) {
  const { t: translate } = useTranslation();
  const { settings } = useSettings();

  const meterPrice = Number(settings?.meterPrice) || 0;
  const lastCharge = (Number(user?.limit) || 0) * meterPrice;
  const totalChargingMoney = Number(user?.totalChargingMoney) || 0;
  const total =
    user?.tax?.reduce((acc, curr) => Number(acc) + Number(curr.value), 0) || 0;

  return (
    <div className="flex flex-col gap-[20px] rounded-md bg-[#f3f4f6] p-[10px] text-[#111827]">
      <div className="flex items-center justify-between">
        <KemetricsMark className="h-[64px] w-[51px]" />
        <h2 className="text-xl font-[500] uppercase">Kemetrics</h2>
      </div>

      <h1 className="border-b border-[#111827] pb-[5px] text-center text-2xl font-[500]">
        {translate("general.clientName")}: {user?.userName}
      </h1>

      <div>
        <div className="mb-[10px] flex items-center justify-between border-b border-[#ccc] pb-[5px] text-xl font-[500]">
          <span>{translate("general.taxReason")}</span>
          <span>{translate("general.taxValue")}</span>
        </div>

        <div className="flex items-center justify-between border-b border-[#ccc] py-[3px]">
          <span>{translate("users.consumption")}</span>
          <span>
            {totalChargingMoney} {translate("general.EGP")}
          </span>
        </div>

        {user?.tax?.map((t) => {
          return (
            <div
              key={t?._id}
              className="flex items-center justify-between border-b border-[#ccc] py-[3px]"
            >
              <span>{t?.reason}</span>
              <span>
                {t?.value} {translate("general.EGP")}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-lg font-[500]">
        <span>{translate("users.totalMoney")}</span>
        <span>
          {total + lastCharge + totalChargingMoney} {translate("general.EGP")}
        </span>
      </div>
    </div>
  );
}

export default UserBill;
