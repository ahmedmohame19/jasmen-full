import { useTranslation } from "react-i18next";
import { useChartColors } from "../../../hooks/useChartColors";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Charges({ charges = [] }) {
  const { i18n, t } = useTranslation();
  const chartColors = useChartColors();
  const isRTL = i18n.language === "ar";

  const chartData = charges.map((item) => ({
    name: new Date(item.createdAt).toLocaleDateString("en-US"),
    money: item.money,
  }));

  return (
    <div className="h-[380px] w-full surface-card p-[10px] lg:w-[50%]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">{t("users.UserCharges")}</h2>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 15,
            right: isRTL ? 70 : 5,
            bottom: 65,
            left: isRTL ? 5 : 5,
          }}
        >
          <CartesianGrid stroke={chartColors.grid} />
          <XAxis
            dataKey="name"
            tick={chartColors.axisTick}
            stroke={chartColors.axis}
          />
          <YAxis
            tick={chartColors.axisTick}
            stroke={chartColors.axis}
            orientation={isRTL ? "right" : "left"}
            tickCount={5}
            mirror={isRTL}
            dx={isRTL ? 15 : 0}
          />
          <Tooltip contentStyle={chartColors.tooltipStyle} />
          <Bar dataKey="money" barSize={20} fill={chartColors.series[0]} />
          <Line
            type="monotone"
            dataKey="money"
            stroke={chartColors.series[2]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charges;
