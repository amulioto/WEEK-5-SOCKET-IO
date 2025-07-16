import { useEffect, useState } from 'react';
import './UserStatus.css';

const UserStatus = ({ username, isOnline, lastSeen }) => {
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (isOnline) {
      setStatusText('Online');
    } else {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffHours = Math.floor((now - lastSeenDate) / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        setStatusText('Last seen recently');
      } else if (diffHours < 24) {
        setStatusText(`Last seen ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`);
      } else {
        setStatusText(`Last seen ${lastSeenDate.toLocaleDateString()}`);
      }
    }
  }, [isOnline, lastSeen]);

  return (
    <div className="user-status">
      <span className="username">{username}</span>
      <span className={`status ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? (
          <>
            <span className="status-dot"></span>
            {statusText}
          </>
        ) : statusText}
      </span>
    </div>
  );
};

export default UserStatus;