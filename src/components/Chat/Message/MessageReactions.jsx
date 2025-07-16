import { useState } from 'react';
import { useSocket } from '../../../context/SocketContext';

const REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '👎'];

const MessageReactions = ({ message, currentUser, room }) => {
  const [showPicker, setShowPicker] = useState(false);
  const { socket } = useSocket();

  const handleReaction = (reaction) => {
    const currentReaction = getCurrentUserReaction();
    const newReaction = currentReaction === reaction ? '' : reaction;
    
    socket.emit('react to message', {
      messageId: message._id,
      reaction: newReaction,
      room
    });
    setShowPicker(false);
  };

  const getCurrentUserReaction = () => {
    for (const [r, users] of message.reactions) {
      if (users.includes(currentUser)) return r;
    }
    return null;
  };

  return (
    <div className="message-reactions">
      {/* Display existing reactions */}
      {Array.from(message.reactions || []).map(([reaction, users]) => (
        users.length > 0 && (
          <button
            key={reaction}
            className={`reaction ${users.includes(currentUser) ? 'my-reaction' : ''}`}
            onClick={() => handleReaction(reaction)}
          >
            {reaction} {users.length}
          </button>
        )
      ))}
      
      {/* Reaction picker */}
      <button 
        className="add-reaction"
        onClick={() => setShowPicker(!showPicker)}
      >
        +
      </button>
      
      {showPicker && (
        <div className="reaction-picker">
          {REACTION_OPTIONS.map(r => (
            <button
              key={r}
              className="reaction-option"
              onClick={() => handleReaction(r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageReactions;