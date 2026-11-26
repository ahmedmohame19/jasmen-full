import { useTranslation } from "react-i18next";
import Table from "../../ui/Table";
import UserTaxRow from "./UserTaxRow";
import Row from "../../ui/Row";
import ShowBill from "./ShowBill";

function UserTaxTable({ userData }) {
  const [t] = useTranslation();

  const total =
    userData?.tax?.reduce((acc, curr) => Number(acc) + Number(curr.value), 0) ||
    0;

  return (
    <>
      <div className="surface-card p-[10px]">
        <Row>
          {userData?.tax?.length > 0 ? (
            <h2 className="text-lg">
              {t("users.userTaxes")}: <span>{total}</span>
            </h2>
          ) : (
            <h2 className="text-lg">
              {t("users.userTaxes")}
            </h2>
          )}

          <ShowBill user={userData} />
        </Row>
      </div>

      {userData?.tax?.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Cell isHeader>{t("general.taxReason")}</Table.Cell>
            <Table.Cell isHeader>{t("general.taxValue")}</Table.Cell>
            <Table.Cell isHeader>{t("general.actions")}</Table.Cell>
          </Table.Header>
          <Table.Body
            data={userData?.tax}
            render={(singleTax) => (
              <UserTaxRow singleTax={singleTax} key={singleTax?._id} />
            )}
          />
        </Table>
      )}
    </>
  );
}

export default UserTaxTable;
