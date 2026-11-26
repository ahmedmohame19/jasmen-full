import { useMemo } from "react";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState";
import {
  IS_MOCK_MODE,
  LOW_BALANCE_PERCENT_DEFAULT,
  LOW_BALANCE_PERCENT_MAX,
  LOW_BALANCE_PERCENT_MIN,
  MOCK_STATUS_CONFIG,
} from "../../../utils/constants";

export function useStatusConfig() {
  const [lowBalancePercent, setLowBalancePercent] = useLocalStorageState(
    LOW_BALANCE_PERCENT_DEFAULT,
    "lowBalancePercent",
  );

  const config = useMemo(
    () => ({
      lowBalanceRatio: lowBalancePercent / 100,
      ...(IS_MOCK_MODE ? MOCK_STATUS_CONFIG : {}),
    }),
    [lowBalancePercent],
  );

  function updateLowBalancePercent(value) {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return;
    setLowBalancePercent(
      Math.min(
        LOW_BALANCE_PERCENT_MAX,
        Math.max(LOW_BALANCE_PERCENT_MIN, numericValue),
      ),
    );
  }

  return { config, lowBalancePercent, updateLowBalancePercent };
}
