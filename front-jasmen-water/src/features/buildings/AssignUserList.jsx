import { useTranslation } from "react-i18next";
import { FaUser, FaEnvelope, FaMobile, FaUserPlus, FaSearch } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import Input from "../../ui/Input";
import Spinner from "../../ui/spinner/Spinner";
import Empty from "../../ui/Empty";

function AssignUserList({ 
  users, 
  onAssign, 
  isAssigning, 
  searchTerm, 
  onSearchChange,
  currentPage,
  totalPages,
  totalUnassignedUsers,
  onPageChange,
  isLoading
}) {
  const [t] = useTranslation();

  if (isAssigning || isLoading) {
    return <Spinner height="h-64" />;
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-textColor mb-6">
        {t("buildings.assignUser")}
      </h2>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder={t("buildings.searchUsers")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<FaSearch />}
        />
      </div>

      {/* Users List */}
      <div className="max-h-96 overflow-y-auto space-y-3 mb-4">
        {users.length === 0 ? (
          <Empty message={t("buildings.noUnassignedUsers")} />
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-primary rounded-lg border border-primary shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <FaUser className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="font-semibold text-textColor text-lg">
                    {user.userName}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-textColor opacity-70 mt-1">
                    <div className="flex items-center gap-1">
                      <FaEnvelope className="text-blue-500" />
                      <span className="truncate max-w-32">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaMobile className="text-green-500" />
                      <span>{user.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onAssign(user._id)}
                disabled={isAssigning}
                className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 transform disabled:opacity-50 disabled:cursor-not-allowed"
                title={t("buildings.assign")}
              >
                <FaUserPlus className="text-lg" />
                <span className="sr-only">{t("buildings.assign")}</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-md border-[2px] border-primary bg-secondary p-[10px] mt-4">
          <p className="flex gap-[4px] text-textColor text-sm">
            {t("general.showing")}{" "}
            <span className="font-semibold">{(currentPage - 1) * 10 + 1}</span>{" "}
            {t("general.to")}{" "}
            <span className="font-semibold">
              {currentPage === totalPages ? totalUnassignedUsers : currentPage * 10}
            </span>{" "}
            {t("general.of")} <span className="font-semibold">{totalUnassignedUsers}</span>{" "}
            {t("general.results")}
          </p>

          <div className="flex items-center justify-between gap-[20px]">
            <button
              className={`flex items-center justify-between gap-[5px] text-textColor ${
                currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:text-brandText"
              }`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <MdKeyboardArrowLeft className="text-2xl rtl:scale-[-1]" />
              <span>{t("general.previous")}</span>
            </button>

            <span className="text-textColor text-sm">
              {t("general.of")} {currentPage} / {totalPages}
            </span>

            <button
              className={`flex items-center justify-between gap-[5px] text-textColor ${
                currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:text-brandText"
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <span>{t("general.next")}</span>
              <MdKeyboardArrowRight className="text-2xl rtl:scale-[-1]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignUserList;
