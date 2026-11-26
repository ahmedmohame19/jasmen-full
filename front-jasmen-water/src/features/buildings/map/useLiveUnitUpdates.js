import { useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../../context/SocketContext";
import {
  IS_MOCK_MODE,
  LIVE_UPDATE_BATCH_MS,
  MOCK_TICK_MS,
  SOCKET_EVENT_USER_UPDATE,
} from "../../../utils/constants";
import { createUpdateBuffer } from "../../../utils/updateBuffer";
import { applyUnitUpdates } from "./unitLiveStore";
import { nextMockUpdate } from "./mockData";

const MOCK_MAX_EVENTS_PER_TICK = 3;

export function useLiveUnitUpdates(users) {
  const queryClient = useQueryClient();
  const { socket, watchUsers } = useSocket();

  const usersRef = useRef(users);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  const buffer = useMemo(
    () =>
      createUpdateBuffer(
        (updates) => applyUnitUpdates(queryClient, updates),
        LIVE_UPDATE_BATCH_MS,
      ),
    [queryClient],
  );

  useEffect(() => () => buffer.cancel(), [buffer]);

  const userIdsKey = users.map((user) => user._id).join(",");

  useEffect(() => {
    if (IS_MOCK_MODE || userIdsKey === "") return;
    watchUsers(userIdsKey.split(","));
  }, [userIdsKey, watchUsers]);

  useEffect(() => {
    if (IS_MOCK_MODE || !socket) return undefined;

    function handleUserUpdate(data) {
      if (data?.userId) buffer.push(data);
    }

    socket.on(SOCKET_EVENT_USER_UPDATE, handleUserUpdate);
    return () => socket.off(SOCKET_EVENT_USER_UPDATE, handleUserUpdate);
  }, [socket, buffer]);

  useEffect(() => {
    if (!IS_MOCK_MODE) return undefined;

    const timer = setInterval(() => {
      const pool = usersRef.current;
      if (pool.length === 0) return;
      const eventCount =
        1 + Math.floor(Math.random() * MOCK_MAX_EVENTS_PER_TICK);
      for (let index = 0; index < eventCount; index += 1) {
        const user = pool[Math.floor(Math.random() * pool.length)];
        buffer.push(nextMockUpdate(user));
      }
    }, MOCK_TICK_MS);

    return () => clearInterval(timer);
  }, [buffer]);
}
