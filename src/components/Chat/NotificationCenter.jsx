import { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    if (unreadCount > 0) {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n._id);
      markAsRead(unreadIds);
    }
  };

  return (
    <div className="notification-center">
      <button 
        className="notification-bell"
        onClick={handleOpen}
        data-count={unreadCount > 0 ? unreadCount : null}
      >
        🔔
      </button>
      
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification._id || notification.createdAt} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                >
                  <div className="notification-content">
                    {notification.content}
                  </div>
                  <div className="notification-time">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </div>
                  {notification.type.includes('message') && (
                    <div className="notification-preview">
                      {notification.relatedMessage}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;