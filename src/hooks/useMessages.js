import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';

export const useMessages = (room) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { socket } = useSocket();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || messages.length === 0) return;
    
    setLoading(true);
    try {
      const before = messages[0].createdAt;
      const response = await axios.get(`/api/messages/paginated?room=${room}&before=${before}`);
      
      setMessages(prev => [...response.data, ...prev]);
      setHasMore(response.data.length > 0);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [messages, room, loading, hasMore]);

  const sendMessage = useCallback(async (content) => {
  if (!content.trim() || !socket) return;

  return new Promise((resolve) => {
    socket.emit('sendMessage', { room, content }, (ack) => {
      if (ack.status === 'delivered') {
        resolve(ack);
      } else {
        console.error('Message delivery failed:', ack.error);
        resolve(null);
      }
    });
  });
}, [socket, room]);
  // ... rest of your existing useMessages code ...

  return { messages, sendMessage, loadMore, loading, hasMore };
};