import { io } from 'socket.io-client';

// Connect to the Socket.IO server
//port 30000 is used in backend


export const socket= io(import.meta.env.VITE_BACKEND_URL || 'http://crypto-backend:3000', {
  transports: ['websocket'],
});