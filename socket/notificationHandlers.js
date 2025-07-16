const Notification = require('../models/Notification');

module.exports = (io, socket) => {
  // Notify when user joins a room
  socket.on('joinRoom', (room) => {
    socket.to(room).emit('userJoined', {
      username: socket.user.username,
      room,
      timestamp: new Date()
    });
  });

  // Notify when user leaves a room
  socket.on('leaveRoom', (room) => {
    socket.to(room).emit('userLeft', {
      username: socket.user.username,
      room,
      timestamp: new Date()
    });
  });

  // Handle message notifications
  socket.on('sendMessage', async ({ room, content, isPrivate, recipient }) => {
    if (isPrivate && recipient) {
      // Create and save private notification
      const notification = new Notification({
        recipient,
        sender: socket.user.id,
        type: 'private_message',
        content: `New message from ${socket.user.username}`,
        relatedMessage: content,
        read: false
      });
      await notification.save();

      // Emit to recipient
      io.to(recipient).emit('newNotification', notification);
    } else if (!isPrivate) {
      // Room notification logic
      const notification = new Notification({
        room,
        sender: socket.user.id,
        type: 'room_message',
        content: `New message in ${room}`,
        relatedMessage: content,
        read: false
      });
      await notification.save();

      // Emit to all room members except sender
      socket.to(room).emit('newNotification', notification);
    }
  });
};