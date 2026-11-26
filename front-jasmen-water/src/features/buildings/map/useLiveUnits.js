import { useQuery } from "@tanstack/react-query";
import { LIVE_UNITS_QUERY_KEY } from "./unitLiveStore";

export function useLiveUnits() {
  const { data } = useQuery({
    queryKey: LIVE_UNITS_QUERY_KEY,
    queryFn: () => ({}),
    initialData: {},
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return data;
}

export function withLiveData(user, liveUnits) {
  const liveData = liveUnits[user._id];
  return liveData ? { ...user, ...liveData } : user;
}
