import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      queryClient.removeQueries();
      localStorage.removeItem("WATER_USER_TOKEN");
      navigate("/login", { replace: true });
      navigate(0);
    },
  });

  return { logout, isLoading };
}
