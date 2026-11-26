import { useTranslation } from "react-i18next";

const UserInfoConsumptionChart = ({ percentage, title, sign = "%" }) => {
  const [t] = useTranslation();

  // Handle null/undefined and ensure minimum of 0
  const numericPercentage = Number(percentage);
  const validPercentage = Number.isFinite(numericPercentage)
    ? Math.max(0, numericPercentage)
    : 0;

  // For display, cap at 100% for the circle, but show actual percentage in text
  const displayPercentage = Math.min(validPercentage, 100);

  // Calculate strokeDasharray based on display percentage (capped at 100%)
  const strokeDasharray = `${displayPercentage} ${100 - displayPercentage}`;

  return (
    <div
      title={t("descriptions.userConsumptionPer")}
      className="flex h-[380px] w-full flex-col gap-[10px] surface-card p-[10px] lg:w-[50%]"
    >
      <h2 className="text-lg">{title}</h2>

      <div className="relative mt-[30px] flex size-40 h-[200px] w-full items-center justify-center">
        <svg
          className="size-full rotate-180"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-gray-200 dark:text-neutral-700"
            strokeWidth="4"
            strokeDasharray="100 100"
            strokeLinecap="round"
          ></circle>

          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-brandText"
            strokeWidth="4"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          ></circle>
        </svg>

        <div className="absolute transform text-center">
          <span className="text-3xl font-bold text-brandText">
            {validPercentage % 1 === 0 ? validPercentage.toFixed(0) : validPercentage.toFixed(2)} {sign}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInfoConsumptionChart;
