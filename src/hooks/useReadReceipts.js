import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

export const useReadReceipts = (room, messages, currentUser) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !messages.length) return;

    // Get unread messages
    const unreadIds = messages
      .filter(m => 
        m.username !== currentUser && 
        !m.readBy?.some(r => r.username === currentUser)
      )
      .map(m => m._id);

    if (unreadIds.length > 0) {
      socket.emit('messages read', {
        messageIds: unreadIds,
        room
      });
    }

    // Handle batch read status updates
    const handleReadStatus = (readStatus) => {
      // Update your messages state here
      // This depends on your state management
    };

    socket.on('read status update', handleReadStatus);

    return () => {
      socket.off('read status update', handleReadStatus);
    };
  }, [socket, room, messages, currentUser]);
};