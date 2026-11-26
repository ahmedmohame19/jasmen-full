import { useUser } from "../authentication/useUser";
import { useTranslation } from "react-i18next";
import Empty from "../../ui/Empty";
import MiniSpinner from "../../ui/miniSpinner/MiniSpinner";

function AccountInfo() {
  const [t] = useTranslation();
  const { user, isLoading, error } = useUser();

  if (isLoading) return <MiniSpinner />;
  if (error) return <Empty message={t("general.failedToGetData")} />;

  return (
    <div className="surface-card p-[10px]">
      <div className="flex w-full flex-col gap-[10px] surface-card p-[10px] text-sm lg:w-[50%]">
        <p className="flex items-center rounded-md bg-primary p-[10px]">
          {t("general.name")}: {user?.other?.userName}
        </p>

        <p className="flex items-center rounded-md bg-primary p-[10px]">
          {t("general.email")}: {user?.other?.email}
        </p>
      </div>
    </div>
  );
}

export default AccountInfo;
