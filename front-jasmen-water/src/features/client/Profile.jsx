import { useClient } from "./useClient";
import { useTranslation } from "react-i18next";
import Spinner from "../../ui/spinner/Spinner";
import Empty from "../../ui/Empty";
import Heading from "../../ui/Heading";
import UserPersonalData from "../../ui/UserPersonalData";

function Profile({ id }) {
  const { isLoading, client } = useClient(id);

  const [t] = useTranslation();

  if (isLoading) return <Spinner />;
  if (!client) return <Empty message={t("client.noClientData")} />;

  return (
    <>
      <div className="surface-card p-[10px]">
        <Heading>{t("account.title")}</Heading>
      </div>
      <div className="surface-card p-[10px]">
        <UserPersonalData user={client} />
      </div>
    </>
  );
}

export default Profile;
