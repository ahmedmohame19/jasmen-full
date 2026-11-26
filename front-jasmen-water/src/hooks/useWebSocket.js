import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { SOCKET_EVENT_USER_UPDATE } from "../utils/constants";

export function useWebSocket(userId) {
  const { socket, watchUsers } = useSocket();
  const [userRealTimeData, setUserRealTimeData] = useState(null);

  useEffect(() => {
    if (!socket || !userId) return undefined;

    function handleUserUpdate(data) {
      if (data?.userId === userId) setUserRealTimeData(data);
    }

    socket.on(SOCKET_EVENT_USER_UPDATE, handleUserUpdate);
    watchUsers([userId], { force: true });

    return () => {
      socket.off(SOCKET_EVENT_USER_UPDATE, handleUserUpdate);
    };
  }, [socket, userId, watchUsers]);

  return { socket, userRealTimeData };
}
