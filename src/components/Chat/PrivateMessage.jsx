const PrivateMessage = ({ currentUser }) => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState({});
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('private message', (msg) => {
      setConversations(prev => {
        const otherUser = msg.from === currentUser ? msg.to : msg.from;
        return {
          ...prev,
          [otherUser]: [...(prev[otherUser] || []), msg]
        };
      });
    });

    return () => socket.off('private message');
  }, [socket, currentUser]);

  const sendMessage = () => {
    if (message && recipient) {
      socket.emit('private message', { to: recipient, message });
      setMessage('');
    }
  };

  return (
    <div className="private-chat">
      <input 
        type="text" 
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Enter username"
      />
      
      <div className="conversation">
        {conversations[recipient]?.map((msg, i) => (
          <div key={i} className={msg.from === currentUser ? 'sent' : 'received'}>
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};