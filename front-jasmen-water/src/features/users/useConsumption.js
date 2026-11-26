import { useQuery } from "@tanstack/react-query";

import {
  getConsumptionByPeriod,
  getConsumptionAnalysis,
  getConsumptionForecast,
  getConsumptionCorrelation,
  getConsumptionSeasonality,
  getConsumptionBenchmark,
  getConsumptionRiskAssessment,
  getConsumptionPerformanceMetrics,
  getPumpEfficiencyAnalysis,
  getLeakDetectionAnalysis,
  getPumpCycleAnalysis,
  getPumpHealthMonitoring,
  getPumpOperationOptimization,
} from "../../services/apiUsers";

function keepDataForSameUser(userId) {
  return (previousData, previousQuery) =>
    previousQuery?.queryKey?.[1] === userId ? previousData : undefined;
}

export function useConsumptionByPeriod(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionByPeriod", userId, params],
    queryFn: () => getConsumptionByPeriod(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return {
    isLoading,
    data,
    error,
  };
}

export function useConsumptionAnalysis(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionAnalysis", userId, params],
    queryFn: () => getConsumptionAnalysis(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return {
    isLoading,
    data,
    error,
  };
}

export function useConsumptionForecast(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionForecast", userId, params],
    queryFn: () => getConsumptionForecast(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function useConsumptionCorrelation(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionCorrelation", userId, params],
    queryFn: () => getConsumptionCorrelation(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function useConsumptionSeasonality(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionSeasonality", userId, params],
    queryFn: () => getConsumptionSeasonality(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function useConsumptionBenchmark(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionBenchmark", userId, params],
    queryFn: () => getConsumptionBenchmark(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function useConsumptionRiskAssessment(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionRiskAssessment", userId, params],
    queryFn: () => getConsumptionRiskAssessment(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function useConsumptionPerformanceMetrics(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["consumptionPerformanceMetrics", userId, params],
    queryFn: () => getConsumptionPerformanceMetrics(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function usePumpEfficiencyAnalysis(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["pumpEfficiencyAnalysis", userId, params],
    queryFn: () => getPumpEfficiencyAnalysis(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function useLeakDetectionAnalysis(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["leakDetectionAnalysis", userId, params],
    queryFn: () => getLeakDetectionAnalysis(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function usePumpCycleAnalysis(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["pumpCycleAnalysis", userId, params],
    queryFn: () => getPumpCycleAnalysis(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function usePumpHealthMonitoring(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["pumpHealthMonitoring", userId, params],
    queryFn: () => getPumpHealthMonitoring(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

export function usePumpOperationOptimization(userId, params = {}) {
  const {
    isPending: isLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["pumpOperationOptimization", userId, params],
    queryFn: () => getPumpOperationOptimization(userId, params),
    enabled: !!userId,
    placeholderData: keepDataForSameUser(userId),
  });

  return { isLoading, data, error };
}

