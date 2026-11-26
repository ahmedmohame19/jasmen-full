import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/apiUsers";

export function useUser(id) {
  const {isLoading,data: userData,error,} = useQuery({queryKey: ["userInfo", id],queryFn: ({ queryKey }) => {const [, userId] = queryKey;return getUser(userId);},
  });

  return {
    isLoading,
    userData,
    error,
  };
}
