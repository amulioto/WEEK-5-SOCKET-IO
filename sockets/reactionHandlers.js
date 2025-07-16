const Message = require('../models/Message');

module.exports = (io, socket) => {
  // Handle reaction to message
  socket.on('react to message', async ({ messageId, reaction, room }) => {
    try {
      const updatedMessage = await Message.addReaction(
        messageId,
        socket.user.username,
        reaction
      );
      
      io.to(room).emit('message reaction', {
        messageId,
        reaction,
        username: socket.user.username,
        reactions: updatedMessage.reactions
      });
    } catch (err) {
      console.error('Reaction error:', err);
      socket.emit('reaction error', 'Failed to add reaction');
    }
  });
};