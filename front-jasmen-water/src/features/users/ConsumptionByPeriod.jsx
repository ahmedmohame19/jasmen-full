import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useChartColors } from "../../hooks/useChartColors";
import { FaCalendarAlt, FaChartLine, FaInfoCircle } from "react-icons/fa";
import Chart from "react-apexcharts";
import Spinner from "../../ui/spinner/Spinner";
import DateRangePicker from "../../ui/DateRangePicker";
import Tooltip from "../../ui/Tooltip";

function ConsumptionByPeriod({ 
  data, 
  isLoading, 
  period, 
  onPeriodChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) {
  const chartColors = useChartColors();
  const [t] = useTranslation();
  const periods = ["day", "week", "month", "year", "hour", "quarter"];

  // Prepare chart data - must be before early returns
  const chartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null;

    const categories = data.data.map(item => item.period);
    const totalConsumption = data.data.map(item => item.totalConsumption || 0);
    const avgConsumption = data.data.map(item => item.avgConsumption || 0);
    const maxConsumption = data.data.map(item => item.maxConsumption || 0);
    const minConsumption = data.data.map(item => item.minConsumption || 0);

    return {
      categories,
        series: [
        {
          name: t("users.totalConsumption"),
          data: totalConsumption,
        },
        {
          name: t("users.avgConsumption"),
          data: avgConsumption,
        },
        {
          name: t("users.maxConsumption"),
          data: maxConsumption,
        },
        {
          name: t("users.minConsumption"),
          data: minConsumption,
        },
      ],
    };
  }, [data?.data, t]);

  const flowRateChartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null;

    const categories = data.data.map(item => item.period);
    const avgFlowRate = data.data.map(item => item.avgFlowRate || 0);
    const maxFlowRate = data.data.map(item => item.maxFlowRate || 0);
    const minFlowRate = data.data.map(item => item.minFlowRate || 0);

    return {
      categories,
      series: [
        {
          name: t("users.avgFlowRate"),
          data: avgFlowRate,
        },
        {
          name: t("users.maxFlowRate"),
          data: maxFlowRate,
        },
        {
          name: t("users.minFlowRate"),
          data: minFlowRate,
        },
      ],
    };
  }, [data?.data, t]);

  if (isLoading) return <Spinner height="h-64" />;

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: chartData?.categories || [],
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          colors: chartColors.axis,
        },
      },
    },
    yaxis: {
      title: {
        text: t("users.consumption"),
      },
      labels: {
        style: {
          colors: chartColors.axis,
        },
      },
    },
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
    colors: chartColors.series.slice(0, 4),
  };

  const flowRateChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: flowRateChartData?.categories || [],
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          colors: chartColors.axis,
        },
      },
    },
    yaxis: {
      title: {
        text: t("users.flowRate"),
      },
      labels: {
        style: {
          colors: chartColors.axis,
        },
      },
    },
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
    colors: [chartColors.series[5], chartColors.series[1], chartColors.series[4]],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date Range Picker - Always visible */}
      <DateRangePicker
        startDate={startDate || data?.dateRange?.startDate}
        endDate={endDate || data?.dateRange?.endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        period={period}
        onPeriodChange={onPeriodChange}
        periods={periods}
        showPeriodSelector={true}
        showDatePickers={true}
      />

      {/* Show message if no data */}
      {(!data || (data.hasData === false) || !data.data || data.data.length === 0) && (
        <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
          <p className="text-textColor text-sm">{data?.message || t("users.noConsumptionData") || "No consumption data available for this period. Data will appear once water consumption records are created."}</p>
        </div>
      )}

      {/* Current Period Info */}
      {data && data.dateRange && (
        <div className="surface-card p-[10px]">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-textColor">
              <FaCalendarAlt className="opacity-70" />
              <span className="opacity-70">{t("users.currentPeriod")}:</span>
              <span className="font-semibold">
                {new Date(data.dateRange.startDate).toLocaleDateString()} - {new Date(data.dateRange.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-textColor">
              <span className="opacity-70">{t("users.periodType")}:</span>
              <span className="font-semibold capitalize">{data.period || period}</span>
            </div>
            <div className="flex items-center gap-2 text-textColor">
              <span className="opacity-70 flex items-center gap-2">
                {t("users.totalRecords")}:
                <Tooltip content={t("users.totalRecordsTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </span>
              <span className="font-semibold">{data.totalRecords || data.data?.length || 0}</span>
            </div>
          </div>
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

      {/* Summary Statistics (Enhanced) */}
      {data && data.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="surface-card p-4">
            <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
              {t("users.totalPeriods")}
              <Tooltip content={t("users.totalPeriodsTooltip")}>
                <FaInfoCircle className="text-xs cursor-help opacity-70" />
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-textColor mt-2">
              {data.summary.totalPeriods || 0}
            </div>
          </div>
          <div className="surface-card p-4">
            <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
              {t("users.totalConsumption")}
              <Tooltip content={t("users.totalConsumptionTooltip")}>
                <FaInfoCircle className="text-xs cursor-help opacity-70" />
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-textColor mt-2">
              {(data.summary.totalConsumption || 0).toFixed(2)}
            </div>
          </div>
          <div className="surface-card p-4">
            <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
              {t("users.avgPerPeriod")}
              <Tooltip content={t("users.avgPerPeriodTooltip")}>
                <FaInfoCircle className="text-xs cursor-help opacity-70" />
              </Tooltip>
            </div>
            <div className="text-2xl font-bold text-textColor mt-2">
              {(data.summary.avgConsumptionPerPeriod || 0).toFixed(2)}
            </div>
          </div>
          <div className="surface-card p-4">
            <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
              {t("users.maxPeriod")}
              <Tooltip content={t("users.maxPeriodTooltip")}>
                <FaInfoCircle className="text-xs cursor-help opacity-70" />
              </Tooltip>
            </div>
            <div className="text-lg font-bold text-textColor mt-2">
              {data.summary.maxPeriod && data.summary.maxPeriod.totalConsumption 
                ? data.summary.maxPeriod.totalConsumption.toFixed(2) 
                : "N/A"}
            </div>
          </div>
        </div>
      )}

      {/* Message Display (if exists) */}
      {data && data.message && (
        <div className="rounded-md bg-yellow-500/10 border border-yellow-500/20 p-[10px]">
          <p className="text-textColor text-sm">{data.message}</p>
        </div>
      )}

      {/* Projections (Enhanced) */}
      {data && data.projections && (
        <div className="surface-card p-[10px]">
          <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
            {t("users.projections")}
            <Tooltip content={t("users.projectionsTooltip")}>
              <FaInfoCircle className="text-xs cursor-help opacity-70" />
            </Tooltip>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                {t("users.nextPeriodForecast")}
                <Tooltip content={t("users.nextPeriodForecastTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </div>
              <div className="text-xl font-bold text-textColor mt-2">
                {data.projections.nextPeriod != null 
                  ? Number(data.projections.nextPeriod).toFixed(2) 
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                {t("users.growthRate")}
                <Tooltip content={t("users.growthRateTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </div>
              <div className="text-xl font-bold text-textColor mt-2">
                {data.projections.growthRate != null 
                  ? Number(data.projections.growthRate).toFixed(2) 
                  : "0.00"}%
              </div>
            </div>
            <div>
              <div className="text-sm text-textColor opacity-70 flex items-center gap-2">
                {t("users.confidence")}
                <Tooltip content={t("users.confidenceTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </div>
              <div className="text-xl font-bold text-textColor mt-2 capitalize">
                {data.projections.confidence || "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {data && chartData && (
        <>
          <div className="surface-card p-[10px]">
            <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
              <FaChartLine />
              {t("users.consumptionTrends")}
              <Tooltip content={t("users.consumptionTrendsTooltip")}>
                <FaInfoCircle className="text-xs cursor-help opacity-70" />
              </Tooltip>
            </h3>
            <Chart
              options={chartOptions}
              series={chartData.series}
              type="line"
              height={350}
            />
          </div>

          {flowRateChartData && (
            <div className="surface-card p-[10px]">
              <h3 className="text-lg font-semibold text-textColor mb-4 flex items-center gap-2">
                <FaChartLine />
                {t("users.flowRateAnalysis")}
                <Tooltip content={t("users.flowRateAnalysisTooltip")}>
                  <FaInfoCircle className="text-xs cursor-help opacity-70" />
                </Tooltip>
              </h3>
              <Chart
                options={flowRateChartOptions}
                series={flowRateChartData.series}
                type="area"
                height={300}
              />
            </div>
          )}
        </>
      )}

      {/* Consumption Data Table */}
      {data && data.data && data.data.length > 0 && (
        <div className="surface-card p-[10px]">
          <h3 className="text-lg font-semibold text-textColor mb-4">{t("users.detailedData")}</h3>
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary">
                    <th className="text-left py-3 px-4 text-textColor font-semibold">{t("users.period")}</th>
                    <th className="text-right py-3 px-4 text-textColor font-semibold">
                      {t("users.totalConsumption")}
                      <Tooltip content={t("users.totalConsumptionTooltip")}>
                        <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </th>
                    <th className="text-right py-3 px-4 text-textColor font-semibold">
                      {t("users.avgConsumption")}
                      <Tooltip content={t("users.avgConsumptionTooltip")}>
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
                      {t("users.avgFlowRate")}
                      <Tooltip content={t("users.avgFlowRateTooltip")}>
                        <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </th>
                    <th className="text-right py-3 px-4 text-textColor font-semibold">
                      {t("users.totalReadings")}
                      <Tooltip content={t("users.totalReadingsTooltip")}>
                        <FaInfoCircle className="inline ml-2 text-xs cursor-help opacity-70" />
                      </Tooltip>
                    </th>
                  </tr>
                </thead>
              <tbody>
                {data.data.map((item, index) => (
                <tr key={index} className="border-b border-primary hover:bg-primary transition-colors">
                  <td className="py-3 px-4 text-textColor font-medium">{item.period}</td>
                  <td className="py-3 px-4 text-textColor text-right">
                    {item.totalConsumption != null ? Number(item.totalConsumption).toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4 text-textColor text-right">
                    {item.avgConsumption != null ? Number(item.avgConsumption).toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4 text-textColor text-right">
                    {item.maxConsumption != null ? Number(item.maxConsumption).toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4 text-textColor text-right">
                    {item.minConsumption != null ? Number(item.minConsumption).toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4 text-textColor text-right">
                    {item.avgFlowRate != null ? Number(item.avgFlowRate).toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4 text-textColor text-right">{item.totalReadings || 0}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsumptionByPeriod;
