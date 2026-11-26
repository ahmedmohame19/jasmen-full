import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { baseURL } from "../services/axios";
import { useUser } from "../features/authentication/useUser";
import {
  IS_MOCK_MODE,
  SOCKET_EVENT_WATCH_USER,
  SOCKET_RECONNECT_DELAY_MAX_MS,
  SOCKET_RECONNECT_DELAY_MS,
} from "../utils/constants";

export const CONNECTION_STATE = {
  CONNECTED: "connected",
  RECONNECTING: "reconnecting",
  OFFLINE: "offline",
  MOCK: "mock",
};

const offlineSocketStub = {
  connected: false,
  emit() {},
  on() {},
  off() {},
};

const SocketContext = createContext(undefined);

function SocketProvider({ children }) {
  const { user } = useUser();
  const token = user?.token;

  const [socket, setSocket] = useState(null);
  const [connectionState, setConnectionState] = useState(
    IS_MOCK_MODE ? CONNECTION_STATE.MOCK : CONNECTION_STATE.OFFLINE,
  );
  const watchedUserIds = useRef(new Set());

  useEffect(() => {
    if (IS_MOCK_MODE || !token) return undefined;

    const newSocket = io(baseURL, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { token },
      reconnection: true,
      reconnectionDelay: SOCKET_RECONNECT_DELAY_MS,
      reconnectionDelayMax: SOCKET_RECONNECT_DELAY_MAX_MS,
      randomizationFactor: 0.5,
    });

    function handleConnect() {
      setConnectionState(CONNECTION_STATE.CONNECTED);
      watchedUserIds.current.forEach((userId) => {
        newSocket.emit(SOCKET_EVENT_WATCH_USER, userId);
      });
    }

    function handleDisconnect(reason) {
      if (reason === "io server disconnect") newSocket.connect();
      setConnectionState(
        navigator.onLine
          ? CONNECTION_STATE.RECONNECTING
          : CONNECTION_STATE.OFFLINE,
      );
    }

    function handleReconnecting() {
      setConnectionState(
        navigator.onLine
          ? CONNECTION_STATE.RECONNECTING
          : CONNECTION_STATE.OFFLINE,
      );
    }

    function handleBrowserOffline() {
      setConnectionState(CONNECTION_STATE.OFFLINE);
    }

    function handleBrowserOnline() {
      if (!newSocket.connected) {
        setConnectionState(CONNECTION_STATE.RECONNECTING);
        newSocket.connect();
      }
    }

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.io.on("reconnect_attempt", handleReconnecting);
    window.addEventListener("offline", handleBrowserOffline);
    window.addEventListener("online", handleBrowserOnline);

    setSocket(newSocket);
    setConnectionState(CONNECTION_STATE.RECONNECTING);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.io.off("reconnect_attempt", handleReconnecting);
      window.removeEventListener("offline", handleBrowserOffline);
      window.removeEventListener("online", handleBrowserOnline);
      newSocket.disconnect();
      setSocket(null);
      setConnectionState(CONNECTION_STATE.OFFLINE);
    };
  }, [token]);

  const watchUsers = useCallback(
    (userIds, { force = false } = {}) => {
      userIds.forEach((userId) => {
        const isNew = !watchedUserIds.current.has(userId);
        watchedUserIds.current.add(userId);
        if ((isNew || force) && socket?.connected) {
          socket.emit(SOCKET_EVENT_WATCH_USER, userId);
        }
      });
    },
    [socket],
  );

  const value = useMemo(
    () => ({
      socket: IS_MOCK_MODE ? offlineSocketStub : socket,
      connectionState,
      watchUsers,
    }),
    [socket, connectionState, watchUsers],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket was used outside SocketProvider");
  }
  return context;
}

export { SocketProvider, useSocket };
