// Track typing status per user
const typingUsers = new Map(); // Better than object for cleanup

module.exports = (io, socket) => {
  // User started typing in a room
  socket.on('typing', (room) => {
    typingUsers.set(socket.user.username, room);
    socket.to(room).emit('typing', {
      username: socket.user.username,
      room
    });
  });

  // User stopped typing
  socket.on('stopped typing', (room) => {
    if (typingUsers.get(socket.user.username) === room) {
      typingUsers.delete(socket.user.username);
      socket.to(room).emit('stopped typing', {
        username: socket.user.username,
        room
      });
    }
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    const room = typingUsers.get(socket.user.username);
    if (room) {
      socket.to(room).emit('stopped typing', {
        username: socket.user.username,
        room
      });
      typingUsers.delete(socket.user.username);
    }
  });
};