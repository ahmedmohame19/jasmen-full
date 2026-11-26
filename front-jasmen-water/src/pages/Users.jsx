import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";

import UsersTable from "../features/users/UsersTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

import AddEditRoom from "../features/users/AddEditUser";
import Button from "../ui/Button";

function Users() {
  const [t] = useTranslation();

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="surface-card p-[10px]">
        <Row>
          <Heading>{t("users.users")}</Heading>
          <div className="self-end">
            <AddEditRoom>
              <div className="w-[200px]">
                <Button>
                  <span className="flex items-center justify-around">
                    {t("users.createUser")}
                    <FaPlus />
                  </span>
                </Button>
              </div>
            </AddEditRoom>
          </div>
        </Row>
      </div>
      <UsersTable />
    </div>
  );
}

export default Users;
