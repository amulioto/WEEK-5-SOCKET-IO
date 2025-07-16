import { useEffect, useRef } from 'react';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ messages, loadMore, loading, hasMore }) => {
  const listRef = useRef();
  const loadingRef = useRef(loading);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const container = listRef.current;
    
    const handleScroll = () => {
      if (container.scrollTop < 100 && !loadingRef.current && hasMore) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMore, hasMore]);

  return (
    <div className="message-list" ref={listRef}>
      {loading && <div className="loading-indicator">Loading older messages...</div>}
      {messages.map(message => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;