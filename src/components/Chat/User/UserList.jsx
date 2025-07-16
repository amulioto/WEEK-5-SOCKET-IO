import { useEffect, useState } from 'react';
import { useSocket } from '../../../../context/SocketContext';
import UserStatus from './UserStatus';
import './UserList.css';

const UserList = ({ room }) => {
  const [users, setUsers] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !room) return;

    const handleUserUpdate = (userList) => {
      setUsers(userList);
    };

    socket.emit('getRoomUsers', room);
    socket.on('roomUsers', handleUserUpdate);

    return () => {
      socket.off('roomUsers', handleUserUpdate);
    };
  }, [socket, room]);

  return (
    <div className="user-list">
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <UserStatus 
              username={user.username} 
              isOnline={user.isOnline} 
              lastSeen={user.lastSeen}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;