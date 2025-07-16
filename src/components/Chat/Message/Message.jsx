import { useMemo } from 'react';
import MessageReactions from './MessageReactions';
import ReadReceipt from './ReadReceipt';

const Message = ({ message, currentUser }) => {
  const isCurrentUser = message.sender._id === currentUser._id;
  const timestamp = useMemo(() => new Date(message.createdAt).toLocaleTimeString(), [message.createdAt]);

  return (
    <div className={`message ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="message-header">
        <span className="username">{message.sender.username}</span>
        <span className="timestamp">{timestamp}</span>
      </div>
      <div className="message-content">
        {message.content}
      </div>
      <MessageReactions 
        message={message} 
        currentUser={currentUser} 
      />
      <ReadReceipt 
        readBy={message.readBy} 
        currentUser={currentUser} 
      />
    </div>
  );
};

export default Message;