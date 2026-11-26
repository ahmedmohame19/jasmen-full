import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaExclamationTriangle,
  FaChartLine,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
} from "react-icons/fa";
import Spinner from "../../ui/spinner/Spinner";
import Tooltip from "../../ui/Tooltip";
import DateRangePicker from "../../ui/DateRangePicker";

function RiskPerformanceTab({
  riskData,
  riskLoading,
  riskPeriod,
  riskCount,
  riskStartDate,
  riskEndDate,
  onRiskPeriodChange,
  onRiskCountChange,
  onRiskStartDateChange,
  onRiskEndDateChange,
  performanceData,
  performanceLoading,
}) {
  const [t] = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState("risk");

  const subTabs = [
    { id: "risk", label: t("users.riskAssessment"), icon: FaExclamationTriangle },
    { id: "performance", label: t("users.performanceMetrics"), icon: FaChartLine },
  ];

  const getRiskLevelColor = (level) => {
    if (level === "high") return "text-red-500 bg-red-500/10";
    if (level === "medium") return "text-yellow-500 bg-yellow-500/10";
    return "text-green-500 bg-green-500/10";
  };

  const getPerformanceLevelColor = (level) => {
    if (level === "excellent") return "text-green-500";
    if (level === "good") return "text-blue-500";
    if (level === "fair") return "text-yellow-500";
    return "text-red-500";
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
      {/* Sub-tabs */}
      <div className="surface-card p-[10px]">
        <div className="flex items-center gap-2 border-b border-primary overflow-x-auto">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-md transition-colors duration-200 whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? "bg-colorBrand text-white"
                    : "text-textColor opacity-70 hover:opacity-100"
                }`}
              >
                <Icon />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Risk Assessment Tab */}
      {activeSubTab === "risk" && (
        <div className="flex flex-col gap-4">
          {riskLoading ? (
            <Spinner height="h-64" />
          ) : (
            <>
              {/* Controls - Always visible */}
              <div className="surface-card p-[10px]">
                <div className="flex flex-col gap-4">
                  {/* Date Range Picker */}
                  <DateRangePicker
                    startDate={riskStartDate || riskData?.period?.startDate}
                    endDate={riskEndDate || riskData?.period?.endDate}
                    onStartDateChange={onRiskStartDateChange}
                    onEndDateChange={onRiskEndDateChange}
                    period={riskPeriod}
                    onPeriodChange={onRiskPeriodChange}
                    periods={["day", "week", "month", "year"]}
                    showPeriodSelector={true}
                    showDatePickers={true}
                  />

                  {/* Count Input */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-textColor opacity-70">{t("users.count")}:</label>
                    <input
                      type="number"
                      min="1"
                      max={riskPeriod === "year" ? 10 : riskPeriod === "month" ? 24 : riskPeriod === "week" ? 52 : 30}
                      value={riskCount}
                      onChange={(e) => onRiskCountChange(parseInt(e.target.value) || 1)}
                      className="px-3 py-2 rounded-md bg-primary border border-primary text-textColor focus:outline-none focus:border-colorBrand w-20"
                    />
                    <Tooltip content={t("users.numberOfPeriods")}>
                      <FaInfoCircle className="text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Show message if no data */}
              {(!riskData || riskData.hasData === false) && (
                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
                  <p className="text-textColor text-sm">{riskData?.message || "No risk assessment data available. Need at least 5 data points for risk analysis."}</p>
                </div>
              )}

              {/* Current Period Info */}
              {riskData?.period && (
                <div className="surface-card p-[10px]">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-textColor">
                      <FaCalendarAlt className="opacity-70" />
                      <span className="opacity-70">{t("users.currentPeriod")}:</span>
                      <span className="font-semibold">
                        {new Date(riskData.period.startDate).toLocaleDateString()} - {new Date(riskData.period.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-textColor">
                      <span className="opacity-70">{t("users.periodType")}:</span>
                      <span className="font-semibold capitalize">{riskData.period.period || riskPeriod}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Assessment Data - Only show if hasData is true */}
              {riskData && riskData.hasData !== false && riskData.riskAssessment && (
                <>
                  <div className="flex flex-col gap-6">
                  {/* Risk Score and Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.riskScore") || "Risk Score"}
                        <Tooltip content={t("users.riskScoreTooltip") || "Overall risk score from 0-100. Higher scores indicate greater risk."}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div
                        className={`text-3xl font-bold mt-2 ${
                          riskData.riskAssessment.riskScore >= 70
                            ? "text-red-500"
                            : riskData.riskAssessment.riskScore >= 40
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {riskData.riskAssessment.riskScore != null 
                          ? Number(riskData.riskAssessment.riskScore).toFixed(0) 
                          : "0"}
                      </div>
                      <div
                        className={`text-sm mt-1 px-2 py-1 rounded inline-block ${getRiskLevelColor(
                          riskData.riskAssessment.riskLevel
                        )}`}
                      >
                        {riskData.riskAssessment.riskLevel === "no_data" 
                          ? t("users.noData") || "NO DATA"
                          : riskData.riskAssessment.riskLevel === "insufficient_data"
                          ? t("users.insufficientData") || "INSUFFICIENT DATA"
                          : riskData.riskAssessment.riskLevel.toUpperCase()}
                      </div>
                    </div>

                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.anomaliesDetected")}
                        <Tooltip content={t("users.anomaliesDetectedTooltip") || "Number of consumption anomalies detected (consumption deviating more than 2 standard deviations from average)"}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </div>
                      <div className="text-3xl font-bold text-textColor mt-2">
                        {riskData.riskAssessment.anomalies?.length || 0}
                      </div>
                      <div className="text-xs text-textColor opacity-50 mt-1">
                        {t("users.topAnomalies") || "Top anomalies"} ({riskData.riskAssessment.anomalies?.length || 0} {t("users.shown") || "shown"})
                      </div>
                    </div>

                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.limitUtilization") || "Limit Utilization"}
                        <Tooltip content={t("users.limitUtilizationTooltip") || "Percentage of consumption limit currently being used. Values above 90% indicate high risk of exceeding limit."}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div
                        className={`text-3xl font-bold mt-2 ${
                          riskData.riskAssessment.statistics?.limitUtilization >= 90
                            ? "text-red-500"
                            : riskData.riskAssessment.statistics?.limitUtilization >= 70
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {riskData.riskAssessment.statistics?.limitUtilization != null 
                          ? Number(riskData.riskAssessment.statistics.limitUtilization).toFixed(1) 
                          : "0.0"}%
                      </div>
                      {riskData.riskAssessment.statistics?.consumptionLimit != null && (
                        <div className="text-xs text-textColor opacity-50 mt-1">
                          {t("users.limit")}: {Number(riskData.riskAssessment.statistics.consumptionLimit).toFixed(2)} L
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Statistics Overview */}
                  {riskData.riskAssessment.statistics && (
                    <div className="surface-card p-[10px]">
                      <h4 className="font-semibold text-textColor mb-4 flex items-center gap-2">
                        {t("users.statistics") || "Statistics Overview"}
                        <Tooltip content={t("users.statisticsOverviewTooltip") || "Key statistical measures for risk assessment"}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                            {t("users.avgConsumption")}
                            <Tooltip content={t("users.avgConsumptionTooltip")}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </div>
                          <div className="text-lg font-bold text-textColor">
                            {riskData.riskAssessment.statistics.avgConsumption != null 
                              ? Number(riskData.riskAssessment.statistics.avgConsumption).toFixed(2) 
                              : "0.00"} L
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                            {t("users.stdDeviation") || "Std Deviation"}
                            <Tooltip content={t("users.stdDeviationTooltip") || "Standard deviation of consumption. Higher values indicate more variability in consumption patterns."}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </div>
                          <div className="text-lg font-bold text-textColor">
                            {riskData.riskAssessment.statistics.stdDeviation != null 
                              ? Number(riskData.riskAssessment.statistics.stdDeviation).toFixed(2) 
                              : "0.00"} L
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                            {t("users.currentConsumption") || "Current"}
                            <Tooltip content={t("users.currentConsumptionTooltip") || "Most recent consumption value"}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </div>
                          <div className="text-lg font-bold text-textColor">
                            {riskData.riskAssessment.statistics.currentConsumption != null 
                              ? Number(riskData.riskAssessment.statistics.currentConsumption).toFixed(2) 
                              : "0.00"} L
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                            {t("users.consumptionLimit") || "Limit"}
                            <Tooltip content={t("users.consumptionLimitTooltip") || "Maximum allowed consumption limit"}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </div>
                          <div className="text-lg font-bold text-textColor">
                            {riskData.riskAssessment.statistics.consumptionLimit != null 
                              ? Number(riskData.riskAssessment.statistics.consumptionLimit).toFixed(2) 
                              : "N/A"} L
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                            {t("users.limitUtilization") || "Utilization"}
                            <Tooltip content={t("users.limitUtilizationTooltip")}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </div>
                          <div className={`text-lg font-bold ${
                            riskData.riskAssessment.statistics.limitUtilization >= 90
                              ? "text-red-500"
                              : riskData.riskAssessment.statistics.limitUtilization >= 70
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}>
                            {riskData.riskAssessment.statistics.limitUtilization != null 
                              ? Number(riskData.riskAssessment.statistics.limitUtilization).toFixed(1) 
                              : "0.0"}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {riskData.riskAssessment.risks && riskData.riskAssessment.risks.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-textColor mb-3">{t("users.identifiedRisks")}</h4>
                      <div className="space-y-3">
                        {riskData.riskAssessment.risks.map((risk, index) => (
                          <div
                            key={index}
                            className={`bg-primary rounded-lg p-4 border-l-4 ${
                              risk.severity === "high"
                                ? "border-red-500"
                                : risk.severity === "medium"
                                ? "border-yellow-500"
                                : "border-blue-500"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                      risk.severity === "high"
                                        ? "bg-red-500 text-white"
                                        : risk.severity === "medium"
                                        ? "bg-yellow-500 text-white"
                                        : "bg-blue-500 text-white"
                                    }`}
                                  >
                                    {t(`users.${risk.severity}`).toUpperCase()}
                                  </span>
                                  <span className="font-semibold text-textColor">
                                    {t("users.type")}: {risk.type.replace(/_/g, " ").toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-textColor text-sm mb-2">{risk.description}</p>
                                <p className="text-textColor opacity-70 text-sm">
                                  <strong>{t("users.recommendations")}:</strong> {risk.recommendation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Anomalies Table */}
                  {riskData.riskAssessment.anomalies &&
                    riskData.riskAssessment.anomalies.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                          <FaExclamationTriangle className="text-yellow-500" />
                          {t("users.anomalies") || "Anomalies"}
                          <span className="text-sm font-normal opacity-70">
                            ({riskData.riskAssessment.anomalies.length} {t("users.detected") || "detected"})
                          </span>
                          <Tooltip content={t("users.anomaliesTooltip") || "Consumption values that deviate significantly from the average (more than 2 standard deviations). Spikes indicate unusually high consumption, drops indicate unusually low consumption."}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-primary">
                                <th className="text-left py-3 px-4 text-textColor font-semibold">
                                  {t("users.date")}
                                  <Tooltip content={t("users.dateTooltip") || "Date when the anomaly occurred"}>
                                    <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                  </Tooltip>
                                </th>
                                <th className="text-right py-3 px-4 text-textColor font-semibold">
                                  {t("users.consumption")}
                                  <Tooltip content={t("users.consumptionTooltip") || "Actual consumption value on this date"}>
                                    <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                  </Tooltip>
                                </th>
                                <th className="text-right py-3 px-4 text-textColor font-semibold">
                                  {t("users.deviation")}
                                  <Tooltip content={t("users.deviationTooltip") || "Difference from average consumption. Positive values indicate above-average consumption, negative values indicate below-average consumption."}>
                                    <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                  </Tooltip>
                                </th>
                                <th className="text-right py-3 px-4 text-textColor font-semibold">
                                  {t("users.zScores") || "Z-Score"}
                                  <Tooltip content={t("users.zScoreTooltip") || "Statistical measure indicating how many standard deviations the consumption is from the average. Values above 2 or below -2 indicate anomalies."}>
                                    <FaInfoCircle className="inline ml-2 text-xs cursor-help" />
                                  </Tooltip>
                                </th>
                                <th className="text-center py-3 px-4 text-textColor font-semibold">
                                  {t("users.type")}
                                  <Tooltip content={t("users.anomalyTypeTooltip") || "Type of anomaly: 'spike' indicates unusually high consumption, 'drop' indicates unusually low consumption"}>
                                    <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                  </Tooltip>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {riskData.riskAssessment.anomalies.map((anomaly, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-primary hover:bg-primary transition-colors"
                                >
                                  <td className="py-3 px-4 text-textColor font-medium">
                                    {new Date(anomaly.date).toLocaleDateString()}
                                  </td>
                                  <td className="py-3 px-4 text-textColor text-right font-semibold">
                                    {anomaly.consumption != null 
                                      ? Number(anomaly.consumption).toFixed(2) 
                                      : "0.00"} L
                                  </td>
                                  <td
                                    className={`py-3 px-4 text-right font-semibold ${
                                      anomaly.deviation != null && anomaly.deviation > 0 ? "text-red-500" : "text-green-500"
                                    }`}
                                  >
                                    {anomaly.deviation != null && anomaly.deviation > 0 ? "+" : ""}
                                    {anomaly.deviation != null 
                                      ? Number(anomaly.deviation).toFixed(2) 
                                      : "0.00"} L
                                  </td>
                                  <td className="py-3 px-4 text-right text-textColor">
                                    {anomaly.zScore != null 
                                      ? Number(anomaly.zScore).toFixed(2) 
                                      : "0.00"}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-semibold ${
                                        anomaly.type === "spike"
                                          ? "bg-red-500 text-white"
                                          : "bg-blue-500 text-white"
                                      }`}
                                    >
                                      {anomaly.type === "spike" 
                                        ? (t("users.spike") || "SPIKE")
                                        : (t("users.drop") || "DROP")}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  {riskData.recommendations && riskData.recommendations.length > 0 && (
                    <div className="bg-primary rounded-lg p-4">
                      <h4 className="font-semibold text-textColor mb-2 flex items-center gap-2">
                        <FaCheckCircle className="text-brandText" />
                        {t("users.recommendations") || "Recommendations"}
                        <Tooltip content={t("users.recommendationsTooltip") || "Actionable recommendations based on identified risks and anomalies"}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </h4>
                      <ul className="space-y-2">
                        {riskData.recommendations.map((rec, index) => (
                          <li key={index} className="text-textColor text-sm flex items-start gap-2">
                            <span className="text-brandText mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Performance Metrics Tab */}
      {activeSubTab === "performance" && (
        <div className="flex flex-col gap-4">
          {performanceLoading ? (
            <Spinner height="h-64" />
          ) : (
            <>
              {/* Show message if no data */}
              {(!performanceData || performanceData.hasData === false) && (
                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
                  <p className="text-textColor text-sm">{performanceData?.message || "No performance metrics data available. Consumption data is required for performance analysis."}</p>
                </div>
              )}

              {/* Performance Metrics Data - Only show if hasData is true */}
              {performanceData && performanceData.hasData !== false && (
                <div className="surface-card p-[10px]">
                  <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                    <FaChartLine />
                    {t("users.performanceMetrics")}
                    <Tooltip content={t("users.performanceMetricsTooltip")}>
                      <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                    </Tooltip>
                  </h3>

                      {performanceData.performanceScore !== undefined && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.performanceScore") || "Performance Score"}
                          <Tooltip content={t("users.performanceScoreTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help" />
                          </Tooltip>
                        </div>
                        <div
                          className={`text-4xl font-bold mt-2 ${getPerformanceLevelColor(
                            performanceData.performanceLevel
                          )}`}
                        >
                          {performanceData.performanceScore != null 
                            ? Number(performanceData.performanceScore).toFixed(0) 
                            : "0"}
                        </div>
                        <div
                          className={`text-sm mt-1 capitalize ${getPerformanceLevelColor(
                            performanceData.performanceLevel
                          )}`}
                        >
                          {performanceData.performanceLevel.replace("_", " ")}
                        </div>
                      </div>

                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.dataPoints")}
                          <Tooltip content={t("users.dataPointsTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className="text-2xl font-bold text-textColor mt-2">
                          {performanceData.metadata?.dataPoints || 0}
                        </div>
                      </div>
                    </div>
                  )}

                  {performanceData.metrics && (
                    <div className="space-y-4">
                      {/* Consumption Metrics */}
                      {performanceData.metrics.consumption && (
                        <div className="bg-primary rounded-lg p-4">
                          <h4 className="font-semibold text-textColor mb-3">{t("users.consumptionMetrics")}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                                {t("users.total")}
                                <Tooltip content={t("users.totalConsumptionTooltip")}>
                                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </div>
                              <div className="text-lg font-bold text-textColor">
                                {performanceData.metrics.consumption.total != null 
                                  ? Number(performanceData.metrics.consumption.total).toFixed(2) 
                                  : "0.00"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                                {t("users.average")}
                                <Tooltip content={t("users.avgConsumptionTooltip")}>
                                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </div>
                              <div className="text-lg font-bold text-textColor">
                                {performanceData.metrics.consumption.average != null 
                                  ? Number(performanceData.metrics.consumption.average).toFixed(2) 
                                  : "0.00"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                                {t("users.max")}
                                <Tooltip content={t("users.maxConsumptionTooltip")}>
                                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </div>
                              <div className="text-lg font-bold text-textColor">
                                {performanceData.metrics.consumption.max != null 
                                  ? Number(performanceData.metrics.consumption.max).toFixed(2) 
                                  : "0.00"}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                                {t("users.min")}
                                <Tooltip content={t("users.minConsumptionTooltip")}>
                                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </div>
                              <div className="text-lg font-bold text-textColor">
                                {performanceData.metrics.consumption.min != null 
                                  ? Number(performanceData.metrics.consumption.min).toFixed(2) 
                                  : "0.00"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Consistency Metrics */}
                      {performanceData.metrics.consistency && (
                        <div className="bg-primary rounded-lg p-4">
                          <h4 className="font-semibold text-textColor mb-3">{t("users.consistency")}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                                {t("users.coefficientOfVariation") || "Coefficient of Variation"}
                                <Tooltip content={t("users.coefficientOfVariationTooltip")}>
                                  <FaInfoCircle className="text-xs cursor-help" />
                                </Tooltip>
                              </div>
                              <div className="text-xl font-bold text-textColor mt-2">
                                {performanceData.metrics.consistency.coefficientOfVariation != null 
                                  ? Number(performanceData.metrics.consistency.coefficientOfVariation).toFixed(2) 
                                  : "0.00"}%
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                                {t("users.stability")}
                                <Tooltip content={t("users.stabilityTooltip")}>
                                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </div>
                              <div className="text-xl font-bold text-textColor mt-2 capitalize">
                                {performanceData.metrics.consistency.stability.replace("_", " ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Trends */}
                      {performanceData.metrics.trends && (
                        <div className="bg-primary rounded-lg p-4">
                          <h4 className="font-semibold text-textColor mb-3">{t("users.trends")}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-textColor opacity-70">{t("users.direction")}</div>
                              <div className="flex items-center gap-2 mt-2">
                                {performanceData.metrics.trends.direction === "increasing" ? (
                                  <FaArrowUp className="text-red-500" />
                                ) : performanceData.metrics.trends.direction === "decreasing" ? (
                                  <FaArrowDown className="text-green-500" />
                                ) : (
                                  <span className="text-gray-500">—</span>
                                )}
                                <span className="text-xl font-bold text-textColor capitalize">
                                  {getTrendLabel(performanceData.metrics.trends.direction)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                                {t("users.growthRate")}
                                <Tooltip content={t("users.growthRateTooltip")}>
                                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </div>
                              <div
                                className={`text-xl font-bold mt-2 ${
                                  performanceData.metrics.trends.growthRate != null && performanceData.metrics.trends.growthRate > 0
                                    ? "text-red-500"
                                    : performanceData.metrics.trends.growthRate != null && performanceData.metrics.trends.growthRate < 0
                                    ? "text-green-500"
                                    : "text-textColor"
                                }`}
                              >
                                {performanceData.metrics.trends.growthRate != null && performanceData.metrics.trends.growthRate > 0 ? "+" : ""}
                                {performanceData.metrics.trends.growthRate != null 
                                  ? Number(performanceData.metrics.trends.growthRate).toFixed(2) 
                                  : "0.00"}%
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Insights */}
                      {performanceData.insights && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {performanceData.insights.strengths &&
                            performanceData.insights.strengths.length > 0 && (
                              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                                <h4 className="font-semibold text-green-500 mb-2 flex items-center gap-2">
                                  <FaCheckCircle />
                                  {t("users.strengths")}
                                </h4>
                                <ul className="space-y-1">
                                  {performanceData.insights.strengths.map((strength, index) => (
                                    <li key={index} className="text-textColor text-sm">
                                      • {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                          {performanceData.insights.areasForImprovement &&
                            performanceData.insights.areasForImprovement.length > 0 && (
                              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                                <h4 className="font-semibold text-yellow-500 mb-2 flex items-center gap-2">
                                  <FaTimesCircle />
                                  {t("users.areasForImprovement")}
                                </h4>
                                <ul className="space-y-1">
                                  {performanceData.insights.areasForImprovement.map((area, index) => (
                                    <li key={index} className="text-textColor text-sm">
                                      • {area}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              </>
            )}
        </div>
      )}
    </div>
  );
}

export default RiskPerformanceTab;

