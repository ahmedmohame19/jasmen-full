import { useQuery } from "@tanstack/react-query";
import { highFiveUsersCharging as highFiveUsersChargingApi } from "../../services/apiDashboard";

export function useHighFiveUsersCharging() {
  const {
    isPending: isLoading,
    data: highFiveUsersCharging,
    error,
  } = useQuery({
    queryKey: ["highFiveUsersCharging"],
    queryFn: highFiveUsersChargingApi,
  });

  return {
    isLoading,
    highFiveUsersCharging: highFiveUsersCharging?.users,
    error,
  };
}
