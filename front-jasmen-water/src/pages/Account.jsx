import { useTranslation } from "react-i18next";
import Heading from "../ui/Heading";
import AccountInfo from "../features/account/AccountInfo";

function Account() {
  const [t] = useTranslation();

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="surface-card p-[10px]">
        <Heading>{t("account.title")}</Heading>
      </div>
      <AccountInfo />
    </div>
  );
}

export default Account;
