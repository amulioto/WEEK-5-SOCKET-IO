import { createContext, useContext, useEffect, useState } from 'react';
import { connectSocket, getSocket, disconnectSocket } from '../socket/socketClient';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connect = (token) => {
    const socketInstance = connectSocket(token);
    setSocket(socketInstance);
  };

  const disconnect = () => {
    disconnectSocket();
    setSocket(null);
  };

  useEffect(() => {
    return () => {
      if (socket) {
        disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};