import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useChartColors } from "../../hooks/useChartColors";
import {
  FaCog,
  FaTint,
  FaHeartbeat,
  FaLightbulb,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";
import Chart from "react-apexcharts";
import Spinner from "../../ui/spinner/Spinner";
import Empty from "../../ui/Empty";
import Tooltip from "../../ui/Tooltip";
import DateRangePicker from "../../ui/DateRangePicker";

function PumpAnalysisTab({
  pumpEfficiencyData,
  pumpEfficiencyLoading,
  leakData,
  leakLoading,
  leakPeriod,
  leakCount,
  leakStartDate,
  leakEndDate,
  leakThreshold,
  onLeakPeriodChange,
  onLeakCountChange,
  onLeakStartDateChange,
  onLeakEndDateChange,
  onLeakThresholdChange,
  cycleData,
  cycleLoading,
  healthData,
  healthLoading,
  optimizationData,
  optimizationLoading,
}) {
  const chartColors = useChartColors();
  const [t] = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState("efficiency");

  const subTabs = [
    { id: "efficiency", label: t("users.efficiency"), icon: FaCog },
    { id: "leak", label: t("users.leakDetection"), icon: FaTint },
    { id: "cycle", label: t("users.cycleAnalysis"), icon: FaCog },
    { id: "health", label: t("users.healthMonitoring"), icon: FaHeartbeat },
    { id: "optimization", label: t("users.optimization"), icon: FaLightbulb },
  ];

  const getHealthColor = (level) => {
    if (level === "excellent" || level === "good") return "text-green-500";
    if (level === "fair" || level === "moderate") return "text-yellow-500";
    return "text-red-500";
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

      {/* Efficiency Tab */}
      {activeSubTab === "efficiency" && (
        <div className="flex flex-col gap-4">
          {pumpEfficiencyLoading ? (
            <Spinner height="h-64" />
          ) : !pumpEfficiencyData || pumpEfficiencyData.hasData === false ? (
            <Empty message={pumpEfficiencyData?.message || "No pump efficiency data available. Consumption data is required for efficiency analysis."} />
          ) : (
            <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaCog />
                {t("users.pumpEfficiencyAnalysis")}
                <Tooltip content={t("users.pumpEfficiencyTooltip")}>
                  <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                </Tooltip>
              </h3>

              {pumpEfficiencyData.overallEfficiency && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.avgConsumptionPerCycle")}
                      <Tooltip content={t("users.avgConsumptionPerCycleTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-textColor mt-2">
                      {pumpEfficiencyData.overallEfficiency.avgConsumptionPerCycle.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.pumpUtilizationRate") || "Pump Utilization Rate"}
                      <Tooltip content={t("users.pumpUtilizationRateTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-textColor mt-2">
                      {pumpEfficiencyData.overallEfficiency.pumpUtilizationRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.cyclesPerDay")}
                      <Tooltip content={t("users.cyclesPerDayTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-textColor mt-2">
                      {pumpEfficiencyData.overallEfficiency.cyclesPerDay.toFixed(1)}
                    </div>
                  </div>
                </div>
              )}

              {pumpEfficiencyData.efficiencyTrend && (
                <div className="bg-primary rounded-lg p-4 mb-4">
                  <div className="text-sm text-textColor opacity-70">{t("users.efficiencyTrend")}</div>
                  <div className="flex items-center gap-2 mt-2">
                    {pumpEfficiencyData.efficiencyTrend === "improving" ? (
                      <FaArrowUp className="text-green-500" />
                    ) : pumpEfficiencyData.efficiencyTrend === "declining" ? (
                      <FaArrowDown className="text-red-500" />
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                    <span className="text-xl font-bold text-textColor capitalize">
                      {t(`users.${pumpEfficiencyData.efficiencyTrend}`) || pumpEfficiencyData.efficiencyTrend}
                    </span>
                  </div>
                </div>
              )}

              {pumpEfficiencyData.insights && (
                <div className="bg-primary rounded-lg p-4">
                  <h4 className="font-semibold text-textColor mb-2">{t("users.insights")}</h4>
                  <div className="mb-3">
                    <span className="text-sm text-textColor opacity-70">{t("users.pumpHealth")}: </span>
                    <span
                      className={`font-semibold capitalize ${getHealthColor(
                        pumpEfficiencyData.insights.pumpHealth
                      )}`}
                    >
                      {pumpEfficiencyData.insights.pumpHealth.replace("_", " ")}
                    </span>
                  </div>
                  {pumpEfficiencyData.insights.recommendations &&
                    pumpEfficiencyData.insights.recommendations.length > 0 && (
                      <ul className="space-y-2">
                        {pumpEfficiencyData.insights.recommendations.map((rec, index) => (
                          <li key={index} className="text-textColor text-sm flex items-start gap-2">
                            <span className="text-brandText">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Leak Detection Tab */}
      {activeSubTab === "leak" && (
        <div className="flex flex-col gap-4">
          {leakLoading ? (
            <Spinner height="h-64" />
          ) : (
            <>
              {/* Date Range Picker and Controls - Always visible */}
              <div className="surface-card p-[10px]">
                <div className="flex flex-wrap items-center gap-4">
                  <DateRangePicker
                    startDate={leakStartDate || leakData?.period?.startDate}
                    endDate={leakEndDate || leakData?.period?.endDate}
                    onStartDateChange={onLeakStartDateChange}
                    onEndDateChange={onLeakEndDateChange}
                    period={leakPeriod}
                    onPeriodChange={onLeakPeriodChange}
                    periods={["day", "week", "month", "year"]}
                    showPeriodSelector={true}
                    showDatePickers={true}
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-textColor opacity-70">{t("users.count")}:</label>
                    <input
                      type="number"
                      min="1"
                      max={leakPeriod === "year" ? 10 : leakPeriod === "month" ? 24 : leakPeriod === "week" ? 52 : 30}
                      value={leakCount}
                      onChange={(e) => onLeakCountChange(parseInt(e.target.value) || 1)}
                      className="px-3 py-2 rounded-md bg-primary border border-primary text-textColor focus:outline-none focus:border-colorBrand w-20"
                    />
                    <Tooltip content={t("users.numberOfPeriods")}>
                      <FaInfoCircle className="text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-textColor opacity-70">{t("users.threshold")}:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="1"
                      value={leakThreshold}
                      onChange={(e) => onLeakThresholdChange(parseFloat(e.target.value))}
                      className="px-3 py-2 rounded-md bg-primary border border-primary text-textColor focus:outline-none focus:border-colorBrand w-20"
                    />
                    <Tooltip content={t("users.sensitivityThreshold")}>
                      <FaInfoCircle className="text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Show message if no data or insufficient data */}
              {(!leakData || leakData.hasData === false) && (
                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
                  <p className="text-textColor text-sm">{leakData?.message || "No leak detection data available. Need at least 3 days of data for leak detection."}</p>
                </div>
              )}

              {/* Current Period Info */}
              {leakData?.period && (
                <div className="surface-card p-[10px]">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-textColor">
                      <FaCalendarAlt className="opacity-70" />
                      <span className="opacity-70">{t("users.currentPeriod")}:</span>
                      <span className="font-semibold">
                        {new Date(leakData.period.startDate).toLocaleDateString()} - {new Date(leakData.period.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-textColor">
                      <span className="opacity-70">{t("users.periodType")}:</span>
                      <span className="font-semibold capitalize">{leakData.period.period || leakPeriod}</span>
                    </div>
                    {leakData.leakDetection?.totalDaysAnalyzed && (
                      <div className="flex items-center gap-2 text-textColor">
                        <span className="opacity-70">{t("users.daysAnalyzed")}:</span>
                        <span className="font-semibold">{leakData.leakDetection.totalDaysAnalyzed}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Leak Detection Data - Only show if hasData is true */}
              {leakData && leakData.hasData !== false && leakData.leakDetection && (
                <div className="flex flex-col gap-6">
                  {/* Risk Score and Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.leakRiskScore")}
                        <Tooltip content={t("users.riskScoreTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div
                        className={`text-4xl font-bold mt-2 ${
                          leakData.leakDetection.leakRiskScore >= 70
                            ? "text-red-500"
                            : leakData.leakDetection.leakRiskScore >= 40
                            ? "text-yellow-500"
                            : leakData.leakDetection.leakRiskScore >= 20
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      >
                        {leakData.leakDetection.leakRiskScore != null 
                          ? Number(leakData.leakDetection.leakRiskScore).toFixed(0) 
                          : "0"}
                      </div>
                      <div
                        className={`text-sm mt-1 px-2 py-1 rounded inline-block capitalize ${
                          leakData.leakDetection.riskLevel === "high"
                            ? "bg-red-500/20 text-red-500"
                            : leakData.leakDetection.riskLevel === "medium"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : leakData.leakDetection.riskLevel === "low"
                            ? "bg-blue-500/20 text-blue-500"
                            : "bg-green-500/20 text-green-500"
                        }`}
                      >
                        {t(`users.${leakData.leakDetection.riskLevel || "minimal"}`)} {t("users.risk") || "RISK"}
                      </div>
                    </div>

                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.suspiciousDays")}
                        <Tooltip content={t("users.suspiciousDaysTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="text-4xl font-bold text-textColor mt-2">
                        {leakData.leakDetection.suspiciousDays || 0}
                      </div>
                      {leakData.leakDetection.totalDaysAnalyzed && (
                        <div className="text-xs text-textColor opacity-50 mt-1 flex items-center gap-2">
                          <span>
                            {leakData.leakDetection.suspiciousDaysPercentage != null 
                              ? Number(leakData.leakDetection.suspiciousDaysPercentage).toFixed(1) 
                              : "0"}% {t("general.of")} {leakData.leakDetection.totalDaysAnalyzed} {t("users.days") || "days"}
                          </span>
                          <Tooltip content={t("users.suspiciousDaysPercentageTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                      )}
                    </div>

                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.consecutiveLeakDays")}
                        <Tooltip content={t("users.consecutiveLeakDaysTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="text-4xl font-bold text-textColor mt-2">
                        {leakData.leakDetection.consecutiveLeakDays || 0}
                      </div>
                      {leakData.leakDetection.consecutiveLeakDays > 3 && (
                        <div className="text-xs text-red-500 mt-1 font-semibold">
                          ⚠️ {t("users.requiresImmediateAttention")}
                        </div>
                      )}
                    </div>

                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70">{t("users.riskDistribution")}</div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-red-500">{t("users.high")}:</span>
                          <span className="font-semibold text-textColor">{leakData.leakDetection.highRiskDays || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-yellow-500">{t("users.medium")}:</span>
                          <span className="font-semibold text-textColor">{leakData.leakDetection.mediumRiskDays || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-500">{t("users.low")}:</span>
                          <span className="font-semibold text-textColor">{leakData.leakDetection.lowRiskDays || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Baseline Metrics */}
                  {leakData.leakDetection.baseline && (
                    <div className="surface-card p-[10px]">
                      <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                        {t("users.baselineMetrics")}
                        <Tooltip content={t("users.baselineMetricsTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                            {t("users.avgConsumption")}
                            <Tooltip content={t("users.avgConsumptionTooltip")}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </div>
                          <div className="text-lg font-bold text-textColor">
                            {leakData.leakDetection.baseline.avgConsumption != null 
                              ? Number(leakData.leakDetection.baseline.avgConsumption).toFixed(2) 
                              : "0.00"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                            {t("users.avgFlowRate")}
                            <Tooltip content={t("users.avgFlowRateTooltip")}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </div>
                          <div className="text-lg font-bold text-textColor">
                            {leakData.leakDetection.baseline.avgFlowRate != null 
                              ? Number(leakData.leakDetection.baseline.avgFlowRate).toFixed(2) 
                              : "0.00"}
                          </div>
                        </div>
                        {leakData.leakDetection.baseline.avgStatusChanges != null && (
                          <div>
                            <div className="text-xs text-textColor opacity-70 flex items-center gap-2">
                              {t("users.avgStatusChanges")}
                              <Tooltip content={t("users.avgStatusChangesTooltip")}>
                                <FaInfoCircle className="text-xs cursor-help opacity-70" />
                              </Tooltip>
                            </div>
                            <div className="text-lg font-bold text-textColor">
                              {Number(leakData.leakDetection.baseline.avgStatusChanges).toFixed(2)}
                            </div>
                          </div>
                        )}
                        {leakData.leakDetection.baseline.baselineDays != null && (
                          <div>
                            <div className="text-xs text-textColor opacity-70">{t("users.baselineDays")}</div>
                            <div className="text-lg font-bold text-textColor">
                              {leakData.leakDetection.baseline.baselineDays}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Leak Patterns */}
                  {leakData.leakDetection.leakPatterns && (
                    <div className="surface-card p-[10px]">
                      <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                        {t("users.leakPatternsDetected")}
                        <Tooltip content={t("users.leakPatternsTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-primary rounded-lg p-3">
                          <div className="text-xs text-textColor opacity-70">{t("users.continuousLeak")}</div>
                          <div className="text-xl font-bold text-textColor mt-1">
                            {leakData.leakDetection.leakPatterns.continuousLeak || 0}
                          </div>
                        </div>
                        <div className="bg-primary rounded-lg p-3">
                          <div className="text-xs text-textColor opacity-70">{t("users.suddenSpike")}</div>
                          <div className="text-xl font-bold text-textColor mt-1">
                            {leakData.leakDetection.leakPatterns.suddenSpike || 0}
                          </div>
                        </div>
                        <div className="bg-primary rounded-lg p-3">
                          <div className="text-xs text-textColor opacity-70">{t("users.statisticalAnomaly")}</div>
                          <div className="text-xl font-bold text-textColor mt-1">
                            {leakData.leakDetection.leakPatterns.statisticalAnomaly || 0}
                          </div>
                        </div>
                        <div className="bg-primary rounded-lg p-3">
                          <div className="text-xs text-textColor opacity-70">{t("users.consumptionWithoutPump")}</div>
                          <div className="text-xl font-bold text-textColor mt-1">
                            {leakData.leakDetection.leakPatterns.consumptionWithoutPump || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Charts */}
                  {leakData.leakDetection.leakIndicators && leakData.leakDetection.leakIndicators.length > 0 && (
                    <>
                      {/* Risk Distribution Chart */}
                      {leakData.leakDetection.highRiskDays != null && (
                        <div className="surface-card p-[10px]">
                          <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                            <FaChartLine />
                            {t("users.riskDistribution")}
                            <Tooltip content={t("users.riskDistributionTooltip")}>
                              <FaInfoCircle className="text-xs cursor-help opacity-70" />
                            </Tooltip>
                          </h4>
                          <Chart
                            options={{
                              chart: {
                                type: "donut",
                                height: 300,
                              },
                              labels: [
                                `${t("users.high")} ${t("users.risk") || "Risk"}`,
                                `${t("users.medium")} ${t("users.risk") || "Risk"}`,
                                `${t("users.low")} ${t("users.risk") || "Risk"}`
                              ],
                              colors: [chartColors.series[3], chartColors.series[2], chartColors.series[0]],
                              legend: {
                                position: "bottom",
                                labels: {
                                  colors: chartColors.axis,
                                },
                              },
                              tooltip: {
                                theme: chartColors.colorScheme,
                                y: {
                                  formatter: (val) => `${val} ${t("users.days") || "days"}`,
                                },
                                style: {
                                  fontSize: "12px",
                                },
                              },
                            }}
                            series={[
                              leakData.leakDetection.highRiskDays || 0,
                              leakData.leakDetection.mediumRiskDays || 0,
                              leakData.leakDetection.lowRiskDays || 0,
                            ]}
                            type="donut"
                            height={300}
                          />
                        </div>
                      )}

                      {/* Leak Risk Score Chart */}
                      {(() => {
                        const chartData = leakData.leakDetection.leakIndicators.slice(0, 30).map(ind => ({
                          date: new Date(ind.date).toLocaleDateString(),
                          leakScore: ind.leakScore || 0,
                          consumption: ind.dailyConsumption || 0,
                          flowRate: ind.avgFlowRate || 0,
                        }));

                        const leakScoreChartOptions = {
                          chart: {
                            type: "line",
                            height: 300,
                            toolbar: { show: true },
                            zoom: { enabled: true },
                          },
                          stroke: { curve: "smooth", width: 2 },
                          xaxis: {
                            categories: chartData.map(d => d.date),
                            labels: { 
                              rotate: -45, 
                              rotateAlways: false,
                              style: {
                                colors: chartColors.axis,
                              },
                            },
                          },
                          yaxis: {
                            title: { text: t("users.leakRiskScore") },
                            min: 0,
                            max: 100,
                            labels: {
                              style: {
                                colors: chartColors.axis,
                              },
                            },
                          },
                          colors: [chartColors.series[3]],
                          tooltip: {
                            theme: chartColors.colorScheme,
                            shared: true,
                            intersect: false,
                            style: {
                              fontSize: "12px",
                            },
                          },
                        };

                        return (
                          <div className="surface-card p-[10px]">
                            <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                              <FaChartLine />
                              {t("users.leakRiskScoreOverTime")}
                              <Tooltip content={t("users.leakRiskScoreOverTimeTooltip")}>
                                <FaInfoCircle className="text-xs cursor-help opacity-70" />
                              </Tooltip>
                            </h4>
                            <Chart
                              options={leakScoreChartOptions}
                              series={[{
                                name: t("users.leakRiskScore"),
                                data: chartData.map(d => d.leakScore),
                              }]}
                              type="line"
                              height={300}
                            />
                          </div>
                        );
                      })()}

                      {/* Consumption vs Flow Rate Chart */}
                      {(() => {
                        const chartData = leakData.leakDetection.leakIndicators.slice(0, 30).map(ind => ({
                          date: new Date(ind.date).toLocaleDateString(),
                          consumption: ind.dailyConsumption || 0,
                          flowRate: ind.avgFlowRate || 0,
                          leakScore: ind.leakScore || 0,
                        }));

                        const consumptionChartOptions = {
                          chart: {
                            type: "line",
                            height: 300,
                            toolbar: { show: true },
                            zoom: { enabled: true },
                          },
                          stroke: { curve: "smooth", width: 2 },
                          xaxis: {
                            categories: chartData.map(d => d.date),
                            labels: { 
                              rotate: -45, 
                              rotateAlways: false,
                              style: {
                                colors: chartColors.axis,
                              },
                            },
                          },
                          yaxis: {
                            title: { text: t("users.value") || "Value" },
                            labels: {
                              style: {
                                colors: chartColors.axis,
                              },
                            },
                          },
                          colors: [chartColors.series[0], chartColors.series[1]],
                          legend: { 
                            position: "top",
                            labels: {
                              colors: chartColors.axis,
                            },
                          },
                          tooltip: { 
                            theme: chartColors.colorScheme,
                            shared: true, 
                            intersect: false,
                            style: {
                              fontSize: "12px",
                            },
                          },
                        };

                        return (
                          <div className="surface-card p-[10px]">
                            <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                              <FaChartLine />
                              {t("users.consumptionVsFlowRate")}
                              <Tooltip content={t("users.consumptionVsFlowRateTooltip")}>
                                <FaInfoCircle className="text-xs cursor-help opacity-70" />
                              </Tooltip>
                            </h4>
                            <Chart
                              options={consumptionChartOptions}
                              series={[
                                { name: t("users.consumption"), data: chartData.map(d => d.consumption) },
                                { name: t("users.flowRate"), data: chartData.map(d => d.flowRate) },
                              ]}
                              type="line"
                              height={300}
                            />
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {/* Leak Indicators */}
                  {leakData.leakDetection.leakIndicators &&
                    leakData.leakDetection.leakIndicators.length > 0 && (
                      <div className="surface-card p-[10px]">
                        <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                          {t("users.leakIndicators")} ({leakData.leakDetection.leakIndicators.length})
                          <Tooltip content={t("users.leakIndicatorsTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {leakData.leakDetection.leakIndicators.map((indicator, index) => (
                            <div
                              key={index}
                              className={`bg-primary rounded-lg p-4 border-l-4 ${
                                indicator.leakProbability === "high"
                                  ? "border-red-500"
                                  : indicator.leakProbability === "medium"
                                  ? "border-yellow-500"
                                  : "border-blue-500"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold text-textColor">
                                      {new Date(indicator.date).toLocaleDateString()}
                                    </span>
                                    <span
                                      className={`px-2 py-1 rounded text-xs ${
                                        indicator.leakProbability === "high"
                                          ? "bg-red-500 text-white"
                                          : indicator.leakProbability === "medium"
                                          ? "bg-yellow-500 text-white"
                                          : "bg-blue-500 text-white"
                                      }`}
                                    >
                                      {t(`users.${indicator.leakProbability || "low"}`).toUpperCase()} {t("users.probability")}
                                    </span>
                                    {indicator.leakScore != null && (
                                      <span className="text-xs text-textColor opacity-70">
                                        {t("users.score")}: {Number(indicator.leakScore).toFixed(0)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-textColor opacity-70">
                                    <div>{t("users.consumption")}: {indicator.dailyConsumption != null ? Number(indicator.dailyConsumption).toFixed(2) : "0.00"}</div>
                                    <div>{t("users.flowRate")}: {indicator.avgFlowRate != null ? Number(indicator.avgFlowRate).toFixed(2) : "0.00"}</div>
                                    {indicator.minFlowRate != null && (
                                      <div>{t("users.minFlow")}: {Number(indicator.minFlowRate).toFixed(2)}</div>
                                    )}
                                    <div>{t("users.cycles")}: {indicator.statusChanges || 0}</div>
                                    {indicator.resetCount != null && indicator.resetCount > 0 && (
                                      <div>{t("users.resets")}: {indicator.resetCount}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {indicator.indicators && indicator.indicators.length > 0 && (
                                <div className="mt-3 space-y-1">
                                  {indicator.indicators.map((ind, idx) => (
                                    <div
                                      key={idx}
                                      className={`text-xs p-2 rounded ${
                                        ind.severity === "high"
                                          ? "bg-red-500/20 text-red-500 border border-red-500/30"
                                          : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">
                                        {ind.type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                      </div>
                                      <div className="opacity-90">{ind.description}</div>
                                      {ind.flowToConsumptionRatio != null && (
                                        <div className="mt-1 opacity-70">
                                          {t("users.flowConsumptionRatio")}: {Number(ind.flowToConsumptionRatio).toFixed(3)} ({t("users.expected")}: {ind.expectedRatio != null ? Number(ind.expectedRatio).toFixed(3) : "N/A"})
                                        </div>
                                      )}
                                      {ind.increasePercent != null && (
                                        <div className="mt-1 opacity-70">
                                          {t("users.increase")}: {Number(ind.increasePercent).toFixed(1)}%
                                        </div>
                                      )}
                                      {ind.consumptionZScore != null && (
                                        <div className="mt-1 opacity-70">
                                          {t("users.zScores")}: {t("users.consumptionZScore")}={Number(ind.consumptionZScore).toFixed(2)}, {t("users.flowZScore")}={ind.flowZScore != null ? Number(ind.flowZScore).toFixed(2) : "N/A"}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Recommendations */}
                  {leakData.recommendations && leakData.recommendations.length > 0 && (
                    <div className="bg-primary rounded-lg p-4">
                      <h4 className="font-semibold text-textColor mb-2 flex items-center gap-2">
                        <FaExclamationTriangle className="text-red-500" />
                        {t("users.recommendations")}
                      </h4>
                      <ul className="space-y-2">
                        {leakData.recommendations.map((rec, index) => (
                          <li key={index} className="text-textColor text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Cycle Analysis Tab */}
      {activeSubTab === "cycle" && (
        <div className="flex flex-col gap-4">
          {cycleLoading ? (
            <Spinner height="h-64" />
          ) : !cycleData || cycleData.hasData === false ? (
            <Empty message={cycleData?.message || "No cycle analysis data available. Consumption data is required for cycle analysis."} />
          ) : (
            <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaCog />
                {t("users.pumpCycleAnalysis")}
                <Tooltip content={t("users.pumpCycleAnalysisTooltip")}>
                  <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                </Tooltip>
              </h3>

              {cycleData.cycleStatistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.totalCycles")}
                      <Tooltip content={t("users.totalCyclesTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-textColor mt-2">
                      {cycleData.cycleStatistics.totalCycles}
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.avgCyclesPerDay")}
                      <Tooltip content={t("users.avgCyclesPerDayTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-textColor mt-2">
                      {cycleData.cycleStatistics.avgCyclesPerDay.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.avgConsumptionPerCycle")}
                      <Tooltip content={t("users.avgConsumptionPerCycleTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-textColor mt-2">
                      {cycleData.cycleStatistics.avgConsumptionPerCycle.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.resetToCycleRatio")}
                      <Tooltip content={t("users.resetToCycleRatioTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-2xl font-bold text-textColor mt-2">
                      {cycleData.cycleStatistics.resetToCycleRatio.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              {cycleData.patterns && (
                <div className="bg-primary rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-textColor mb-3">{t("users.usagePatterns")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.weekdayCycles")}
                        <Tooltip content={t("users.weekdayCyclesTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </div>
                      <div className="text-xl font-bold text-textColor">
                        {cycleData.patterns.weekdayVsWeekend?.avgWeekdayCycles.toFixed(1) || 0}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.weekendCycles")}
                        <Tooltip content={t("users.weekendCyclesTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </div>
                      <div className="text-xl font-bold text-textColor">
                        {cycleData.patterns.weekdayVsWeekend?.avgWeekendCycles.toFixed(1) || 0}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {cycleData.insights && cycleData.insights.recommendations && (
                <div className="bg-primary rounded-lg p-4">
                  <h4 className="font-semibold text-textColor mb-2">{t("users.recommendations")}</h4>
                  <ul className="space-y-2">
                    {cycleData.insights.recommendations.map((rec, index) => (
                      <li key={index} className="text-textColor text-sm flex items-start gap-2">
                        <span className="text-brandText">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Health Monitoring Tab */}
      {activeSubTab === "health" && (
        <div className="flex flex-col gap-4">
          {healthLoading ? (
            <Spinner height="h-64" />
          ) : !healthData || healthData.hasData === false ? (
            <Empty message={healthData?.message || "No health monitoring data available. Consumption data is required for health monitoring."} />
          ) : (
            <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaHeartbeat />
                {t("users.pumpHealthMonitoring")}
                <Tooltip content={t("users.pumpHealthMonitoringTooltip")}>
                  <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                </Tooltip>
              </h3>

              {healthData.pumpHealth && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.overallHealthScore")}
                        <Tooltip content={t("users.healthScoreTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div
                        className={`text-4xl font-bold mt-2 ${getHealthColor(
                          healthData.pumpHealth.healthLevel
                        )}`}
                      >
                        {healthData.pumpHealth.overallHealthScore.toFixed(0)}
                      </div>
                      <div
                        className={`text-sm mt-1 capitalize ${getHealthColor(
                          healthData.pumpHealth.healthLevel
                        )}`}
                      >
                        {healthData.pumpHealth.healthLevel.replace("_", " ")}
                      </div>
                    </div>

                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70">{t("users.trend")}</div>
                      <div className="flex items-center gap-2 mt-2">
                        {healthData.pumpHealth.trend === "improving" ? (
                          <FaArrowUp className="text-green-500" />
                        ) : healthData.pumpHealth.trend === "declining" ? (
                          <FaArrowDown className="text-red-500" />
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                        <span className="text-xl font-bold text-textColor capitalize">
                          {t(`users.${healthData.pumpHealth.trend}`) || healthData.pumpHealth.trend}
                        </span>
                      </div>
                    </div>
                  </div>

                  {healthData.pumpHealth.healthIndicators && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.efficiencyStatus")}
                          <Tooltip content={t("users.efficiencyStatusTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div
                          className={`text-xl font-bold mt-2 capitalize ${getHealthColor(
                            healthData.pumpHealth.healthIndicators.efficiency.status
                          )}`}
                        >
                          {healthData.pumpHealth.healthIndicators.efficiency.status}
                        </div>
                        <div className="text-xs text-textColor opacity-50 mt-1">
                          {healthData.pumpHealth.healthIndicators.efficiency.consumptionPerCycle.toFixed(
                            2
                          )}{" "}
                          {t("users.perCycle")}
                        </div>
                      </div>
                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.reliabilityStatus")}
                          <Tooltip content={t("users.reliabilityStatusTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div
                          className={`text-xl font-bold mt-2 capitalize ${getHealthColor(
                            healthData.pumpHealth.healthIndicators.reliability.status
                          )}`}
                        >
                          {healthData.pumpHealth.healthIndicators.reliability.status}
                        </div>
                        <div className="text-xs text-textColor opacity-50 mt-1 flex items-center gap-2">
                          <span>
                            {t("users.resetRate")}:{" "}
                            {healthData.pumpHealth.healthIndicators.reliability.resetRate.toFixed(1)}%
                          </span>
                          <Tooltip content={t("users.resetRateTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                      </div>
                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.performanceStatus")}
                          <Tooltip content={t("users.performanceStatusTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div
                          className={`text-xl font-bold mt-2 capitalize ${getHealthColor(
                            healthData.pumpHealth.healthIndicators.performance.status
                          )}`}
                        >
                          {healthData.pumpHealth.healthIndicators.performance.status}
                        </div>
                        <div className="text-xs text-textColor opacity-50 mt-1 flex items-center gap-2">
                          <span>
                            {t("users.avgFlow")}:{" "}
                            {healthData.pumpHealth.healthIndicators.performance.avgFlowRate.toFixed(
                              1
                            )}
                          </span>
                          <Tooltip content={t("users.avgFlowTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}

                  {healthData.recommendations && healthData.recommendations.length > 0 && (
                    <div className="bg-primary rounded-lg p-4">
                      <h4 className="font-semibold text-textColor mb-2">{t("users.recommendations")}</h4>
                      <ul className="space-y-2">
                        {healthData.recommendations.map((rec, index) => (
                          <li key={index} className="text-textColor text-sm flex items-start gap-2">
                            <span className="text-brandText">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Optimization Tab */}
      {activeSubTab === "optimization" && (
        <div className="flex flex-col gap-4">
          {optimizationLoading ? (
            <Spinner height="h-64" />
          ) : !optimizationData || optimizationData.hasData === false ? (
            <Empty message={optimizationData?.message || "No optimization data available. Consumption data is required for optimization analysis."} />
          ) : (
            <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaLightbulb />
                {t("users.pumpOperationOptimization")}
                <Tooltip content={t("users.pumpOperationOptimizationTooltip")}>
                  <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                </Tooltip>
              </h3>

              {optimizationData.currentOperation && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.avgConsumptionPerDay")}
                      <Tooltip content={t("users.avgConsumptionPerDayTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-xl font-bold text-textColor mt-2">
                      {optimizationData.currentOperation.avgConsumptionPerDay.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.avgCyclesPerDay")}
                      <Tooltip content={t("users.avgCyclesPerDayTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-xl font-bold text-textColor mt-2">
                      {optimizationData.currentOperation.avgCyclesPerDay.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.avgConsumptionPerCycle")}
                      <Tooltip content={t("users.avgConsumptionPerCycleTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-xl font-bold text-textColor mt-2">
                      {optimizationData.currentOperation.avgConsumptionPerCycle.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-primary rounded-lg p-4">
                    <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                      {t("users.efficiencyScore")}
                      <Tooltip content={t("users.efficiencyScoreTooltip")}>
                        <FaInfoCircle className="text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </div>
                    <div className="text-xl font-bold text-textColor mt-2">
                      {optimizationData.currentOperation.efficiencyScore.toFixed(0)}
                    </div>
                  </div>
                </div>
              )}

              {optimizationData.optimizations && optimizationData.optimizations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-textColor mb-3">{t("users.optimizationOpportunities")}</h4>
                  <div className="space-y-3">
                    {optimizationData.optimizations.map((opt, index) => (
                      <div
                        key={index}
                        className={`bg-primary rounded-lg p-4 border-l-4 ${
                          opt.priority === "high"
                            ? "border-red-500"
                            : opt.priority === "medium"
                            ? "border-yellow-500"
                            : "border-blue-500"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  opt.priority === "high"
                                    ? "bg-red-500 text-white"
                                    : "bg-yellow-500 text-white"
                                }`}
                              >
                                {t(`users.${opt.priority}`).toUpperCase()} {t("users.priority")}
                              </span>
                              <span className="font-semibold text-textColor">
                                {t("users.type")}: {opt.type.replace(/_/g, " ").toUpperCase()}
                              </span>
                            </div>
                            <p className="text-textColor text-sm mb-2">{opt.description}</p>
                            <p className="text-textColor opacity-70 text-sm mb-2">
                              <strong>{t("users.recommendations")}:</strong> {opt.recommendation}
                            </p>
                            <p className="text-textColor opacity-70 text-sm">
                              <strong>{t("users.expectedImpact")}:</strong> {opt.expectedImpact}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {optimizationData.actionPlan && optimizationData.actionPlan.length > 0 && (
                <div className="bg-primary rounded-lg p-4">
                  <h4 className="font-semibold text-textColor mb-2">{t("users.actionPlan")}</h4>
                  <ul className="space-y-2">
                    {optimizationData.actionPlan.map((action, index) => (
                      <li key={index} className="text-textColor text-sm flex items-start gap-2">
                        <span className="text-brandText">•</span>
                        <div className="flex-1">
                          <span className="font-semibold">{action.action}</span>
                          <div className="text-xs text-textColor opacity-70 mt-1">
                            {action.expectedImpact}
                          </div>
                        </div>
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
  );
}

export default PumpAnalysisTab;

