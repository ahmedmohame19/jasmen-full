import { useTranslation } from "react-i18next";
import { useBuildings } from "./useBuildings";

import Spinner from "../../ui/spinner/Spinner";
import Table from "../../ui/Table";
import BuildingRow from "./BuildingRow";
import Empty from "../../ui/Empty";

function BuildingsTable() {
  const [t] = useTranslation();

  // Fetch Buildings Hook
  const { isLoading, buildings, error } = useBuildings();

  if (isLoading) return <Spinner height="h-[calc(100vh-160px)]" />;
  if (error) return <Empty message={t("general.failedToGetData")} />;
  if (!buildings?.length) return <Empty message={t("buildings.noBuildings")} />;

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Cell isHeader>{t("buildings.buildingLogo")}</Table.Cell>
          <Table.Cell isHeader>{t("buildings.buildingName")}</Table.Cell>
          <Table.Cell isHeader>{t("buildings.buildingAddress")}</Table.Cell>
          <Table.Cell isHeader>{t("buildings.buildingCode")}</Table.Cell>
          <Table.Cell isHeader>{t("buildings.userCount")}</Table.Cell>
          <Table.Cell isHeader>{t("buildings.buildingDescription")}</Table.Cell>
          <Table.Cell isHeader>{t("general.actions")}</Table.Cell>
        </Table.Header>
        <Table.Body
          data={buildings}
          render={(building) => <BuildingRow building={building} key={building?._id} />}
        />
      </Table>
    </>
  );
}

export default BuildingsTable;
