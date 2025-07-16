// client/src/components/Chat/MessageInput.jsx
const MessageInput = ({ room }) => {
  const [message, setMessage] = useState('');
  const { socket } = useSocket();
  const typingTimeout = useRef();

  const handleTyping = () => {
    socket.emit('typing', room);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopped typing', room);
    }, 2000);
  };

  return (
    <input
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
        handleTyping();
      }}
    />
  );
};