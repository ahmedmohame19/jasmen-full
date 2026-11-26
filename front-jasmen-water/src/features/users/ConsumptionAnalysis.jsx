import { useTranslation } from "react-i18next";
import { FaChartBar, FaArrowUp, FaArrowDown, FaEquals, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import Spinner from "../../ui/spinner/Spinner";
import Tooltip from "../../ui/Tooltip";

function ConsumptionAnalysis({ data, isLoading, comparePeriod, compareCount, onComparePeriodChange, onCompareCountChange }) {
  const [t] = useTranslation();

  const periods = ["day", "week", "month", "year"];
  const maxCounts = {
    day: 30,
    week: 52,
    month: 24,
    year: 10
  };

  if (isLoading) return <Spinner height="h-64" />;

  const getTrendIcon = (trend) => {
    if (trend === "increasing") return <FaArrowUp className="text-red-500" />;
    if (trend === "decreasing") return <FaArrowDown className="text-green-500" />;
    return <FaEquals className="text-gray-500" />;
  };

  const getTrendLabel = (trend) => {
    if (!trend) {
      const stable = t("users.trend.stable");
      return stable && !stable.startsWith("users.trend.") ? stable : "Stable";
    }
    
    const normalizedTrend = String(trend).toLowerCase();
    const translationKey = `users.trend.${normalizedTrend}`;
    const translated = t(translationKey);
    
    // If translation returns the key itself (i18next default behavior when key not found)
    // or if it's null/undefined, use fallback
    if (!translated || translated === translationKey || translated.startsWith("users.trend.")) {
      // Fallback: capitalize the trend value
      return normalizedTrend.charAt(0).toUpperCase() + normalizedTrend.slice(1);
    }
    
    return translated;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls - Always visible */}
      <div className="surface-card p-[10px]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-textColor font-medium">{t("users.comparePeriod")}:</label>
            <select
              value={comparePeriod}
              onChange={(e) => onComparePeriodChange(e.target.value)}
              className="px-4 py-2 rounded-md bg-primary border border-primary text-textColor focus:outline-none focus:border-colorBrand"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {t(`users.periodTypes.${p}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-textColor font-medium">{t("users.compareCount")}:</label>
            <input
              type="number"
              min="2"
              max={maxCounts[comparePeriod]}
              value={compareCount}
              onChange={(e) => onCompareCountChange(e.target.value)}
              className="px-4 py-2 rounded-md bg-primary border border-primary text-textColor focus:outline-none focus:border-colorBrand w-20"
            />
          </div>
        </div>
      </div>

      {/* Show message if no data */}
      {(!data || (data.hasData === false) || !data.periods || data.periods.length === 0) && (
        <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
          <p className="text-textColor text-sm">{data?.message || t("users.noConsumptionData") || "No consumption data available for analysis. Data will appear once water consumption records are created."}</p>
        </div>
      )}

      {/* User Info */}
      {data && data.user && (
        <div className="surface-card p-[10px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-textColor opacity-70">{t("general.name")}</div>
              <div className="font-semibold text-textColor">{data.user.userName}</div>
            </div>
            <div>
              <div className="text-sm text-textColor opacity-70">{t("general.email")}</div>
              <div className="font-semibold text-textColor">{data.user.email}</div>
            </div>
            <div>
              <div className="text-sm text-textColor opacity-70">{t("users.roomNumber")}</div>
              <div className="font-semibold text-textColor">{data.user.roomNumber}</div>
            </div>
          </div>
        </div>
      )}

      {/* Message Display (if exists) */}
      {data?.message && (
        <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
          <p className="text-textColor text-sm">{data.message}</p>
        </div>
      )}

      {/* Statistics Overview */}
      {data && data.statistics && data.statistics.descriptive && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="surface-card p-4">
            <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
              {t("users.overallAvgConsumption")}
              <Tooltip content={t("users.overallAvgConsumptionTooltip")}>
                <FaInfoCircle className="text-xs cursor-help opacity-70" />
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-textColor mt-2">
              {data.statistics.descriptive.overallAvgConsumption != null 
                ? Number(data.statistics.descriptive.overallAvgConsumption).toFixed(2) 
                : "0.00"}
            </div>
          </div>
          {data.statistics.descriptive.overallTotalConsumption !== undefined && data.statistics.descriptive.overallTotalConsumption !== null && (
            <div className="surface-card p-4">
              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                {t("users.overallTotalConsumption")}
                <Tooltip content={t("users.overallTotalConsumptionTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </div>
              <div className="text-2xl font-bold text-textColor mt-2">
                {Number(data.statistics.descriptive.overallTotalConsumption).toFixed(2)}
              </div>
            </div>
          )}
          {data.statistics.descriptive.maxConsumption !== undefined && data.statistics.descriptive.maxConsumption !== null && (
            <div className="surface-card p-4">
              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                {t("users.maxConsumption")}
                <Tooltip content={t("users.maxConsumptionTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </div>
              <div className="text-2xl font-bold text-textColor mt-2">
                {Number(data.statistics.descriptive.maxConsumption).toFixed(2)}
              </div>
            </div>
          )}
          {data.statistics.descriptive.minConsumption !== undefined && data.statistics.descriptive.minConsumption !== null && (
            <div className="surface-card p-4">
              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                {t("users.minConsumption")}
                <Tooltip content={t("users.minConsumptionTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </div>
              <div className="text-2xl font-bold text-textColor mt-2">
                {Number(data.statistics.descriptive.minConsumption).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trend Analysis */}
      {data && data.statistics?.trend && (
        <div className="surface-card p-[10px]">
          <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
            <FaChartBar />
            {t("users.trendAnalysis")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-textColor opacity-70">{t("users.trendDirection")}</div>
              <div className="flex items-center gap-2 mt-2">
                {getTrendIcon(data.statistics.trend.direction)}
                <span className="font-semibold text-textColor capitalize">
                  {getTrendLabel(data.statistics.trend.direction)}
                </span>
              </div>
            </div>
            {data.statistics.trend.totalGrowthPercent !== undefined && data.statistics.trend.totalGrowthPercent !== null && (
              <div>
                <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                  {t("users.totalGrowthPercent")}
                  <Tooltip content={t("users.totalGrowthPercentTooltip")}>
                    <FaInfoCircle className="text-xs cursor-help opacity-70" />
                  </Tooltip>
                </div>
                <div className="text-xl font-bold text-textColor mt-2">
                  {Number(data.statistics.trend.totalGrowthPercent).toFixed(2)}%
                </div>
              </div>
            )}
            {data.statistics.trend.magnitude !== undefined && data.statistics.trend.magnitude !== null && (
              <div>
                <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                  {t("users.trendMagnitude")}
                  <Tooltip content={t("users.trendMagnitudeTooltip")}>
                    <FaInfoCircle className="text-xs cursor-help opacity-70" />
                  </Tooltip>
                </div>
                <div className="text-xl font-bold text-textColor mt-2">
                  {Number(data.statistics.trend.magnitude).toFixed(2)}
                </div>
              </div>
            )}
            {data.statistics.trend.rSquared !== undefined && data.statistics.trend.rSquared !== null && (
              <div>
                <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                  {t("users.rSquaredScore")}
                  <Tooltip content={t("users.rSquaredTooltip")}>
                    <FaInfoCircle className="text-xs cursor-help opacity-70" />
                  </Tooltip>
                </div>
                <div className="text-xl font-bold text-textColor mt-2">
                  {Number(data.statistics.trend.rSquared).toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparisons */}
      {data && data.comparisons && data.comparisons.length > 0 && (
        <div className="surface-card p-[10px]">
          <h3 className="text-lg font-semibold text-textColor mb-4">{t("users.periodComparisons")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary">
                  <th className="text-left py-3 px-4 text-textColor font-semibold">{t("users.fromPeriod")}</th>
                  <th className="text-left py-3 px-4 text-textColor font-semibold">{t("users.toPeriod")}</th>
                  <th className="text-right py-3 px-4 text-textColor font-semibold">
                    {t("users.consumption")} ({t("users.fromPeriod")})
                    <Tooltip content={t("users.avgConsumptionTooltip")}>
                      <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </th>
                  <th className="text-right py-3 px-4 text-textColor font-semibold">
                    {t("users.consumption")} ({t("users.toPeriod")})
                    <Tooltip content={t("users.avgConsumptionTooltip")}>
                      <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </th>
                  <th className="text-right py-3 px-4 text-textColor font-semibold">
                    {t("users.consumptionDifference")}
                    <Tooltip content={t("users.consumptionDifferenceTooltip")}>
                      <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </th>
                  <th className="text-right py-3 px-4 text-textColor font-semibold">
                    {t("users.percentChange")}
                    <Tooltip content={t("users.percentChangeTooltip")}>
                      <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </th>
                  <th className="text-center py-3 px-4 text-textColor font-semibold">{t("users.trend")}</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisons.map((comparison, index) => {
                  // Find consumption values from periods data
                  const fromPeriodData = data.periods?.find(p => p.period === comparison.fromPeriod);
                  const toPeriodData = data.periods?.find(p => p.period === comparison.toPeriod);
                  const fromConsumption = fromPeriodData?.avgConsumption || fromPeriodData?.totalConsumption || comparison.fromConsumption || null;
                  const toConsumption = toPeriodData?.avgConsumption || toPeriodData?.totalConsumption || comparison.toConsumption || null;

                  return (
                    <tr key={index} className="border-b border-primary hover:bg-primary transition-colors">
                      <td className="py-3 px-4 text-textColor">{comparison.fromPeriod}</td>
                      <td className="py-3 px-4 text-textColor">{comparison.toPeriod}</td>
                      <td className="py-3 px-4 text-textColor text-right">
                        {fromConsumption != null ? Number(fromConsumption).toFixed(2) : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-textColor text-right">
                        {toConsumption != null ? Number(toConsumption).toFixed(2) : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-textColor text-right">
                        {comparison.consumptionDifference != null && comparison.consumptionDifference > 0 ? "+" : ""}
                        {comparison.consumptionDifference != null 
                          ? Number(comparison.consumptionDifference).toFixed(2) 
                          : "0.00"}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${
                        comparison.consumptionPercentChange != null && comparison.consumptionPercentChange > 0 ? "text-red-500" : 
                        comparison.consumptionPercentChange != null && comparison.consumptionPercentChange < 0 ? "text-green-500" : 
                        "text-textColor"
                      }`}>
                        {comparison.consumptionPercentChange != null && comparison.consumptionPercentChange > 0 ? "+" : ""}
                        {comparison.consumptionPercentChange != null 
                          ? Number(comparison.consumptionPercentChange).toFixed(2) 
                          : "0.00"}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getTrendIcon(comparison.trend)}
                          <span className="text-sm capitalize">
                            {getTrendLabel(comparison.trend)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Anomalies */}
      {data && data.statistics?.anomalies && data.statistics.anomalies.length > 0 && (
        <div className="surface-card p-[10px]">
          <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            {t("users.anomalies")}
          </h3>
          <div className="space-y-2">
            {data.statistics.anomalies.map((anomaly, index) => (
              <div key={index} className="p-3 bg-primary rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-textColor font-medium">{anomaly.period}</span>
                  <span className="text-textColor">
                    {t("users.consumption")}: {anomaly.consumption != null 
                      ? Number(anomaly.consumption).toFixed(2) 
                      : "0.00"} | 
                    {t("users.deviation")}: {anomaly.deviation != null && anomaly.deviation > 0 ? "+" : ""}
                    {anomaly.deviation != null 
                      ? Number(anomaly.deviation).toFixed(2) 
                      : "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsumptionAnalysis;

