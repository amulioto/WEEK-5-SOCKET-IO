const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  username: String,
  room: { type: String, required: true, default: 'general' },
  timestamp: { type: Date, default: Date.now },
  // ... (other fields like reactions, read receipts)
});

// Get messages for a specific room
messageSchema.statics.getRoomMessages = async function(room, limit = 50) {
  return this.find({ room })
    .sort({ timestamp: -1 })
    .limit(limit)
    .exec();
};

const messageSchema = new mongoose.Schema({
  // ... existing fields
  readBy: [{
    username: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

// Add markAsRead method
messageSchema.statics.markAsRead = async function(messageId, username) {
  return this.findByIdAndUpdate(
    messageId,
    { 
      $addToSet: { 
        readBy: { 
          username,
          timestamp: new Date() 
        } 
      } 
    },
    { new: true }
  );
};

// Add method to get read status
messageSchema.statics.getReadStatus = async function(messageIds) {
  return this.find(
    { _id: { $in: messageIds } },
    { _id: 1, readBy: 1 }
  );
};

module.exports = mongoose.model('Message', messageSchema);