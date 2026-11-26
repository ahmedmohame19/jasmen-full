import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaUserPlus } from "react-icons/fa";

import Modal from "../../ui/Modal";
import { useUnassignedUsers } from "./useBuildingDetails";
import { useAssignUserToBuilding } from "./useBuildingDetails";
import { useAddUserToBuilding } from "./useBuildingDetails";
import CreateUserForm from "./CreateUserForm";
import AssignUserList from "./AssignUserList";
import toast from "react-hot-toast";

function AssignUsers({ buildingId }) {
  const [t] = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Reset page to 1 when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const {
    users: unassignedUsers,
    totalPages,
    totalUnassignedUsers,
    currentPage,
    isLoading,
  } = useUnassignedUsers(page, limit);

  const { assignUser, isAssigning } = useAssignUserToBuilding();
  const { addUser, isAdding } = useAddUserToBuilding();

  const filteredUsers = unassignedUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAssignUser = (userId) => {
    assignUser(
      { userId, buildingId },
      {
        onSuccess: () => {
          toast.success(t("buildings.userAssignedSuccess"));
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.error || t("buildings.userAssignedFailed"),
          );
        },
      },
    );
  };

  const handleCreateUser = (userData, onDone) => {
    addUser(
      { buildingId, userData },
      {
        onSuccess: () => {
          toast.success(t("buildings.userCreatedSuccess"));
          onDone?.();
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.error || t("buildings.userCreatedFailed"),
          );
        },
      },
    );
  };

  return (
    <div className="flex gap-3">
      {/* Add User to Building */}
      <Modal>
        <Modal.Open opens="createUser">
          <button className="flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl">
            <FaPlus className="text-sm" />
            {t("buildings.addUserToBuilding")}
          </button>
        </Modal.Open>
        <Modal.Window name="createUser">
          <CreateUserForm onSubmit={handleCreateUser} isSubmitting={isAdding} />
        </Modal.Window>
      </Modal>

      {/* Assign User */}
      <Modal>
        <Modal.Open opens="assignUser">
          <button className="flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl">
            <FaUserPlus className="text-sm" />
            {t("buildings.assignUser")}
          </button>
        </Modal.Open>
        <Modal.Window name="assignUser">
          <AssignUserList
            users={filteredUsers}
            onAssign={handleAssignUser}
            isAssigning={isAssigning}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currentPage={currentPage}
            totalPages={totalPages}
            totalUnassignedUsers={totalUnassignedUsers}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AssignUsers;
