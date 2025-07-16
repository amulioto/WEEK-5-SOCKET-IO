const Message = require('../models/Message');

module.exports = (io, socket) => {
  // Single message read receipt
  socket.on('message read', async ({ messageId, room }) => {
    try {
      const updatedMessage = await Message.markAsRead(messageId, socket.user.username);
      io.to(room).emit('message read', { 
        messageId, 
        reader: socket.user.username,
        timestamp: updatedMessage.readBy.find(r => r.username === socket.user.username).timestamp
      });
    } catch (err) {
      console.error('Read receipt error:', err);
    }
  });

  // Batch read receipts (for when opening a chat)
  socket.on('messages read', async ({ messageIds, room }) => {
    try {
      await Message.updateMany(
        { _id: { $in: messageIds }, 'readBy.username': { $ne: socket.user.username } },
        { $addToSet: { readBy: { username: socket.user.username, timestamp: new Date() } } }
      );
      
      const readStatus = await Message.getReadStatus(messageIds);
      socket.emit('read status update', readStatus);
    } catch (err) {
      console.error('Batch read error:', err);
    }
  });
};