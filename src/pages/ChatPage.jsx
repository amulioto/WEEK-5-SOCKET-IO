import { useState } from 'react';
import RoomSelector from '../components/Chat/Room/RoomSelector';
import MessageList from '../components/Chat/Message/MessageList';
import MessageInput from '../components/Chat/Message/MessageInput';
import UserList from '../components/Chat/User/UserList';
import { useMessages } from '../hooks/useMessages';
import MessageSearch from '../components/Chat/MessageSearch';

const ChatPage = ({ currentUser }) => {
  const [currentRoom, setCurrentRoom] = useState('general');
  const { messages, sendMessage } = useMessages(currentRoom);

  return (
    <div className="chat-page">
      <div className="sidebar">
        <RoomSelector 
          currentRoom={currentRoom} 
          setCurrentRoom={setCurrentRoom} 
        />
        <UserList room={currentRoom} />
      </div>
      <div className="main-content">
        <MessageList 
          messages={messages} 
          currentUser={currentUser} 
        />
        <MessageInput 
          onSend={sendMessage} 
          room={currentRoom}
        />
      </div>
    </div>

    return (
  <div className="chat-page">
    <header>
      <h1>Chat App</h1>
      <MessageSearch room={currentRoom} />
      <NotificationCenter />
    </header>
    {/* ... rest of your chat UI ... */}
  </div>
);
  );
};
// Add this to your ChatPage component
import NotificationCenter from '../components/Chat/NotificationCenter';

// In your return statement, add the NotificationCenter
return (
  <div className="chat-page">
    <header>
      <h1>Chat App</h1>
      <NotificationCenter />
    </header>
    {/* ... rest of your chat UI ... */}
  </div>
);
export default ChatPage;