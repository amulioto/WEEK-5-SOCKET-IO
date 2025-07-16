import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import notificationSound from '../assets/notification.mp3';

export const useNotifications = (currentUser) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();
  const audio = new Audio(notificationSound);

  const showBrowserNotification = (title, body) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  };

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Play sound
      audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Show browser notification if not focused
      if (document.visibilityState !== 'visible') {
        showBrowserNotification(
          notification.content,
          notification.type.includes('message') 
            ? notification.relatedMessage 
            : notification.content
        );
      }
    };

    const handleUserJoined = ({ username, room }) => {
      const notification = {
        content: `${username} joined ${room}`,
        type: 'user_joined',
        createdAt: new Date()
      };
      setNotifications(prev => [notification, ...prev]);
    };

    const handleUserLeft = ({ username, room }) => {
      const notification = {
        content: `${username} left ${room}`,
        type: 'user_left',
        createdAt: new Date()
      };
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);

    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
    };
  }, [socket, currentUser]);

  const markAsRead = async (notificationIds) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notificationIds })
      });
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return { notifications, unreadCount, markAsRead };
};