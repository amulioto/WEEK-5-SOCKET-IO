const validator = require('validator');
const Room = require('../models/Room');

exports.validateRegisterInput = (username, password) => {
  const errors = [];

  if (!validator.isLength(username, { min: 3, max: 20 })) {
    errors.push('Username must be between 3-20 characters');
  }

  if (!validator.isAlphanumeric(username)) {
    errors.push('Username can only contain letters and numbers');
  }

  if (!validator.isLength(password, { min: 6 })) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

exports.validateRoomInput = async (name, userId) => {
  const errors = [];

  if (!validator.isLength(name, { min: 3, max: 20 })) {
    errors.push('Room name must be between 3-20 characters');
  }

  if (!validator.isAlphanumeric(name.replace(/-/g, ''))) {
    errors.push('Room name can only contain letters, numbers and hyphens');
  }

  const roomExists = await Room.findOne({ name });
  if (roomExists) {
    errors.push('Room name already exists');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

exports.validateMessageContent = (content) => {
  const errors = [];

  if (!validator.isLength(content, { min: 1, max: 1000 })) {
    errors.push('Message must be between 1-1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};