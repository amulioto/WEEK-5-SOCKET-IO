const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipient: req.user.id },
        { room: { $in: req.user.rooms } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('sender', 'username');
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.markAsRead(req.body.notificationIds);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};