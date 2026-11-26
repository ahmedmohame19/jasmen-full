import { CiEdit } from "react-icons/ci";
import { BiShow } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import AddEditBuilding from "./AddEditBuilding";
import DeleteBuilding from "./DeleteBuilding";
import Tooltip from "../../ui/Tooltip";
import { baseURL } from "../../services/axios";

function BuildingCard({ building }) {
  const [t] = useTranslation();

  return (
    <div className="group relative w-full max-w-sm mx-auto min-w-0">
      {/* Building Shape Container */}
      <div className="relative bg-primary rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 overflow-hidden min-w-0 border border-primary">
        
        {/* Building Facade */}
        <div className="pt-4 pb-4 px-4">
          
          {/* Building Logo/Image */}
          <div className="flex justify-center mb-3">
            {building?.buildingLogo ? (
              <div className="relative">
                <img
                  src={`${baseURL}${building.buildingLogo}`}
                  alt={`${building.buildingName} logo`}
                  className="h-16 w-16 rounded-full object-cover border-4 border-secondary shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">{building?.userCount || 0}</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-primary flex items-center justify-center bg-secondary shadow-lg">
                  <span className="text-textColor opacity-50 text-xs font-medium">
                    {t("buildings.noImage")}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">{building?.userCount || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Building Name */}
          <div className="text-center mb-3 px-2">
            <Tooltip content={building?.buildingName}>
              <h3 className="text-lg font-bold text-textColor mb-2 group-hover:text-brandText transition-colors duration-200 break-words cursor-help">
                {building?.buildingName}
              </h3>
            </Tooltip>
          </div>

          {/* Building Details - Windows Style */}
          <div className="space-y-1.5 mb-3">
            {building?.buildingCode && (
              <div className="bg-secondary rounded-lg p-2.5 shadow-inner">
                <div className="flex items-start gap-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-textColor opacity-70 block mb-1">{t("buildings.buildingCode")}:</span>
                    <Tooltip content={building.buildingCode}>
                      <span className="text-textColor font-semibold break-words cursor-help block">
                        {building.buildingCode}
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}
            
            {building?.buildingAddress && (
              <div className="bg-secondary rounded-lg p-2.5 shadow-inner">
                <div className="flex items-start gap-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-textColor opacity-70 block mb-1">{t("buildings.buildingAddress")}:</span>
                    <Tooltip content={building.buildingAddress}>
                      <span className="text-textColor font-semibold break-words cursor-help block">
                        {building.buildingAddress}
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}
            
            {building?.buildingDescription && (
              <div className="bg-secondary rounded-lg p-2.5 shadow-inner">
                <div className="flex items-start gap-2 text-xs">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-textColor opacity-70 block mb-1">{t("buildings.buildingDescription")}:</span>
                    <Tooltip content={building.buildingDescription}>
                      <span className="text-textColor font-semibold break-words cursor-help block">
                        {building.buildingDescription}
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Building Base - User Count */}
          <div className="flex justify-center mb-3">
            <Tooltip content={`${t("buildings.userCount")}: ${building?.userCount || 0}`}>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg max-w-full cursor-help">
                <span className="truncate block">{t("buildings.userCount")}: {building?.userCount || 0}</span>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Building Foundation - Action Buttons */}
        <div className="bg-primary px-3 py-2 rounded-b-xl border-t border-primary">
          <div className="flex justify-center gap-2">
            <AddEditBuilding buildingToEdit={building}>
              <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 transform">
                <CiEdit className="text-sm" />
                <span className="sr-only">{t("buildings.editBuilding")}</span>
              </button>
            </AddEditBuilding>

            <DeleteBuilding buildingId={building?._id} />

            <Link 
              to={`/building/${building?._id}`} 
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 transform"
            >
              <BiShow className="text-sm" />
              <span className="sr-only">{t("general.view")}</span>
            </Link>
          </div>
        </div>

        {/* Building Windows Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 left-4 w-2 h-2 bg-blue-300 dark:bg-blue-500 rounded-full opacity-60"></div>
          <div className="absolute top-12 right-4 w-2 h-2 bg-blue-300 dark:bg-blue-500 rounded-full opacity-60"></div>
          <div className="absolute top-16 left-4 w-2 h-2 bg-blue-300 dark:bg-blue-500 rounded-full opacity-60"></div>
          <div className="absolute top-16 right-4 w-2 h-2 bg-blue-300 dark:bg-blue-500 rounded-full opacity-60"></div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/20 group-hover:via-purple-50/20 group-hover:to-pink-50/20 dark:group-hover:from-blue-900/10 dark:group-hover:via-purple-900/10 dark:group-hover:to-pink-900/10 transition-all duration-300 rounded-xl pointer-events-none"></div>
      </div>
    </div>
  );
}

export default BuildingCard;
