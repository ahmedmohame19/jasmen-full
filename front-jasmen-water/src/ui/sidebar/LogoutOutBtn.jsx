import { useTranslation } from "react-i18next";
import { IoLogOut } from "react-icons/io5";
import { useLogout } from "../../features/authentication/useLogout";
import { useUser } from "../../features/authentication/useUser";

import Modal from "../Modal";
import ConfirmMessage from "../ConfirmMessage";

function LogoutOutBtn() {
  const [t] = useTranslation();
  const { id } = useUser();
  const { logout, isLoading } = useLogout();

  return (
    <Modal>
      <Modal.Open opens="productConfirm">
        <li>
          <button
            type="button"
            className="flex w-full items-center gap-[14px] rounded-xl p-[12px] text-base font-semibold text-textColor transition-colors hover:bg-primary"
          >
            <IoLogOut className="text-xl" aria-hidden="true" />
            <span>{t("sidebar.logout")}</span>
          </button>
        </li>
      </Modal.Open>

      <Modal.Window name="productConfirm">
        <ConfirmMessage
          disabled={isLoading}
          message={t("general.logoutMessage")}
          onConfirm={() => logout(id)}
        />
      </Modal.Window>
    </Modal>
  );
}

export default LogoutOutBtn;
