import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const useTypingIndicator = (room) => {
  const [typers, setTypers] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !room) return;

    const handleTyping = ({ username }) => {
      setTypers(prev => [...new Set([...prev, username])]);
    };

    const handleStoppedTyping = ({ username }) => {
      setTypers(prev => prev.filter(u => u !== username));
    };

    socket.on('userTyping', handleTyping);
    socket.on('userStoppedTyping', handleStoppedTyping);

    return () => {
      socket.off('userTyping', handleTyping);
      socket.off('userStoppedTyping', handleStoppedTyping);
    };
  }, [socket, room]);

  return { typers };
};