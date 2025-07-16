import { useState, useEffect } from 'react';
import { useSocket } from '../../../context/SocketContext';
import './TypingIndicator.css'; // Optional styling

const TypingIndicator = ({ room }) => {
  const [typers, setTypers] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ username, room: typingRoom }) => {
      if (typingRoom === room) {
        setTypers(prev => [...new Set([...prev, username])]);
      }
    };

    const handleStoppedTyping = ({ username, room: typingRoom }) => {
      if (typingRoom === room) {
        setTypers(prev => prev.filter(u => u !== username));
      }
    };

    socket.on('typing', handleTyping);
    socket.on('stopped typing', handleStoppedTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stopped typing', handleStoppedTyping);
    };
  }, [socket, room]);

  if (!typers.length) return null;

  return (
    <div className="typing-indicator">
      {typers.length === 1 
        ? `${typers[0]} is typing...`
        : `${typers.join(' and ')} are typing...`}
    </div>
  );
};

export default TypingIndicator;