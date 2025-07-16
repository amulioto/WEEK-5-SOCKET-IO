const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: String,
  type: { 
    type: String,
    enum: ['private_message', 'room_message', 'user_joined', 'user_left'],
    required: true
  },
  content: String,
  relatedMessage: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Mark notifications as read
notificationSchema.statics.markAsRead = async function(ids) {
  return this.updateMany(
    { _id: { $in: ids } },
    { $set: { read: true } }
  );
};

module.exports = mongoose.model('Notification', notificationSchema);