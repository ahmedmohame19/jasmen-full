import { useQuery } from "@tanstack/react-query";
import { getClient } from "../../services/apiUsers";

export function useClient(id) {
  const {
    isLoading,
    data: client,
    error,
  } = useQuery({
    queryKey: ["clientInfo", id],
    queryFn: ({ queryKey }) => {
      const [, userId] = queryKey;
      return getClient(userId);
    },
  });

  return {
    isLoading,
    client,
    error,
  };
}
