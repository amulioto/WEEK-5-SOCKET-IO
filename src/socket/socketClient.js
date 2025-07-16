import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
let socketInstance;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000; // 5 seconds

const connectSocket = (token) => {
  if (socketInstance) socketInstance.disconnect();

  socketInstance = io(SOCKET_URL, {
    auth: { token },
    reconnection: false, // We'll handle reconnection manually
    transports: ['websocket']
  });

  // Connection error handling
  socketInstance.on('connect_error', (err) => {
    console.error('Connection error:', err);
    attemptReconnect(token);
  });

  // Disconnect handling
  socketInstance.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // Server explicitly disconnected, need to reconnect
      setTimeout(() => connectSocket(token), 1000);
    } else {
      attemptReconnect(token);
    }
  });

  return socketInstance;
};

const attemptReconnect = (token) => {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('Max reconnection attempts reached');
    return;
  }

  reconnectAttempts++;
  const delay = RECONNECT_DELAY * reconnectAttempts;

  console.log(`Attempting reconnect in ${delay/1000} seconds...`);
  setTimeout(() => connectSocket(token), delay);
};

export const getSocket = () => socketInstance;
export { connectSocket };