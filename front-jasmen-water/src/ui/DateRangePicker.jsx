import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaCalendarCheck, FaCheck } from "react-icons/fa";

function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  period,
  onPeriodChange,
  periods = ["day", "week", "month", "year"],
  showPeriodSelector = true,
  showDatePickers = true,
  label = "Date Range",
}) {
  const [t] = useTranslation();
  const [useCustomDates, setUseCustomDates] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  // Sync local state when props change
  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onStartDateChange(tempStartDate);
      onEndDateChange(tempEndDate);
    }
  };

  const handleToggleCustomDates = () => {
    const newValue = !useCustomDates;
    setUseCustomDates(newValue);
    // If disabling custom dates, reset to period-based selection
    if (!newValue) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
  };

  const hasChanges = () => {
    return tempStartDate !== startDate || tempEndDate !== endDate;
  };

  return (
    <div className="surface-card p-[10px]">
      <div className="flex flex-col gap-4">
        {/* Period Selector Section */}
        {showPeriodSelector && (
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 font-medium text-textColor">
              <FaCalendarAlt className="text-brandText" />
              {t("users.period")}:
            </label>
            <select
              value={period}
              onChange={(e) => {
                onPeriodChange(e.target.value);
                setUseCustomDates(false);
                setTempStartDate(startDate);
                setTempEndDate(endDate);
              }}
              className="rounded-md border border-primary bg-primary px-4 py-2 text-textColor transition-all hover:border-colorBrand focus:border-colorBrand focus:outline-none"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {t(`users.periodTypes.${p}`) ||
                    p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom Date Range Toggle Section */}
        {showDatePickers && (
          <div className="border-t border-primary pt-4">
            <div className="flex flex-col gap-4">
              {/* Toggle Button */}
              <button
                type="button"
                onClick={handleToggleCustomDates}
                className={`flex w-full items-center justify-between rounded-md p-3 transition-all ${
                  useCustomDates
                    ? "border-2 border-colorBrand bg-colorBrand/10"
                    : "border-2 border-primary bg-primary hover:border-colorBrand/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-md p-2 transition-all ${
                      useCustomDates
                        ? "bg-colorBrand text-white"
                        : "bg-primary text-textColor"
                    }`}
                  >
                    <FaCalendarCheck className="text-lg" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-textColor">
                      {t("users.useCustomDateRange")}
                    </div>
                    <div className="text-xs text-textColor opacity-70">
                      {useCustomDates
                        ? t("users.customDateRangeEnabled") ||
                          "Select specific start and end dates"
                        : t("users.customDateRangeDisabled") ||
                          "Use predefined period instead"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`relative h-6 w-12 rounded-full transition-all duration-300 ${
                      useCustomDates ? "bg-colorBrand" : "bg-gray-400"
                    }`}
                  >
                    <div
                      className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${
                        useCustomDates ? "translate-x-6" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </div>
              </button>

              {/* Date Inputs - Animated */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  useCustomDates ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {useCustomDates && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 rounded-md border border-primary bg-primary p-4 sm:flex-row">
                      {/* Start Date */}
                      <div className="flex-1">
                        <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-textColor">
                          <FaCalendarAlt className="text-xs text-brandText" />
                          {t("users.from")}:
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(tempStartDate)}
                          onChange={(e) => setTempStartDate(e.target.value)}
                          className="surface-card w-full border border-primary px-4 py-2.5 text-textColor transition-all focus:border-colorBrand focus:outline-none focus:ring-2 focus:ring-colorBrand/20"
                        />
                      </div>

                      {/* End Date */}
                      <div className="flex-1">
                        <label className="mb-2 block flex items-center gap-2 text-sm font-medium text-textColor">
                          <FaCalendarAlt className="text-xs text-brandText" />
                          {t("users.to")}:
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(tempEndDate)}
                          onChange={(e) => setTempEndDate(e.target.value)}
                          min={formatDateForInput(tempStartDate)}
                          className="surface-card w-full border border-primary px-4 py-2.5 text-textColor transition-all focus:border-colorBrand focus:outline-none focus:ring-2 focus:ring-colorBrand/20"
                        />
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleApply}
                        disabled={
                          !tempStartDate || !tempEndDate || !hasChanges()
                        }
                        className={`flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-semibold transition-all ${
                          tempStartDate && tempEndDate && hasChanges()
                            ? "bg-colorBrand text-white shadow-md hover:bg-colorBrand/90 hover:shadow-lg"
                            : "cursor-not-allowed bg-gray-400 text-gray-200"
                        }`}
                      >
                        <FaCheck />
                        {t("general.apply") || "Apply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DateRangePicker;
