import { useState } from 'react';
import axios from 'axios';
import './MessageSearch.css';

const MessageSearch = ({ room }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(`/api/messages/search?room=${room}&query=${query}`);
      setResults(response.data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="message-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search messages..."
        />
        <button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="search-results">
          {results.map(message => (
            <div key={message._id} className="search-result-item">
              <div className="search-result-header">
                <span className="username">{message.sender.username}</span>
                <span className="timestamp">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="search-result-content">{message.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageSearch;