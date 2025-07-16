import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import Message from './Message';
import TypingIndicator from './Message/TypingIndicator';

const ChatRoom = ({ currentUser }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('chat history', (history) => {
      setMessages(history);
    });

    socket.on('new message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user typing', ({ username, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping && !prev.includes(username)) {
          return [...prev, username];
        } else if (!isTyping) {
          return prev.filter(user => user !== username);
        }
        return prev;
      });
    });

    return () => {
      socket.off('chat history');
      socket.off('new message');
      socket.off('user typing');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      socket.emit('send message', messageInput);
      setMessageInput('');
      socket.emit('stopped typing');
    }
  };

  const handleTyping = () => {
    if (messageInput.trim()) {
      socket.emit('typing');
    } else {
      socket.emit('stopped typing');
    }
  };

  return (
    <div className="chat-room">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} isCurrentUser={msg.username === currentUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <TypingIndicator typingUsers={typingUsers} />
      
      <div className="message-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;