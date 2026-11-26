import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";
import { jwtDecode } from "jwt-decode";
import { IS_MOCK_MODE } from "../../utils/constants";

const MOCK_ADMIN_USER = {
  role: "authenticated",
  token: "mock-token",
  type: true,
  id: "mock-admin",
  other: { userName: "Demo Admin", email: "demo@example.com" },
};

export function useUser() {
  const {
    data: user,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (IS_MOCK_MODE) return MOCK_ADMIN_USER;
      const token = localStorage.getItem("WATER_USER_TOKEN");
      if (!token) {
        return null;
      }
      const decoded = jwtDecode(token);
      const userData = await getCurrentUser();
      return {
        ...userData,
        token,
        type: decoded?.isAdmin,
        id: decoded?._id,
      };
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: user?.role === "authenticated",
    type: user?.type,
    id: user?.id,
    error,
  };
}
