import { useTranslation } from "react-i18next";
import { AiOutlineDelete } from "react-icons/ai";
import { useDeleteUser } from "./useDeleteUser";

import Modal from "../../ui/Modal";
import ConfirmMessage from "../../ui/ConfirmMessage";
import toast from "react-hot-toast";

function DeleteUser({ userId }) {
  const [t] = useTranslation();
  const { isDeleting, deleteUser } = useDeleteUser();

  const handleDeleteUser = () => {
    deleteUser(
      { id: userId },
      {
        onSuccess: () => {
          toast.success(t("users.deletedSuccessfully"));
        },
        onError: () => {
          toast.error(t("users.deletedFailed"));
        },
      },
    );
  };

  return (
    <Modal>
      <Modal.Open opens="deleteUser">
        <button
          className={`action-style ${isDeleting ? "cursor-not-allowed" : ""}`}
          disabled={isDeleting}
        >
          <AiOutlineDelete />
        </button>
      </Modal.Open>

      <Modal.Window name="deleteUser">
        <ConfirmMessage
          disabled={isDeleting}
          message={t("general.deleteUserMessage")}
          onConfirm={handleDeleteUser}
        />
      </Modal.Window>
    </Modal>
  );
}

export default DeleteUser;
