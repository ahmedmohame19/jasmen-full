import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaCode, FaInfoCircle, FaImage } from "react-icons/fa";
import { baseURL } from "../../services/axios";

function BuildingInfo({ building }) {
  const [t] = useTranslation();

  return (
    <div className="surface-card p-[10px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Building Logo */}
        {building.buildingLogo && (
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
              <FaImage className="text-blue-500" />
              {t("buildings.buildingLogo")}
            </h3>
            <img
              src={`${baseURL}${building.buildingLogo}`}
              alt={`${building.buildingName} logo`}
              className="h-32 w-32 rounded-lg object-cover border-4 border-secondary shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="h-32 w-32 rounded-lg border-4 border-primary items-center justify-center bg-primary shadow-lg hidden"
            >
              <span className="text-textColor opacity-50 text-sm font-medium">
                {t("buildings.noImage")}
              </span>
            </div>
          </div>
        )}

        {/* Building Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" />
            {t("buildings.buildingInformation")}
          </h3>
          
          <div className="space-y-3">
            {building.buildingCode && (
              <div className="flex items-center gap-3 p-4 bg-primary rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <FaCode className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-textColor opacity-70 font-medium">
                    {t("buildings.buildingCode")}
                  </div>
                  <div className="font-semibold text-textColor">
                    {building.buildingCode}
                  </div>
                </div>
              </div>
            )}

            {building.buildingAddress && (
              <div className="flex items-center gap-3 p-4 bg-primary rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-textColor opacity-70 font-medium">
                    {t("buildings.buildingAddress")}
                  </div>
                  <div className="font-semibold text-textColor">
                    {building.buildingAddress}
                  </div>
                </div>
              </div>
            )}

            {building.buildingDescription && (
              <div className="flex items-start gap-3 p-4 bg-primary rounded-lg">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mt-1">
                  <FaInfoCircle className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-textColor opacity-70 font-medium">
                    {t("buildings.buildingDescription")}
                  </div>
                  <div className="font-semibold text-textColor">
                    {building.buildingDescription}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuildingInfo;
