const Message = require('../models/Message');

exports.getRoomMessages = async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender', 'username')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      sender: req.user.id
    });
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPrivateMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ]
    })
    .populate('sender recipient', 'username')
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPaginatedMessages = async (req, res) => {
  try {
    const { room, before = new Date(), limit = 20 } = req.query;
    
    const messages = await Message.find({
      room,
      createdAt: { $lt: before }
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('sender', 'username')
    .lean();

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMessages = async (req, res) => {
  try {
    const { room, query } = req.query;
    
    const messages = await Message.find({
      room,
      content: { $regex: query, $options: 'i' }
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('sender', 'username');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};