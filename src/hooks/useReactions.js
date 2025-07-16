import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const useReactions = (setMessages) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleReaction = ({ messageId, reactions }) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId 
          ? { ...msg, reactions } 
          : msg
      ));
    };

    socket.on('message reaction', handleReaction);

    return () => {
      socket.off('message reaction', handleReaction);
    };
  }, [socket, setMessages]);
};