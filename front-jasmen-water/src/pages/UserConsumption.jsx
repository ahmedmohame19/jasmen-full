import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaChartLine,
  FaChartBar,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCog,
} from "react-icons/fa";

import { useUser } from "../features/users/useUser";
import {
  useConsumptionByPeriod,
  useConsumptionAnalysis,
  useConsumptionForecast,
  useConsumptionCorrelation,
  useConsumptionSeasonality,
  useConsumptionBenchmark,
  useConsumptionRiskAssessment,
  useConsumptionPerformanceMetrics,
  usePumpEfficiencyAnalysis,
  useLeakDetectionAnalysis,
  usePumpCycleAnalysis,
  usePumpHealthMonitoring,
  usePumpOperationOptimization,
} from "../features/users/useConsumption";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Spinner from "../ui/spinner/Spinner";
import Empty from "../ui/Empty";
import ConsumptionByPeriod from "../features/users/ConsumptionByPeriod";
import ConsumptionAnalysis from "../features/users/ConsumptionAnalysis";
import AdvancedAnalysisTab from "../features/users/AdvancedAnalysisTab";
import RiskPerformanceTab from "../features/users/RiskPerformanceTab";
import PumpAnalysisTab from "../features/users/PumpAnalysisTab";

function UserConsumption() {
  const { id } = useParams();
  const [t] = useTranslation();
  const [activeTab, setActiveTab] = useState("period");
  const [period, setPeriod] = useState("day");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [comparePeriod, setComparePeriod] = useState("day");
  const [compareCount, setCompareCount] = useState(7);

  // Seasonality parameters
  const [seasonalityPeriod, setSeasonalityPeriod] = useState("month");
  const [seasonalityDateRangePeriod, setSeasonalityDateRangePeriod] =
    useState("year");
  const [seasonalityCount, setSeasonalityCount] = useState(1);
  const [seasonalityStartDate, setSeasonalityStartDate] = useState(null);
  const [seasonalityEndDate, setSeasonalityEndDate] = useState(null);

  // Risk Assessment parameters
  const [riskPeriod, setRiskPeriod] = useState("month");
  const [riskCount, setRiskCount] = useState(1);
  const [riskStartDate, setRiskStartDate] = useState(null);
  const [riskEndDate, setRiskEndDate] = useState(null);

  const { isLoading: userLoading, userData } = useUser(id);

  // Basic Analysis
  const { isLoading: periodLoading, data: periodData } = useConsumptionByPeriod(
    id,
    {
      period,
      startDate,
      endDate,
      includeProjections: true,
    },
  );
  const { isLoading: analysisLoading, data: analysisData } =
    useConsumptionAnalysis(id, {
      comparePeriod,
      compareCount: parseInt(compareCount),
      startDate,
      endDate,
    });

  // Advanced Analysis
  const { isLoading: forecastLoading, data: forecastData } =
    useConsumptionForecast(id, {
      forecastPeriods: 7,
      method: "linear",
    });
  const { isLoading: correlationLoading, data: correlationData } =
    useConsumptionCorrelation(id, {
      days: 30,
    });
  const { isLoading: seasonalityLoading, data: seasonalityData } =
    useConsumptionSeasonality(id, {
      period: seasonalityPeriod,
      dateRangePeriod: seasonalityDateRangePeriod,
      count: seasonalityCount,
      startDate: seasonalityStartDate,
      endDate: seasonalityEndDate,
    });
  const { isLoading: benchmarkLoading, data: benchmarkData } =
    useConsumptionBenchmark(id, {
      period: "month",
    });

  // Risk & Performance
  const { isLoading: riskLoading, data: riskData } =
    useConsumptionRiskAssessment(id, {
      period: riskPeriod,
      count: riskCount,
      startDate: riskStartDate,
      endDate: riskEndDate,
    });
  const { isLoading: performanceLoading, data: performanceData } =
    useConsumptionPerformanceMetrics(id, {
      period: "month",
    });

  // Pump Analysis - State for leak detection
  const [leakPeriod, setLeakPeriod] = useState("week");
  const [leakCount, setLeakCount] = useState(1);
  const [leakStartDate, setLeakStartDate] = useState(null);
  const [leakEndDate, setLeakEndDate] = useState(null);
  const [leakThreshold, setLeakThreshold] = useState(0.1);

  const { isLoading: pumpEfficiencyLoading, data: pumpEfficiencyData } =
    usePumpEfficiencyAnalysis(id, { days: 30 });
  const { isLoading: leakLoading, data: leakData } = useLeakDetectionAnalysis(
    id,
    {
      period: leakPeriod,
      count: leakCount,
      startDate: leakStartDate,
      endDate: leakEndDate,
      threshold: leakThreshold,
    },
  );
  const { isLoading: cycleLoading, data: cycleData } = usePumpCycleAnalysis(
    id,
    { days: 30 },
  );
  const { isLoading: healthLoading, data: healthData } =
    usePumpHealthMonitoring(id, {
      days: 30,
    });
  const { isLoading: optimizationLoading, data: optimizationData } =
    usePumpOperationOptimization(id, { days: 30 });

  if (userLoading) return <Spinner height="h-[calc(100vh-160px)]" />;
  if (!userData) return <Empty message={t("users.userNotFound")} />;

  const tabs = [
    {
      id: "period",
      label: t("users.consumptionByPeriod"),
      icon: FaCalendarAlt,
      category: "basic",
    },
    {
      id: "analysis",
      label: t("users.consumptionAnalysis"),
      icon: FaChartBar,
      category: "basic",
    },
    {
      id: "advanced",
      label: t("users.advancedAnalysis"),
      icon: FaChartLine,
      category: "advanced",
    },
    {
      id: "risk",
      label: t("users.riskPerformance"),
      icon: FaExclamationTriangle,
      category: "risk",
    },
    {
      id: "pump",
      label: t("users.pumpAnalysis"),
      icon: FaCog,
      category: "pump",
    },
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case "period":
        return (
          <ConsumptionByPeriod
            data={periodData}
            isLoading={periodLoading}
            period={period}
            onPeriodChange={setPeriod}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        );
      case "analysis":
        return (
          <ConsumptionAnalysis
            data={analysisData}
            isLoading={analysisLoading}
            comparePeriod={comparePeriod}
            compareCount={compareCount}
            onComparePeriodChange={setComparePeriod}
            onCompareCountChange={setCompareCount}
          />
        );
      case "advanced":
        return (
          <AdvancedAnalysisTab
            forecastData={forecastData}
            forecastLoading={forecastLoading}
            correlationData={correlationData}
            correlationLoading={correlationLoading}
            seasonalityData={seasonalityData}
            seasonalityLoading={seasonalityLoading}
            seasonalityPeriod={seasonalityPeriod}
            seasonalityDateRangePeriod={seasonalityDateRangePeriod}
            seasonalityCount={seasonalityCount}
            seasonalityStartDate={seasonalityStartDate}
            seasonalityEndDate={seasonalityEndDate}
            onSeasonalityPeriodChange={setSeasonalityPeriod}
            onSeasonalityDateRangePeriodChange={setSeasonalityDateRangePeriod}
            onSeasonalityCountChange={setSeasonalityCount}
            onSeasonalityStartDateChange={setSeasonalityStartDate}
            onSeasonalityEndDateChange={setSeasonalityEndDate}
            benchmarkData={benchmarkData}
            benchmarkLoading={benchmarkLoading}
          />
        );
      case "risk":
        return (
          <RiskPerformanceTab
            riskData={riskData}
            riskLoading={riskLoading}
            riskPeriod={riskPeriod}
            riskCount={riskCount}
            riskStartDate={riskStartDate}
            riskEndDate={riskEndDate}
            onRiskPeriodChange={setRiskPeriod}
            onRiskCountChange={setRiskCount}
            onRiskStartDateChange={setRiskStartDate}
            onRiskEndDateChange={setRiskEndDate}
            performanceData={performanceData}
            performanceLoading={performanceLoading}
          />
        );
      case "pump":
        return (
          <PumpAnalysisTab
            pumpEfficiencyData={pumpEfficiencyData}
            pumpEfficiencyLoading={pumpEfficiencyLoading}
            leakData={leakData}
            leakLoading={leakLoading}
            leakPeriod={leakPeriod}
            leakCount={leakCount}
            leakStartDate={leakStartDate}
            leakEndDate={leakEndDate}
            leakThreshold={leakThreshold}
            onLeakPeriodChange={setLeakPeriod}
            onLeakCountChange={setLeakCount}
            onLeakStartDateChange={setLeakStartDate}
            onLeakEndDateChange={setLeakEndDate}
            onLeakThresholdChange={setLeakThreshold}
            cycleData={cycleData}
            cycleLoading={cycleLoading}
            healthData={healthData}
            healthLoading={healthLoading}
            optimizationData={optimizationData}
            optimizationLoading={optimizationLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Header */}
      <div className="surface-card p-[10px]">
        <Row>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <FaChartLine className="text-2xl text-white" />
            </div>
            <div>
              <Heading className="text-2xl">{t("users.consumption")}</Heading>
              <p className="mt-1 text-textColor opacity-70">
                {userData?.userName} - {t("users.consumptionAnalysis")}
              </p>
            </div>
          </div>
        </Row>
      </div>

      {/* Tabs */}
      <div className="surface-card p-[10px]">
        <div className="flex items-center gap-2 overflow-x-auto border-b border-primary">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-t-md px-4 py-2 transition-colors duration-200 ${
                  activeTab === tab.id
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

      {/* Content */}
      {getTabContent()}
    </div>
  );
}

export default UserConsumption;
