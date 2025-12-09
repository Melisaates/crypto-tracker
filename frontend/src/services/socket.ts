import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
console.log("FRONTEND: connecting to BACKEND_URL =", BACKEND_URL);

export const socket = io(import.meta.env.VITE_BACKEND_URL!, {
  transports: ['websocket'],
  autoConnect: true,
});

// debug handlers
socket.on("connect", () => console.log("SOCKET CONNECTED", socket.id));
socket.on("connect_error", (err) => console.log("SOCKET CONNECT_ERROR", err));
socket.on("disconnect", (reason) => console.log("SOCKET DISCONNECTED", reason));
