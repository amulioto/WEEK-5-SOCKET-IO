module.exports = (io, socket) => {
  socket.on('sendMessage', async ({ room, content }, callback) => {
    try {
      const message = new Message({
        content,
        sender: socket.user.id,
        room
      });
      
      await message.save();
      
      io.to(room).emit('newMessage', message);
      
      // Send acknowledgment with message ID and timestamp
      callback({
        status: 'delivered',
        messageId: message._id,
        timestamp: message.createdAt
      });
    } catch (err) {
      console.error('Message send error:', err);
      callback({ status: 'failed', error: err.message });
    }
  });
};