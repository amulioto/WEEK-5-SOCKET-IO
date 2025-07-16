import { useState, useEffect } from 'react';
import { useSocket } from '../../../socket/socketClient';

const RoomMessages = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !room) return;

    const handleNewMessage = (msg) => {
      if (msg.room === room) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on('new room message', handleNewMessage);
    socket.on('room history', setMessages);

    return () => {
      socket.off('new room message', handleNewMessage);
      socket.off('room history', setMessages);
    };
  }, [socket, room]);

  return (
    <div className="room-messages">
      <h2>#{room}</h2>
      <div className="messages-container">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            <strong>{msg.username}</strong>: {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomMessages;