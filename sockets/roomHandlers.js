const Message = require('../models/Message');

module.exports = (io, socket) => {
  // Join room and send history
  socket.on('joinRoom', async (room) => {
    socket.join(room);
    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username');
      
    socket.emit('roomHistory', messages.reverse());
  });

  // Leave room
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });
};