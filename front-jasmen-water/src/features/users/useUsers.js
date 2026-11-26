import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getUsers } from "../../services/apiUsers";

export function useUsers() {
  const [searchParams] = useSearchParams();

  const requestedPage = Number(searchParams.get("page"));
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const {
    isPending: isLoading,
    data: usersData,
    error,
  } = useQuery({
    queryKey: ["UsersData", page],
    queryFn: () => getUsers(page),
    placeholderData: keepPreviousData,
  });

  return {
    isLoading,
    users: usersData?.users,
    totalPages: usersData?.totalPages,
    currentPage: usersData?.currentPage,
    count: usersData?.totalUsers,
    error,
  };
}
