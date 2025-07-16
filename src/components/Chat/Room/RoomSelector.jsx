import { useState, useEffect } from 'react';
import { useSocket } from '../../../socket/socketClient';

const RoomSelector = ({ currentRoom, setCurrentRoom }) => {
  const [rooms, setRooms] = useState(['general', 'random', 'support']);
  const { socket } = useSocket();

  const joinRoom = (room) => {
    if (currentRoom) {
      socket.emit('leave room', currentRoom);
    }
    socket.emit('join room', room);
    setCurrentRoom(room);
  };

  return (
    <div className="room-selector">
      <h3>Channels</h3>
      <ul>
        {rooms.map(room => (
          <li 
            key={room} 
            className={currentRoom === room ? 'active' : ''}
            onClick={() => joinRoom(room)}
          >
            # {room}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomSelector;