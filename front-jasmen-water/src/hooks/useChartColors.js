import { useEffect, useState } from "react";
import { useDarkMode } from "../context/DarkModeContext";
import { getThemeDefinition } from "../context/themes";

const SERIES_COUNT = 6;

function readCssVariable(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function readChartColors(themeId) {
  const grid = readCssVariable("--chart-grid");
  const axis = readCssVariable("--chart-axis");
  const surface = readCssVariable("--color-grey-0");
  const text = readCssVariable("--color-grey-900");

  return {
    grid,
    axis,
    surface,
    text,
    axisTick: { fill: axis },
    tooltipStyle: {
      backgroundColor: surface,
      color: text,
      border: `1px solid ${grid}`,
    },
    series: Array.from({ length: SERIES_COUNT }, (_, index) =>
      readCssVariable(`--chart-${index + 1}`),
    ),
    colorScheme: getThemeDefinition(themeId).colorScheme,
  };
}

export function useChartColors() {
  const { theme } = useDarkMode();
  const [colors, setColors] = useState(() => readChartColors(theme));

  useEffect(() => {
    setColors(readChartColors(theme));
  }, [theme]);

  return colors;
}
