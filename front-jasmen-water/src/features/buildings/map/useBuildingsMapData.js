import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useBuildings } from "../useBuildings";
import { getBuildingDetails } from "../../../services/apiBuildings";
import { useLiveUnits, withLiveData } from "./useLiveUnits";

const DETAILS_STALE_TIME_MS = 60 * 1000;

function combineDetailQueries(results) {
  return {
    detailsList: results.map((result) => result.data),
    isPending: results.some((result) => result.isPending),
  };
}

export function useBuildingsMapData() {
  const { buildings, isLoading: isLoadingBuildings, error } = useBuildings();
  const liveUnits = useLiveUnits();

  const { detailsList, isPending: isLoadingDetails } = useQueries({
    queries: buildings.map((building) => ({
      queryKey: ["buildingDetails", building._id],
      queryFn: () => getBuildingDetails(building._id),
      staleTime: DETAILS_STALE_TIME_MS,
      refetchOnWindowFocus: false,
    })),
    combine: combineDetailQueries,
  });

  const mapBuildings = useMemo(
    () =>
      buildings.map((building, index) => ({
        ...building,
        users: (detailsList[index]?.users ?? []).map((user) =>
          withLiveData(user, liveUnits),
        ),
      })),
    [buildings, detailsList, liveUnits],
  );

  return {
    buildings: mapBuildings,
    isLoading: isLoadingBuildings || isLoadingDetails,
    error,
  };
}
