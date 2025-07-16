import { useEffect, useState } from 'react';
import { useSocket } from '../../../context/SocketContext';

const ReadReceipt = ({ message, currentUser }) => {
  const [readBy, setReadBy] = useState(message.readBy || []);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !message._id) return;

    const handleReadUpdate = ({ messageId, reader, timestamp }) => {
      if (messageId === message._id) {
        setReadBy(prev => [
          ...prev.filter(r => r.username !== reader),
          { username: reader, timestamp }
        ]);
      }
    };

    socket.on('message read', handleReadUpdate);

    return () => {
      socket.off('message read', handleReadUpdate);
    };
  }, [socket, message._id]);

  // Filter out current user and sort by timestamp
  const otherReaders = readBy
    .filter(r => r.username !== currentUser)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (otherReaders.length === 0) return null;

  return (
    <div className="read-receipt">
      <span className="receipt-icon">✓✓</span>
      <span className="receipt-text">
        {otherReaders.length === 1
          ? `Seen by ${otherReaders[0].username}`
          : `Seen by ${otherReaders.length}`}
      </span>
    </div>
  );
};

export default ReadReceipt;