import { io } from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});


// debug handlers
socket.on("connect", () => console.log("SOCKET CONNECTED", socket.id));
socket.on("connect_error", (err) => console.log("SOCKET CONNECT_ERROR", err));
socket.on("disconnect", (reason) => console.log("SOCKET DISCONNECTED", reason));
