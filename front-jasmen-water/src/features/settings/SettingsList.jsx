import { useTranslation } from "react-i18next";
import { useSettings } from "./useSettings";

import Empty from "../../ui/Empty";
import Spinner from "../../ui/spinner/Spinner";
import Heading from "../../ui/Heading";
import UpdateSettings from "./UpdateSettings";

function SettingsList() {
  const [t] = useTranslation();

  const { isLoading, settings, error } = useSettings();

  const {
    meterPrice = "",
    facebook = "",
    whatsAppNumber = "",
    Instagram = "",
  } = settings || {};

  if (isLoading) return <Spinner height="h-[calc(100vh-160px)]" />;
  if (error) return <Empty message={t("general.failedToGetData")} />;
  if (!settings) return <Empty message={t("general.failedToGetData")} />;

  return (
    <>
      <div className="flex items-center justify-between gap-[10px] surface-card p-[10px]">
        <Heading>{t("settings.pageTitle")}</Heading>

        <div className="w-[150px]">
          <UpdateSettings settings={settings} />
        </div>
      </div>

      <form className="flex flex-col gap-[10px] surface-card p-[10px]">
        <div>
          <label className="mb-[7px] block text-start text-lg">
            {t("users.meterPrice")}
          </label>
          <div className="relative">
            <p className="form-input border-none text-lg">{meterPrice}</p>
          </div>
        </div>

        <div>
          <label className="mb-[7px] block text-start text-lg">
            {t("users.facebook")}
          </label>
          <div className="relative">
            <p className="form-input border-none text-lg">{facebook}</p>
          </div>
        </div>

        <div>
          <label className="mb-[7px] block text-start text-lg">
            {t("users.instagram")}
          </label>
          <div className="relative">
            <p className="form-input border-none text-lg">{Instagram}</p>
          </div>
        </div>

        <div>
          <label className="mb-[7px] block text-start text-lg">
            {t("users.whatsappNumber")}
          </label>
          <div className="relative">
            <p className="form-input border-none text-lg">{whatsAppNumber}</p>
          </div>
        </div>
      </form>
    </>
  );
}

export default SettingsList;
