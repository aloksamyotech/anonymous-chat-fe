import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token?: string) => {
  if (socket && socket.connected) {
    return socket;
  }
  let authToken = (localStorage.getItem("loginToken") as string) || "";
  if (typeof window !== "undefined") {
    authToken = token || localStorage.getItem("loginToken") || "";
  }

  socket = io("http://localhost:7600", {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    extraHeaders: {
      token: authToken,
    },
    auth: { token: authToken },
    query: { token: authToken },
  });

  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection failed:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected manually");
  }
};
