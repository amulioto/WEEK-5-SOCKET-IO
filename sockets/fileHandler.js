const Message = require('../models/Message');

module.exports = (io, socket) => {
  socket.on('send file', async ({ room, fileUrl, fileType, originalName }) => {
    try {
      const msg = {
        username: socket.user.username,
        fileUrl,
        fileType,
        originalName,
        timestamp: new Date(),
        room
      };
      
      await Message.save(msg);
      io.to(room).emit('new file', msg);
    } catch (err) {
      console.error('File message error:', err);
      socket.emit('file error', 'Failed to send file');
    }
  });
};