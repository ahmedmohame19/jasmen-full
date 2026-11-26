import { useTranslation } from "react-i18next";
import { useUsers } from "./useUsers";

import Spinner from "../../ui/spinner/Spinner";
import Table from "../../ui/Table";
import UserRow from "./UserRow";
import Pagination from "../../ui/Pagination";
import Empty from "../../ui/Empty";

function UsersTable() {
  const [t] = useTranslation();

  const { isLoading, users, totalPages, count, error } = useUsers();

  if (isLoading) return <Spinner height="h-[calc(100vh-160px)]" />;
  if (error) return <Empty message={t("general.failedToGetData")} />;
  if (!users?.length) return <Empty message={t("users.noUsers")} />;

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Cell isHeader>{t("general.name")}</Table.Cell>
          <Table.Cell isHeader>{t("users.mobile")}</Table.Cell>
          <Table.Cell isHeader>{t("general.email")}</Table.Cell>
          <Table.Cell isHeader>{t("users.roomNumber")}</Table.Cell>
          <Table.Cell isHeader>{t("users.status")}</Table.Cell>
          <Table.Cell isHeader>{t("general.actions")}</Table.Cell>
        </Table.Header>
        <Table.Body
          data={users}
          render={(room) => <UserRow user={room} key={room?._id} />}
        />
      </Table>

      <Pagination count={count} pageCount={totalPages} />
    </>
  );
}

export default UsersTable;
