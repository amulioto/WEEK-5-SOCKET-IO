const { verifyToken } = require('../config/auth');
const User = require('../models/User');

module.exports = {
  verifyToken: async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error: No token provided');
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        throw new Error('Authentication error: User not found');
      }

      // Attach user to socket
      socket.user = {
        id: user._id,
        username: user.username
      };

      // Mark user as online
      user.online = true;
      await user.save();

      next();
    } catch (err) {
      next(new Error(`Authentication error: ${err.message}`));
    }
  },

  handleDisconnect: async (socket) => {
    if (socket.user?.id) {
      try {
        await User.findByIdAndUpdate(socket.user.id, {
          online: false,
          lastSeen: new Date()
        });
      } catch (err) {
        console.error('Disconnect error:', err);
      }
    }
  }
};