import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useChartColors } from "../../hooks/useChartColors";
import {
  FaEye,
  FaNetworkWired,
  FaCalendarAlt,
  FaMedal,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
} from "react-icons/fa";
import Chart from "react-apexcharts";
import Spinner from "../../ui/spinner/Spinner";
import Empty from "../../ui/Empty";
import Tooltip from "../../ui/Tooltip";
import DateRangePicker from "../../ui/DateRangePicker";

function AdvancedAnalysisTab({
  forecastData,
  forecastLoading,
  correlationData,
  correlationLoading,
  seasonalityData,
  seasonalityLoading,
  seasonalityPeriod,
  seasonalityDateRangePeriod,
  seasonalityCount,
  seasonalityStartDate,
  seasonalityEndDate,
  onSeasonalityPeriodChange,
  onSeasonalityDateRangePeriodChange,
  onSeasonalityCountChange,
  onSeasonalityStartDateChange,
  onSeasonalityEndDateChange,
  benchmarkData,
  benchmarkLoading,
}) {
  const chartColors = useChartColors();
  const [t] = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState("forecast");

  const subTabs = [
    { id: "forecast", label: t("users.forecast"), icon: FaEye },
    { id: "correlation", label: t("users.correlation"), icon: FaNetworkWired },
    { id: "seasonality", label: t("users.seasonality"), icon: FaCalendarAlt },
    { id: "benchmark", label: t("users.benchmark"), icon: FaMedal },
  ];

  // Prepare chart data for seasonality - must be at component level
  const seasonalityChartData = useMemo(() => {
    if (!seasonalityData?.seasonalPattern || seasonalityData.seasonalPattern.length === 0) {
      return null;
    }

    const categories = seasonalityData.seasonalPattern.map(item => {
      if (seasonalityPeriod === "month") {
        const monthNames = [
          t("users.monthNames.january") || "Jan", t("users.monthNames.february") || "Feb",
          t("users.monthNames.march") || "Mar", t("users.monthNames.april") || "Apr",
          t("users.monthNames.may") || "May", t("users.monthNames.june") || "Jun",
          t("users.monthNames.july") || "Jul", t("users.monthNames.august") || "Aug",
          t("users.monthNames.september") || "Sep", t("users.monthNames.october") || "Oct",
          t("users.monthNames.november") || "Nov", t("users.monthNames.december") || "Dec"
        ];
        return monthNames[item.period - 1] || `Month ${item.period}`;
      } else if (seasonalityPeriod === "week") {
        return `${t("users.week") || "Week"} ${item.period}`;
      } else {
        return `${t("users.day") || "Day"} ${item.period}`;
      }
    });
    const avgConsumption = seasonalityData.seasonalPattern.map(item => item.avgConsumption);
    const deviation = seasonalityData.seasonalPattern.map(item => item.deviationFromAverage);
    
    return { categories, avgConsumption, deviation };
  }, [seasonalityData?.seasonalPattern, seasonalityPeriod, t]);

  const getCorrelationStrength = (coefficient) => {
    const abs = Math.abs(coefficient);
    if (abs > 0.7) return { text: "Strong", color: "text-green-500" };
    if (abs > 0.4) return { text: "Moderate", color: "text-yellow-500" };
    return { text: "Weak", color: "text-gray-500" };
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

      {/* Forecast Tab */}
      {activeSubTab === "forecast" && (
        <div className="flex flex-col gap-4">
          {forecastLoading ? (
            <Spinner height="h-64" />
          ) : !forecastData || forecastData.hasData === false ? (
            <Empty message={forecastData?.message || "No forecast data available. Need at least 7 days of historical data for forecasting."} />
          ) : (
            <>
              <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaEye />
                {t("users.forecast")}
                  <Tooltip content={t("users.forecastTooltip")}>
                    <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                  </Tooltip>
                </h3>

                {forecastData.forecast?.modelAccuracy && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.rSquaredScore")}
                        <Tooltip content={t("users.rSquaredTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="text-2xl font-bold text-textColor mt-2">
                        {forecastData.forecast.modelAccuracy.rSquared.toFixed(4)}
                      </div>
                      <div className="text-xs text-textColor opacity-50 mt-1">
                        {t("general.quality") || "Quality"}: {forecastData.forecast.modelAccuracy.quality}
                      </div>
                    </div>
                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.meanAbsoluteError") || "Mean Absolute Error"}
                        <Tooltip content={t("users.meanAbsoluteErrorTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="text-2xl font-bold text-textColor mt-2">
                        {forecastData.forecast.modelAccuracy.meanAbsoluteError.toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.meanAbsolutePercentageError") || "Mean Absolute % Error"}
                        <Tooltip content={t("users.meanAbsolutePercentageErrorTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div className="text-2xl font-bold text-textColor mt-2">
                        {forecastData.forecast.modelAccuracy.meanAbsolutePercentageError.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-primary rounded-lg p-4">
                      <div className="text-sm text-textColor opacity-70">{t("users.forecastPeriods") || "Forecast Periods"}</div>
                      <div className="text-2xl font-bold text-textColor mt-2">
                        {forecastData.forecast.periods}
                      </div>
                    </div>
                  </div>
                )}

                {forecastData.forecast?.forecasts && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary">
                          <th className="text-left py-3 px-4 text-textColor font-semibold">{t("users.date") || "Date"}</th>
                          <th className="text-right py-3 px-4 text-textColor font-semibold">
                            {t("users.forecasted") || "Forecasted"}
                            <Tooltip content={t("users.forecastedConsumptionTooltip")}>
                              <FaInfoCircle className="inline ml-2 text-xs cursor-help" />
                            </Tooltip>
                          </th>
                          <th className="text-right py-3 px-4 text-textColor font-semibold">
                            {t("users.lowerBound") || "Lower Bound"}
                            <Tooltip content={t("users.lowerBoundTooltip")}>
                              <FaInfoCircle className="inline ml-2 text-xs cursor-help" />
                            </Tooltip>
                          </th>
                          <th className="text-right py-3 px-4 text-textColor font-semibold">
                            {t("users.upperBound") || "Upper Bound"}
                            <Tooltip content={t("users.upperBoundTooltip")}>
                              <FaInfoCircle className="inline ml-2 text-xs cursor-help" />
                            </Tooltip>
                          </th>
                          <th className="text-center py-3 px-4 text-textColor font-semibold">
                            {t("users.confidence")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecastData.forecast.forecasts.map((forecast, index) => (
                          <tr
                            key={index}
                            className="border-b border-primary hover:bg-primary transition-colors"
                          >
                            <td className="py-3 px-4 text-textColor">
                              {new Date(forecast.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-textColor text-right font-semibold">
                              {forecast.forecastedConsumption.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-textColor text-right">
                              {forecast.lowerBound.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-textColor text-right">
                              {forecast.upperBound.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-1 rounded bg-colorBrand text-white text-xs">
                                {forecast.confidence}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Correlation Tab */}
      {activeSubTab === "correlation" && (
        <div className="flex flex-col gap-4">
          {correlationLoading ? (
            <Spinner height="h-64" />
          ) : !correlationData || correlationData.hasData === false ? (
            <Empty message={correlationData?.message || "No correlation data available. Need at least 5 data points for correlation analysis."} />
          ) : (
            <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaNetworkWired />
                {t("users.correlation")}
                <Tooltip content={t("users.correlationTooltip")}>
                  <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                </Tooltip>
              </h3>

              {correlationData.correlations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(correlationData.correlations).map(([key, corr]) => {
                    const strength = getCorrelationStrength(corr.coefficient);
                    return (
                      <div key={key} className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 mb-2">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`text-2xl font-bold ${strength.color} flex items-center gap-2`}>
                              {corr.coefficient > 0 ? "+" : ""}
                              {corr.coefficient.toFixed(4)}
                              <Tooltip content={t("users.correlationCoefficientTooltip")}>
                                <FaInfoCircle className="text-xs cursor-help opacity-70" />
                              </Tooltip>
                            </div>
                            <div className={`text-sm mt-1 ${strength.color}`}>
                              {strength.text} {corr.coefficient > 0 ? "Positive" : "Negative"}
                            </div>
                          </div>
                          {corr.interpretation && (
                            <Tooltip content={corr.interpretation}>
                              <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {correlationData.insights && (
                <div className="mt-6 bg-primary rounded-lg p-4">
                  <h4 className="font-semibold text-textColor mb-2">{t("users.keyFindings") || "Key Findings"}</h4>
                  <ul className="space-y-2">
                    {correlationData.insights.keyFindings?.map((finding, index) => (
                      <li key={index} className="text-textColor text-sm flex items-start gap-2">
                        <span className="text-brandText">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Seasonality Tab */}
      {activeSubTab === "seasonality" && (
        <div className="flex flex-col gap-4">
          {seasonalityLoading ? (
            <Spinner height="h-64" />
          ) : (
            <>
              {/* Controls - Always visible */}
              <div className="surface-card p-[10px]">
                <div className="flex flex-col gap-4">
                  {/* Period Type Selector */}
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="text-textColor font-medium flex items-center gap-2">
                      <FaCalendarAlt className="text-brandText" />
                      {t("users.groupByPeriod") || "Group By Period"}:
                    </label>
                    <select
                      value={seasonalityPeriod}
                      onChange={(e) => onSeasonalityPeriodChange(e.target.value)}
                      className="px-4 py-2 rounded-md bg-primary border border-primary text-textColor focus:outline-none focus:border-colorBrand transition-all hover:border-colorBrand"
                    >
                      <option value="month">{t("users.periodTypes.month")}</option>
                      <option value="week">{t("users.periodTypes.week")}</option>
                      <option value="day">{t("users.periodTypes.day")}</option>
                    </select>
                    <Tooltip content={t("users.groupByPeriodTooltip") || "Select how to group the data for seasonal analysis (by month, week, or day)"}>
                      <FaInfoCircle className="text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </div>

                  {/* Date Range Picker */}
                  <DateRangePicker
                    startDate={seasonalityStartDate || seasonalityData?.dateRange?.startDate}
                    endDate={seasonalityEndDate || seasonalityData?.dateRange?.endDate}
                    onStartDateChange={onSeasonalityStartDateChange}
                    onEndDateChange={onSeasonalityEndDateChange}
                    period={seasonalityDateRangePeriod}
                    onPeriodChange={onSeasonalityDateRangePeriodChange}
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
                      max={seasonalityDateRangePeriod === "year" ? 10 : seasonalityDateRangePeriod === "month" ? 24 : seasonalityDateRangePeriod === "week" ? 52 : 30}
                      value={seasonalityCount}
                      onChange={(e) => onSeasonalityCountChange(parseInt(e.target.value) || 1)}
                      className="px-3 py-2 rounded-md bg-primary border border-primary text-textColor focus:outline-none focus:border-colorBrand w-20"
                    />
                    <Tooltip content={t("users.numberOfPeriods")}>
                      <FaInfoCircle className="text-xs cursor-help opacity-70" />
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Show message if no data */}
              {(!seasonalityData || seasonalityData.hasData === false) && (
                <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
                  <p className="text-textColor text-sm">{seasonalityData?.message || "No seasonality data available. Need at least 12 months of data for seasonal analysis."}</p>
                </div>
              )}

              {/* Current Period Info */}
              {seasonalityData?.dateRange && (
                <div className="surface-card p-[10px]">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-textColor">
                      <FaCalendarAlt className="opacity-70" />
                      <span className="opacity-70">{t("users.currentPeriod")}:</span>
                      <span className="font-semibold">
                        {new Date(seasonalityData.dateRange.startDate).toLocaleDateString()} - {new Date(seasonalityData.dateRange.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-textColor">
                      <span className="opacity-70">{t("users.periodType")}:</span>
                      <span className="font-semibold capitalize">{seasonalityData.period || seasonalityPeriod}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Seasonality Data - Only show if hasData is true */}
              {seasonalityData && seasonalityData.hasData !== false && (
                <div className="flex flex-col gap-6">
                  {/* Overall Average and Insights Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {seasonalityData.overallAverage != null && (
                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.overallAvgConsumption")}
                          <Tooltip content={t("users.overallAvgConsumptionTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className="text-2xl font-bold text-textColor mt-2">
                          {Number(seasonalityData.overallAverage).toFixed(2)}
                        </div>
                      </div>
                    )}
                    {seasonalityData.insights?.seasonalVariation != null && (
                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.seasonalVariation") || "Seasonal Variation"}
                          <Tooltip content={t("users.seasonalVariationTooltip") || "Difference between highest and lowest consumption periods"}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className="text-2xl font-bold text-textColor mt-2">
                          {Number(seasonalityData.insights.seasonalVariation).toFixed(2)}
                        </div>
                      </div>
                    )}
                    {seasonalityData.insights?.hasStrongSeasonality != null && (
                      <div className="bg-primary rounded-lg p-4">
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.seasonalityStrength") || "Seasonality Strength"}
                          <Tooltip content={t("users.seasonalityStrengthTooltip") || "Indicates if there is a strong seasonal pattern (variation > 20%)"}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className={`text-xl font-bold mt-2 ${
                          seasonalityData.insights.hasStrongSeasonality ? "text-orange-500" : "text-gray-500"
                        }`}>
                          {seasonalityData.insights.hasStrongSeasonality 
                            ? t("users.strong") || "Strong" 
                            : t("users.weak") || "Weak"}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Seasonal Pattern Chart */}
                  {seasonalityChartData && (
                    <div className="surface-card p-[10px]">
                      <h4 className="font-semibold text-textColor mb-3 flex items-center gap-2">
                        <FaChartLine />
                        {t("users.seasonalPatternChart") || "Seasonal Pattern"}
                        <Tooltip content={t("users.seasonalPatternChartTooltip") || "Shows consumption patterns across different periods"}>
                          <FaInfoCircle className="text-xs cursor-help opacity-70" />
                        </Tooltip>
                      </h4>
                      <Chart
                        options={{
                          chart: {
                            type: "line",
                            height: 350,
                            toolbar: { show: true },
                            zoom: { enabled: true },
                          },
                          stroke: { curve: "smooth", width: 2 },
                          xaxis: {
                            categories: seasonalityChartData.categories,
                            labels: {
                              rotate: -45,
                              rotateAlways: false,
                              style: { colors: chartColors.axis },
                            },
                          },
                          yaxis: {
                            title: { text: t("users.consumption") },
                            labels: { style: { colors: chartColors.axis } },
                          },
                          legend: {
                            position: "top",
                            labels: { colors: chartColors.axis },
                          },
                          tooltip: {
                            theme: chartColors.colorScheme,
                            shared: true,
                            intersect: false,
                            style: { fontSize: "12px" },
                          },
                          colors: [chartColors.series[0], chartColors.series[1]],
                          markers: { size: 4 },
                        }}
                        series={[
                          {
                            name: t("users.avgConsumption"),
                            data: seasonalityChartData.avgConsumption,
                          },
                          {
                            name: t("users.deviation"),
                            data: seasonalityChartData.deviation,
                          },
                        ]}
                        type="line"
                        height={350}
                      />
                    </div>
                  )}

                  {/* Seasonal Pattern Table */}
                  {seasonalityData.seasonalPattern && seasonalityData.seasonalPattern.length > 0 && (
                    <div className="surface-card p-[10px]">
                      <h4 className="font-semibold text-textColor mb-4">{t("users.seasonalPattern") || "Seasonal Pattern Details"}</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-primary">
                              <th className="text-left py-3 px-4 text-textColor font-semibold">{t("users.period")}</th>
                              <th className="text-right py-3 px-4 text-textColor font-semibold">
                                {t("users.avgConsumption")}
                                <Tooltip content={t("users.avgConsumptionTooltip")}>
                                  <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </th>
                              <th className="text-right py-3 px-4 text-textColor font-semibold">
                                {t("users.totalConsumption")}
                                <Tooltip content={t("users.totalConsumptionTooltip")}>
                                  <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </th>
                              <th className="text-right py-3 px-4 text-textColor font-semibold">
                                {t("users.maxConsumption")}
                                <Tooltip content={t("users.maxConsumptionTooltip")}>
                                  <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </th>
                              <th className="text-right py-3 px-4 text-textColor font-semibold">
                                {t("users.minConsumption")}
                                <Tooltip content={t("users.minConsumptionTooltip")}>
                                  <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </th>
                              <th className="text-right py-3 px-4 text-textColor font-semibold">
                                {t("users.deviation")}
                                <Tooltip content={t("users.deviationTooltip")}>
                                  <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </th>
                              <th className="text-right py-3 px-4 text-textColor font-semibold">
                                % {t("users.deviation")}
                                <Tooltip content={t("users.percentDeviationTooltip")}>
                                  <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </th>
                              <th className="text-right py-3 px-4 text-textColor font-semibold">
                                {t("users.recordCount") || "Records"}
                                <Tooltip content={t("users.recordCountTooltip") || "Number of data points in this period"}>
                                  <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                                </Tooltip>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {seasonalityData.seasonalPattern.map((item, index) => {
                              const periodLabel = seasonalityPeriod === "month" 
                                ? (() => {
                                    const monthNames = [
                                      t("users.monthNames.january") || "January", t("users.monthNames.february") || "February",
                                      t("users.monthNames.march") || "March", t("users.monthNames.april") || "April",
                                      t("users.monthNames.may") || "May", t("users.monthNames.june") || "June",
                                      t("users.monthNames.july") || "July", t("users.monthNames.august") || "August",
                                      t("users.monthNames.september") || "September", t("users.monthNames.october") || "October",
                                      t("users.monthNames.november") || "November", t("users.monthNames.december") || "December"
                                    ];
                                    return monthNames[item.period - 1] || `Month ${item.period}`;
                                  })()
                                : seasonalityPeriod === "week"
                                ? `${t("users.week") || "Week"} ${item.period}`
                                : `${t("users.day") || "Day"} ${item.period}`;
                              
                              return (
                                <tr
                                  key={index}
                                  className="border-b border-primary hover:bg-primary transition-colors"
                                >
                                  <td className="py-3 px-4 text-textColor font-medium">{periodLabel}</td>
                                  <td className="py-3 px-4 text-textColor text-right">
                                    {item.avgConsumption != null ? Number(item.avgConsumption).toFixed(2) : "0.00"}
                                  </td>
                                  <td className="py-3 px-4 text-textColor text-right">
                                    {item.totalConsumption != null ? Number(item.totalConsumption).toFixed(2) : "0.00"}
                                  </td>
                                  <td className="py-3 px-4 text-textColor text-right">
                                    {item.maxConsumption != null ? Number(item.maxConsumption).toFixed(2) : "0.00"}
                                  </td>
                                  <td className="py-3 px-4 text-textColor text-right">
                                    {item.minConsumption != null ? Number(item.minConsumption).toFixed(2) : "0.00"}
                                  </td>
                                  <td
                                    className={`py-3 px-4 text-right ${
                                      item.deviationFromAverage > 0 ? "text-red-500" : "text-green-500"
                                    }`}
                                  >
                                    {item.deviationFromAverage > 0 ? "+" : ""}
                                    {item.deviationFromAverage != null ? Number(item.deviationFromAverage).toFixed(2) : "0.00"}
                                  </td>
                                  <td
                                    className={`py-3 px-4 text-right ${
                                      item.percentDeviation > 0 ? "text-red-500" : "text-green-500"
                                    }`}
                                  >
                                    {item.percentDeviation > 0 ? "+" : ""}
                                    {item.percentDeviation != null ? Number(item.percentDeviation).toFixed(2) : "0.00"}%
                                  </td>
                                  <td className="py-3 px-4 text-textColor text-right">
                                    {item.recordCount || 0}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {seasonalityData.insights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {seasonalityData.insights.peakPeriods && seasonalityData.insights.peakPeriods.length > 0 && (
                        <div className="bg-primary rounded-lg p-4">
                          <h4 className="font-semibold text-textColor mb-2 flex items-center gap-2">
                            <FaArrowUp className="text-red-500" />
                            {t("users.peakPeriods")}
                          </h4>
                          <ul className="space-y-2">
                            {seasonalityData.insights.peakPeriods.map((period, index) => {
                              const periodLabel = seasonalityPeriod === "month" 
                                ? (() => {
                                    const monthNames = [
                                      t("users.monthNames.january") || "January", t("users.monthNames.february") || "February",
                                      t("users.monthNames.march") || "March", t("users.monthNames.april") || "April",
                                      t("users.monthNames.may") || "May", t("users.monthNames.june") || "June",
                                      t("users.monthNames.july") || "July", t("users.monthNames.august") || "August",
                                      t("users.monthNames.september") || "September", t("users.monthNames.october") || "October",
                                      t("users.monthNames.november") || "November", t("users.monthNames.december") || "December"
                                    ];
                                    return monthNames[period.period - 1] || `Month ${period.period}`;
                                  })()
                                : seasonalityPeriod === "week"
                                ? `${t("users.week") || "Week"} ${period.period}`
                                : `${t("users.day") || "Day"} ${period.period}`;
                              
                              return (
                                <li key={index} className="text-textColor text-sm">
                                  <span className="font-semibold">{periodLabel}:</span> {period.avgConsumption != null ? Number(period.avgConsumption).toFixed(2) : "0.00"} L
                                  {period.percentDeviation != null && (
                                    <span className="text-red-500 ml-2">
                                      (+{period.percentDeviation.toFixed(1)}%)
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                      {seasonalityData.insights.lowPeriods && seasonalityData.insights.lowPeriods.length > 0 && (
                        <div className="bg-primary rounded-lg p-4">
                          <h4 className="font-semibold text-textColor mb-2 flex items-center gap-2">
                            <FaArrowDown className="text-green-500" />
                            {t("users.lowPeriods")}
                          </h4>
                          <ul className="space-y-2">
                            {seasonalityData.insights.lowPeriods.map((period, index) => {
                              const periodLabel = seasonalityPeriod === "month" 
                                ? (() => {
                                    const monthNames = [
                                      t("users.monthNames.january") || "January", t("users.monthNames.february") || "February",
                                      t("users.monthNames.march") || "March", t("users.monthNames.april") || "April",
                                      t("users.monthNames.may") || "May", t("users.monthNames.june") || "June",
                                      t("users.monthNames.july") || "July", t("users.monthNames.august") || "August",
                                      t("users.monthNames.september") || "September", t("users.monthNames.october") || "October",
                                      t("users.monthNames.november") || "November", t("users.monthNames.december") || "December"
                                    ];
                                    return monthNames[period.period - 1] || `Month ${period.period}`;
                                  })()
                                : seasonalityPeriod === "week"
                                ? `${t("users.week") || "Week"} ${period.period}`
                                : `${t("users.day") || "Day"} ${period.period}`;
                              
                              return (
                                <li key={index} className="text-textColor text-sm">
                                  <span className="font-semibold">{periodLabel}:</span> {period.avgConsumption != null ? Number(period.avgConsumption).toFixed(2) : "0.00"} L
                                  {period.percentDeviation != null && (
                                    <span className="text-green-500 ml-2">
                                      ({period.percentDeviation.toFixed(1)}%)
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
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

      {/* Benchmark Tab */}
      {activeSubTab === "benchmark" && (
        <div className="flex flex-col gap-4">
          {benchmarkLoading ? (
            <Spinner height="h-64" />
          ) : !benchmarkData || benchmarkData.hasData === false ? (
            <Empty message={benchmarkData?.message || "No benchmark data available. Consumption data is required for comparison."} />
          ) : (
            <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaMedal />
                {t("users.benchmark")}
                <Tooltip content={t("users.benchmarkTooltip")}>
                  <FaInfoCircle className="text-textColor opacity-50 cursor-help" />
                </Tooltip>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-primary rounded-lg p-4">
                  <h4 className="font-semibold text-textColor mb-4">{t("users.yourMetrics")}</h4>
                  {benchmarkData.userMetrics && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.avgConsumption")}
                          <Tooltip content={t("users.avgConsumptionTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className="text-xl font-bold text-textColor">
                          {benchmarkData.userMetrics.avgConsumption.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.totalConsumption")}
                          <Tooltip content={t("users.totalConsumptionTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className="text-xl font-bold text-textColor">
                          {benchmarkData.userMetrics.totalConsumption.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-primary rounded-lg p-4">
                  <h4 className="font-semibold text-textColor mb-4">{t("users.benchmarkMetrics")}</h4>
                  {benchmarkData.benchmarkMetrics && (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.avgConsumption")}
                          <Tooltip content={t("users.avgConsumptionTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className="text-xl font-bold text-textColor">
                          {benchmarkData.benchmarkMetrics.avgConsumption.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                          {t("users.usersInComparison")}
                          <Tooltip content={t("users.usersInComparisonTooltip")}>
                            <FaInfoCircle className="text-xs cursor-help opacity-70" />
                          </Tooltip>
                        </div>
                        <div className="text-xl font-bold text-textColor">
                          {benchmarkData.benchmarkMetrics.userCount}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {benchmarkData.comparison && (
                <div className="bg-primary rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-textColor mb-4">{t("users.comparison") || "Comparison"}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        {t("users.difference") || "Difference"}
                        <Tooltip content={t("users.differenceTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div
                        className={`text-xl font-bold mt-2 ${
                          benchmarkData.comparison.difference > 0
                            ? "text-red-500"
                            : benchmarkData.comparison.difference < 0
                            ? "text-green-500"
                            : "text-textColor"
                        }`}
                      >
                        {benchmarkData.comparison.difference > 0 ? "+" : ""}
                        {benchmarkData.comparison.difference.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                        % {t("users.difference") || "Difference"}
                        <Tooltip content={t("users.percentDifferenceTooltip")}>
                          <FaInfoCircle className="text-xs cursor-help" />
                        </Tooltip>
                      </div>
                      <div
                        className={`text-xl font-bold mt-2 ${
                          benchmarkData.comparison.percentDifference > 0
                            ? "text-red-500"
                            : benchmarkData.comparison.percentDifference < 0
                            ? "text-green-500"
                            : "text-textColor"
                        }`}
                      >
                        {benchmarkData.comparison.percentDifference > 0 ? "+" : ""}
                        {benchmarkData.comparison.percentDifference.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-textColor opacity-70">{t("users.status")}</div>
                      <div className="text-xl font-bold mt-2 capitalize text-textColor">
                        {benchmarkData.comparison.status.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {benchmarkData.recommendations && benchmarkData.recommendations.length > 0 && (
                <div className="bg-primary rounded-lg p-4">
                  <h4 className="font-semibold text-textColor mb-2">{t("users.recommendations")}</h4>
                  <ul className="space-y-2">
                    {benchmarkData.recommendations.map((rec, index) => (
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
    </div>
  );
}

export default AdvancedAnalysisTab;

